from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import pickle
import joblib
import os
from datetime import datetime, timedelta
from prophet import Prophet

app = Flask(__name__)

MODEL_DIR = 'model'
MODEL_PATH = os.path.join(MODEL_DIR, 'prophet_parking_model.pkl')
CONFIG_PATH = os.path.join(MODEL_DIR, 'pattern_config.joblib')

# Load the Prophet model and configuration
def load_model():
    """Load the saved Prophet model"""
    if not os.path.exists(MODEL_PATH):
        return None, {"error": f"Model not found at {MODEL_PATH}"}
    
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        
        # Also load configuration if available
        config = {}
        if os.path.exists(CONFIG_PATH):
            config = joblib.load(CONFIG_PATH)
            
        return model, config
    except Exception as e:
        return None, {"error": f"Error loading model: {str(e)}"}

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

def generate_daily_schedule(model, config=None):
    """Generate a daily pricing schedule for the next week"""
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
                'hour_formatted': f"{hour_data['hour']}:00",
                'tier': tier,
                'price': round(price, 2),
                'predicted_occupancy': round(hour_data['yhat'], 1)
            })
        pricing_schedule[day] = daily_schedule
    
    return pricing_schedule

def get_current_pricing_tier(model):
    """Get the current pricing tier based on day and hour"""
    now = datetime.now()
    current_day = now.strftime("%A")
    current_hour = now.hour
    
    pricing_tiers = get_pricing_tiers(model)
    
    for hour_data in pricing_tiers[current_day]:
        if hour_data['hour'] == current_hour:
            return {
                'day': current_day,
                'hour': current_hour,
                'hour_formatted': f"{current_hour}:00",
                'pricing_tier': hour_data['pricing_tier'],
                'predicted_occupancy': round(hour_data['yhat'], 1)
            }

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Smart Parking API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/pricing/current', methods=['GET'])
def current_pricing():
    """Get the current pricing tier"""
    model, config = load_model()
    if model is None:
        return jsonify(config), 500
    
    tier_info = get_current_pricing_tier(model)
    
    # Add pricing information
    tier_multipliers = {
        'Low': 1.0,
        'Medium': 1.25,
        'High': 1.5,
        'Premium': 2.0
    }
    base_price = 2.00
    
    price = base_price * tier_multipliers[tier_info['pricing_tier']]
    tier_info['price'] = round(price, 2)
    
    return jsonify(tier_info)

@app.route('/api/pricing/schedule', methods=['GET'])
def pricing_schedule():
    """Get the full pricing schedule"""
    model, config = load_model()
    if model is None:
        return jsonify(config), 500
    
    days = request.args.get('days', default=7, type=int)
    schedule = generate_daily_schedule(model)
    
    return jsonify(schedule)

@app.route('/api/peaks', methods=['GET'])
def peak_hours():
    """Get peak hours by day"""
    model, config = load_model()
    if model is None:
        return jsonify(config), 500
    
    days = request.args.get('days', default=7, type=int)
    peaks = get_peak_hours(model, days)
    
    return jsonify(peaks)

@app.route('/api/forecast', methods=['GET'])
def forecast():
    """Get detailed forecast for a specific day"""
    model, config = load_model()
    if model is None:
        return jsonify(config), 500
    
    day = request.args.get('day', default=None)
    
    if not day:
        # If no day specified, use today
        day = datetime.now().strftime("%A")
    
    # Get full schedule
    schedule = generate_daily_schedule(model)
    
    # Return just the requested day
    if day in schedule:
        return jsonify({day: schedule[day]})
    else:
        return jsonify({"error": f"Invalid day: {day}. Use Monday through Sunday."}), 400

@app.route('/api/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    model, config = load_model()
    if model is None:
        return jsonify(config), 500
    
    # Get model parameters
    model_params = model.params
    
    # Get configuration
    if not config:
        config = {"message": "No configuration found"}
    
    # Return model metadata
    return jsonify({
        "model_type": "Prophet",
        "parameters": {
            "daily_seasonality": model_params.get('daily_seasonality', True),
            "weekly_seasonality": model_params.get('weekly_seasonality', True),
            "yearly_seasonality": model_params.get('yearly_seasonality', False),
            "seasonality_mode": model_params.get('seasonality_mode', 'multiplicative'),
            "interval_width": model_params.get('interval_width', 0.95)
        },
        "config": config
    })

# Main entry point
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)