import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle, CreditCard, Flag } from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Plan Details Component
const PlanDetails = ({ plan }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
    <div className="flex justify-between items-baseline mb-4">
      <span className="text-2xl font-bold">TND {plan.price}</span>
      <span className="text-gray-500">/{plan.period}</span>
    </div>
    <div className="space-y-2">
      {plan.features.map((feature, index) => (
        <div key={index} className="flex items-center text-gray-600">
          <svg
            className="h-5 w-5 text-green-500 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
          {feature}
        </div>
      ))}
    </div>
  </div>
);

// Payment Form Component
const PaymentForm = ({ plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Create subscription on backend
      const response = await fetch('http://localhost:3001/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planType: plan.name,
          priceId: plan.priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      // Handle subscription activation
      if (data.status === 'active') {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Card Details
        </h3>
        
        <div className="mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Subscribe to ${plan.name} - TND ${plan.price}/${plan.period}`
          )}
        </button>
      </div>
    </form>
  );
};

// Flouci Payment Component
const FlouciPayment = ({ plan, onSuccess }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const amountInMillimes = Math.round(parseFloat(plan.price) * 1000);

      const response = await fetch('http://localhost:3001/api/payments/flouci/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountInMillimes,
          planType: plan.name,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to generate Flouci payment');

      // Redirect to Flouci payment page
      window.location.href = data.result.link;
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Flag className="w-5 h-5" />
        Pay with Flouci
      </h3>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <img
          src="/images/flouci-horizontal.jpg"
          alt="Flouci"
          className="h-12 mx-auto mb-2"
        />
        <p className="text-center text-gray-600">
          Secure payment using Flouci for Tunisian users
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay TND ${plan.price} with Flouci`
        )}
      </button>
    </div>
  );
};

// Main SubscriptionPayment Component
const SubscriptionPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (!location.state?.selectedPlan) {
      navigate('/subscription-plans');
      return;
    }
    setSelectedPlan(location.state.selectedPlan);
  }, [location.state, navigate]);

  const handlePaymentSuccess = (data) => {
    // Update user context with new subscription
    navigate('/subscription-success', { state: { subscription: data } });
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
          <p className="mt-2 text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <PlanDetails plan={selectedPlan} />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full p-3 rounded-lg border-2 text-left ${
                    paymentMethod === 'stripe'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span>Credit Card (International)</span>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('flouci')}
                  className={`w-full p-3 rounded-lg border-2 text-left ${
                    paymentMethod === 'flouci'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <Flag className="w-5 h-5 mr-2" />
                    <span>Flouci (Tunisia)</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div>
            {paymentMethod === 'stripe' ? (
              <Elements stripe={stripePromise}>
                <PaymentForm plan={selectedPlan} onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <FlouciPayment plan={selectedPlan} onSuccess={handlePaymentSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
