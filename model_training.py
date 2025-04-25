import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
from prophet import Prophet
import pickle
import os
import joblib

def train_parking_model():
    """Train the Prophet model and save it for future use"""

    print("Training new parking model...")

    # Define base hourly occupancy pattern with morning and afternoon peaks
    base_hourly_occupancy = {
        0: 30,  1: 20,  2: 15,  3: 10,  4: 15,  5: 25,
        6: 45,  7: 70,  8: 95,  9: 90,  10: 85, 11: 75,
        12: 80, 13: 95, 14: 85, 15: 80, 16: 85, 17: 80,
        18: 70, 19: 60, 20: 50, 21: 45, 22: 40, 23: 35
    }

    day_multipliers = {
        0: 1.0,   
        1: 1.05,   
        2: 1.1,   
        3: 1.15,   
        4: 1.2,    
        5: 0.7,    
        6: 0.5     
    }

    weekend_hourly_shift = {
        5: 2,      
        6: 3       
    }

    days_to_simulate = 30  

    prophet_df = pd.DataFrame()
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = today - timedelta(days=today.weekday()) 

    for day_offset in range(days_to_simulate):
        day_date = start_date + timedelta(days=day_offset)
        day_of_week = day_date.weekday()  

        for hour, base_occupancy in base_hourly_occupancy.items():
            # Apply day-specific shift for weekends
            adjusted_hour = hour
            if day_of_week in weekend_hourly_shift:
                adjusted_hour = (hour - weekend_hourly_shift[day_of_week]) % 24

            # Get base occupancy for this hour (with possible weekend shift)
            base_value = base_hourly_occupancy[adjusted_hour]

            # Apply day of week multiplier
            day_multiplier = day_multipliers[day_of_week]
            occupancy = base_value * day_multiplier

            # Add some random noise for realism
            noise = np.random.normal(0, occupancy * 0.1) if occupancy > 0 else 0
            adjusted_occupancy = max(0, occupancy + noise)

            timestamp = day_date + timedelta(hours=hour)

            prophet_df = pd.concat([prophet_df, pd.DataFrame({
                'ds': [timestamp],
                'y': [adjusted_occupancy]
            })])

    # Sort by timestamp
    prophet_df = prophet_df.sort_values('ds').reset_index(drop=True)

    # Save the training data for reference
    os.makedirs('model', exist_ok=True)
    prophet_df.to_csv('model/training_data.csv', index=False)

    # Train Prophet model
    model = Prophet(
        daily_seasonality=True,      # Model hourly patterns within a day
        weekly_seasonality=True,     # Model day-of-week patterns
        yearly_seasonality=False,    # Not enough data for yearly patterns
        seasonality_mode='multiplicative',  # Better for data with clear seasonal patterns
        interval_width=0.95          # 95% prediction intervals
    )

    model.fit(prophet_df)

    # Save the model
    with open('model/prophet_parking_model.pkl', 'wb') as f:
        pickle.dump(model, f)

    # Save base patterns for reference
    joblib.dump({
        'base_hourly_occupancy': base_hourly_occupancy,
        'day_multipliers': day_multipliers,
        'weekend_hourly_shift': weekend_hourly_shift
    }, 'model/pattern_config.joblib')

    print(f"Model saved to model/prophet_parking_model.pkl")
    return model

def load_parking_model():
    """Load the saved Prophet model"""
    model_path = 'model/prophet_parking_model.pkl'

    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}. Training new model...")
        return train_parking_model()

    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print(f"Model loaded from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Training new model instead...")
        return train_parking_model()

def get_peak_hours(model, days_to_forecast=7):
    """Get peak hours by day of week using the trained model"""
    # Create future dataframe for prediction
    future = model.make_future_dataframe(periods=24*days_to_forecast, freq='H')
    forecast = model.predict(future)

    # Extract patterns by hour and day of week
    forecast['hour'] = forecast['ds'].dt.hour
    forecast['day_of_week'] = forecast['ds'].dt.dayofweek
    forecast['day_name'] = forecast['ds'].dt.day_name()

    # Analyze peak hours by day of week
    day_hour_forecast = forecast.groupby(['day_of_week', 'day_name', 'hour'])['yhat'].mean().reset_index()

    # Find peak hours for each day of week
    peak_hours_by_day = {}
    for day in range(7):
        day_data = day_hour_forecast[day_hour_forecast['day_of_week'] == day]
        day_name = day_data['day_name'].iloc[0]
        peaks = day_data.sort_values(by='yhat', ascending=False).head(5)
        peak_hours_by_day[day_name] = peaks[['hour', 'yhat']].to_dict('records')

    return peak_hours_by_day

