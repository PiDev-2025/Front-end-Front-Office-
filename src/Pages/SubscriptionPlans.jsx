import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Parkini Free",
      price: "0",
      period: "month",
      description: "Basic parking features",
      features: [
        "2 hours max reservation",
        "1 active reservation",
        "No cancellation window",
        "No price discount",
        "Standard support",
        "No car wash included",
        "Ads included"
      ],
      highlight: false,
      buttonText: "Start Free"
    },
    {
      name: "Parkini Standard",
      price: "29.99",
      period: "month",
      description: "Enhanced parking experience with priority support",
      features: [
        "12 hours max reservation",
        "3 active reservations",
        "2 hours cancellation window",
        "5% price discount",
        "Priority support",
        "1 car wash per month",
        "No ads"
      ],
      highlight: true,
      buttonText: "Get Standard"
    },
    {
      name: "Parkini Premium",
      price: "49.99",
      period: "month",
      description: "Ultimate parking experience with VIP benefits",
      features: [
        "24 hours max reservation",
        "Unlimited active reservations",
        "30 min cancellation window",
        "15% price discount",
        "VIP support",
        "2 car washes per month",
        "No ads"
      ],
      highlight: false,
      buttonText: "Go Premium"
    }
  ];

  const handleSelectPlan = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
    navigate('/subscription-payment', { state: { selectedPlan: plan } });
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Parking Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the plan that best fits your parking needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 ${
                plan.highlight
                  ? 'border-2 border-blue-500 transform scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium z-10">
                  Popular
                </div>
              )}

              <div className="bg-white p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      TND {plan.price}
                    </span>
                    <span className="ml-2 text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-gray-600"
                    >
                      <svg
                        className="h-5 w-5 text-blue-500 mr-2"
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
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full rounded-lg px-4 py-3 text-lg font-semibold transition-colors duration-300 ${
                      plan.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include access to our parking network and mobile app
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="#features"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all features
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="#faq"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;