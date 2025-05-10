import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeadTitle from "../Components/Pages/HeadTitle";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

// Create pending subscription function
const createPendingSubscription = async (selectedPlan, token) => {
  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const subscriptionData = {
      subscriptionId: `SUB-${Date.now()}`,
      userId: userId,
      parkingId: "default",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "Active",
      price: selectedPlan.price,
      plan: selectedPlan.name,
    };

    const subscriptionResponse = await fetch(
      "http://localhost:3001/api/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      }
    );

    if (!subscriptionResponse.ok) {
      throw new Error("Failed to create subscription");
    }

    return await subscriptionResponse.json();
  } catch (err) {
    throw err;
  }
};

const SubscriptionDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = token ? jwtDecode(token).role : null;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      if (userRole !== "Driver") {
        setError("Only drivers can subscribe to plans");
        return;
      }

      setIsProcessing(true);
      setError(null);
      if (planId === "free") {
        // Handle free subscription
        const subscription = await createPendingSubscription(plan, token);

        if (subscription) {
          // Update user type
          const userId = jwtDecode(token).id;
          const updateResponse = await fetch(
            `http://localhost:3001/User/users/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ typeSubscription: "Free" }), // Match the schema field name
            }
          );

          if (!updateResponse.ok) {
            throw new Error("Failed to update user subscription type");
          }

          setSuccess(true);
          setTimeout(() => {
            navigate("/"); // Navigate to home instead of dashboard
          }, 2000);
        }
      } else {
        // Navigate to payment for paid plans
        navigate(`/subscription-payment/${planId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to process subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = {
    free: {
      name: "Parkini Free",
      price: "0",
      description:
        "Ideal for occasional users looking for a simple parking solution.",
      features: [
        "Basic parking spot search",
        "Visualization of available parking on map",
        "Hourly reservations only",
        "Access to basic parking information",
        "1 active reservation at a time",
        "Secure payment",
        "Standard customer support",
      ],
      limitations: [
        "No access to preferred pricing",
        "No access to premium parking",
        "No multiple reservations",
        "No free cancellation",
      ],
    },
    standard: {
      name: "Parkini Standard",
      price: "29.99",
      description: "For regular users who need more flexibility and benefits.",
      features: [
        "All Parkini Free features",
        "Hourly, daily and weekly reservations",
        "Up to 3 active simultaneous reservations",
        "Preferred pricing (-5% on all reservations)",
        "Free cancellation up to 2 hours before",
        "Access to Indoor and Underground parking",
        "Real-time availability notifications",
        "Priority daytime customer support",
        "Detailed reservation history",
        "Automatic invoices",
      ],
      limitations: [
        "No access to monthly reservations",
        "Limit of 3 simultaneous reservations",
        "No access to premium spots",
      ],
    },
    premium: {
      name: "Parkini Premium",
      price: "49.99",
      description:
        "The ultimate solution for professionals and power users who want the best service.",
      features: [
        "All Parkini Standard features",
        "Hourly, daily, weekly and monthly reservations",
        "Unlimited simultaneous reservations",
        "Preferred pricing (-15% on all reservations)",
        "Free cancellation up to 30 minutes before",
        "Priority access to premium spots",
        "Flexible parking duration extension",
        "24/7 VIP customer service",
        "Unlimited entries/exits option on same reservation",
        "Guaranteed spots with partner parking",
        "Loyalty points system",
        "Personalized monthly reports",
        "Access to exclusive events",
      ],
      limitations: [],
    },
  };

  const plan = plans[planId];

  if (!plan) {
    return <div className="text-center py-10">Plan not found</div>;
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
      <HeadTitle title={plan.name} sub="SUBSCRIPTION DETAILS" />

      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Header with price */}{" "}
          <motion.div className="text-center mb-12" variants={slideUp}>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {plan.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              {plan.description}
            </p>
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-extrabold text-gray-900">
                ${plan.price}
              </span>
              <span className="ml-2 text-2xl font-medium text-gray-500">
                /month
              </span>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                Successfully subscribed to {plan.name}! Redirecting to
                dashboard...
              </div>
            )}
          </motion.div>
          {/* Detailed description */}
          <motion.div
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
            variants={slideUp}
            transition={{ delay: 0.2 }}
          >
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Included Features
              </h2>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <svg
                      className="h-5 w-5 text-green-500 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {plan.limitations.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
                    Limitations
                  </h2>
                  <ul className="space-y-3">
                    {plan.limitations.map((limitation, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <svg
                          className="h-5 w-5 text-red-500 flex-shrink-0 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700">{limitation}</span>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </div>{" "}
            {/* Action buttons */}
            <div className="px-6 py-8 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <motion.button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className={`flex-1 bg-blue-600 text-black py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-md !important ${
                    isProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  style={{
                    boxShadow: "0 4px 14px rgba(0, 118, 255, 0.39)",
                  }}
                  whileHover={!isProcessing ? { scale: 1.02 } : {}}
                  whileTap={!isProcessing ? { scale: 0.98 } : {}}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                    `Subscribe ${planId === "free" ? "Now" : "& Pay"}`
                  )}
                </motion.button>
                <motion.button
                  onClick={() => navigate("/subscriptions")}
                  disabled={isProcessing}
                  className={`flex-1 bg-white text-blue-600 border-2 border-blue-600 py-3 px-6 rounded-lg font-medium transition-all duration-300 !important ${
                    isProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600 hover:text-white"
                  }`}
                  whileHover={!isProcessing ? { scale: 1.02 } : {}}
                  whileTap={!isProcessing ? { scale: 0.98 } : {}}
                >
                  Compare Plans
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SubscriptionDetails;