def get_pricing_tiers(model, days_to_forecast=7):
    """Get pricing tiers by hour and day of week"""
    # Create future dataframe for prediction
    future = model.make_future_dataframe(periods=24*days_to_forecast, freq='H')
    forecast = model.predict(future)

    # Extract patterns by hour and day of week
    forecast['hour'] = forecast['ds'].dt.hour
    forecast['day_of_week'] = forecast['ds'].dt.dayofweek
    forecast['day_name'] = forecast['ds'].dt.day_name()

    # Analyze by day of week
    day_hour_forecast = forecast.groupby(['day_of_week', 'day_name', 'hour'])['yhat'].mean().reset_index()

    # Calculate pricing tiers for each day
    pricing_by_day = {}
    for day in range(7):
        day_data = day_hour_forecast[day_hour_forecast['day_of_week'] == day].copy()
        day_data['percentile'] = day_data['yhat'].rank(pct=True)
        day_data['pricing_tier'] = pd.cut(
            day_data['percentile'],
            bins=[0, 0.25, 0.5, 0.75, 1.0],
            labels=['Low', 'Medium', 'High', 'Premium']
        )

        day_name = day_data['day_name'].iloc[0]
        pricing_by_day[day_name] = day_data[['hour', 'yhat', 'pricing_tier']].to_dict('records')

    return pricing_by_day

def get_current_pricing_tier(model=None):
    """Get the current pricing tier based on day and hour"""
    if model is None:
        model = load_parking_model()

    now = datetime.now()
    current_day = now.strftime("%A")
    current_hour = now.hour

    pricing_tiers = get_pricing_tiers(model)

    for hour_data in pricing_tiers[current_day]:
        if hour_data['hour'] == current_hour:
            return {
                'day': current_day,
                'hour': current_hour,
                'pricing_tier': hour_data['pricing_tier'],
                'predicted_occupancy': hour_data['yhat']
            }

def generate_daily_schedule(model=None):
    """Generate a daily pricing schedule for the next week"""
    if model is None:
        model = load_parking_model()

    pricing_tiers = get_pricing_tiers(model)

    # Define price multipliers for each tier
    tier_multipliers = {
        'Low': 1.0,       # Base price
        'Medium': 1.25,   # 25% increase
        'High': 1.5,      # 50% increase
        'Premium': 2.0    # 100% increase (double price)
    }

    base_price = 2.00  # Base hourly rate in dollars

    # Generate pricing schedule for each day
    pricing_schedule = {}
    for day, hours in pricing_tiers.items():
        daily_schedule = []
        for hour_data in sorted(hours, key=lambda x: x['hour']):
            tier = hour_data['pricing_tier']
            price = base_price * tier_multipliers[tier]
            daily_schedule.append({
                'hour': hour_data['hour'],
                'tier': tier,
                'price': round(price, 2),
                'predicted_occupancy': round(hour_data['yhat'], 1)
            })
        pricing_schedule[day] = daily_schedule

    return pricing_schedule

def save_pricing_schedule(schedule=None, filename='pricing_schedule.csv'):
    """Save the pricing schedule to a CSV file"""
    if schedule is None:
        model = load_parking_model()
        schedule = generate_daily_schedule(model)

    # Flatten the schedule into a dataframe
    records = []
    for day, hours in schedule.items():
        for hour_data in hours:
            records.append({
                'Day': day,
                'Hour': hour_data['hour'],
                'Pricing_Tier': hour_data['tier'],
                'Price': hour_data['price'],
                'Predicted_Occupancy': hour_data['predicted_occupancy']
            })

    df = pd.DataFrame(records)
    df.to_csv(filename, index=False)
    print(f"Pricing schedule saved to {filename}")
    return df

# Example usage
if __name__ == "__main__":
    # Train or load the model
    model = load_parking_model()

    # Generate and save the pricing schedule
    schedule = generate_daily_schedule(model)
    save_pricing_schedule(schedule)

    # Get the current pricing tier
    current_tier = get_current_pricing_tier(model)
    print(f"\nCurrent pricing tier: {current_tier['pricing_tier']}")
    print(f"Time: {current_tier['day']} {current_tier['hour']}:00")
    print(f"Predicted occupancy: {current_tier['predicted_occupancy']:.1f} vehicles")

    # Get peak hours
    peak_hours = get_peak_hours(model)
    print("\nTop 5 peak hours by day:")
    for day, peaks in peak_hours.items():
        print(f"\n{day}:")
        for i, peak in enumerate(peaks):
            print(f"  Peak {i+1}: {int(peak['hour'])}:00 - {peak['yhat']:.1f} vehicles")

    print("\nModel implementation is ready for production use!")
    print("Use load_parking_model() to load the model")
    print("Use get_current_pricing_tier() to get the current pricing tier")
    print("Use generate_daily_schedule() to get the full pricing schedule")