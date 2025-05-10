import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Check, Clock, AlertCircle, Globe, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Plan data - keeping it consistent with Subscriptions.jsx
const plans = {
  free: {
    name: "Parkini Free",
    price: 0,
  },
  standard: {
    name: "Parkini Standard",
    price: 29.99,
  },
  premium: {
    name: "Parkini Premium",
    price: 49.99,
  },
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <Check className="w-4 h-4" />,
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          icon: <Clock className="w-4 h-4" />,
        };
      case "rejected":
      case "failed":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <AlertCircle className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const styles = getStatusStyles();
  const displayStatus =
    status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";

  return (
    <span
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles.bg} ${styles.text}`}
    >
      {styles.icon}
      {displayStatus}
    </span>
  );
};

// Move createPendingSubscription before the component
const createPendingSubscription = async (selectedPlan, token) => {
  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const subscriptionData = {
      subscriptionId: `SUB-${Date.now()}`,
      userId: userId,
      parkingId: "default",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "Cancelled", // Initial status is Cancelled until payment is confirmed
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

// Generate PDF receipt
const generatePaymentReceipt = async (
  paymentDetails,
  userDetails,
  subscription
) => {
  try {
    // Create new jsPDF instance
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set background color
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add header with styling
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Payment Receipt", pageWidth / 2, 30, { align: "center" });

    // Try to add logo
    try {
      const logoUrl = "/images/Parkini.png";
      doc.addImage(logoUrl, "PNG", 20, 15, 30, 30);
    } catch (error) {
      console.warn("Could not add logo to PDF:", error);
    }

    // Add divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 45, pageWidth - 20, 45);

    // Add current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 20, 55);

    // Add receipt number
    const receiptNo = `RCP-${Date.now()}`;
    doc.text(`Receipt No: ${receiptNo}`, 20, 62);

    // Customer details section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Customer Details", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${userDetails.name || "N/A"}`, 25, 82);
    doc.text(`Email: ${userDetails.email || "N/A"}`, 25, 89);

    // Subscription details section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Subscription Details", 20, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Plan: ${subscription.plan}`, 25, 112);
    doc.text(
      `Start Date: ${new Date(subscription.startDate).toLocaleDateString()}`,
      25,
      119
    );
    doc.text(
      `End Date: ${new Date(subscription.endDate).toLocaleDateString()}`,
      25,
      126
    );
    // Add subscription type based on price
    const subscriptionType =
      subscription.price === 29.99
        ? "Standard"
        : subscription.price === 49.99
        ? "Premium"
        : "Unknown";
    doc.text(`Subscription Type: ${subscriptionType}`, 25, 133);

    // Payment details section with box
    doc.setFillColor(247, 250, 252);
    doc.rect(20, 140, pageWidth - 40, 35, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Payment Information", 25, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Payment ID: ${paymentDetails.id}`, 25, 157);
    doc.text(`Amount Paid: €${subscription.price.toFixed(2)}`, 25, 164);
    doc.text(`Payment Status: Completed`, 25, 171);

    // Add footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      "Thank you for choosing Parkini!",
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );

    // Add current timestamp to filename to ensure uniqueness
    const timestamp = new Date().getTime();
    const filename = `parkini-receipt-${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);
    console.log("PDF generated successfully:", filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

// Main SubscriptionPayment Component
const SubscriptionPayment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { planId } = useParams();
  const navigate = useNavigate();
  const selectedPlan = plans[planId];
  const convertedPrice = selectedPlan ? selectedPlan.price : 0; // Price in EUR

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      // Prevent multiple initializations
      if (isInitialized || !isMounted) return;

      try {
        setLoading(true);
        // Validate plan
        if (!planId || !selectedPlan) {
          setError("Invalid subscription plan selected");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first");
          return;
        }

        // Check for active subscription first
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const subscriptionsResponse = await fetch(
          `http://localhost:3001/api/subscriptions/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (subscriptionsResponse.ok) {
          const subscriptions = await subscriptionsResponse.json();
          const activeSubscription = subscriptions.find(
            (sub) => sub.status === "Active" && sub.plan === selectedPlan.name
          );

          if (activeSubscription) {
            setError(
              `You already have an active ${selectedPlan.name} subscription`
            );
            return;
          }

          // Also check for any pending subscriptions for this plan
          const pendingSubscription = subscriptions.find(
            (sub) =>
              sub.status === "Cancelled" &&
              sub.plan === selectedPlan.name &&
              new Date(sub.startDate) >
                new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
          );

          if (pendingSubscription) {
            setPendingSubscription(pendingSubscription);
            localStorage.setItem(
              "pendingSubscriptionId",
              pendingSubscription._id
            );
            return;
          }
        }

        // Only create new subscription if we don't have a pending one
        const pendingSubId = localStorage.getItem("pendingSubscriptionId");
        if (pendingSubId) {
          const response = await fetch(
            `http://localhost:3001/api/subscriptions/${pendingSubId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const subscription = await response.json();
            if (subscription && subscription.plan === selectedPlan.name) {
              setPendingSubscription(subscription);
              return;
            }
            // If subscription exists but doesn't match current plan, remove it
            localStorage.removeItem("pendingSubscriptionId");
          } else {
            localStorage.removeItem("pendingSubscriptionId");
          }
        }

        // Create new subscription only if we haven't found any existing ones
        await createNewSubscription(token);
      } catch (err) {
        console.error("Initialization error:", err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [planId, selectedPlan, isInitialized]); // Add isInitialized to dependencies

  // Move createNewSubscription outside useEffect but keep it in component scope
  const createNewSubscription = async (token) => {
    try {
      // For free plan, we can skip creation and just activate
      if (selectedPlan.price === 0) {
        const subscription = await createPendingSubscription(
          selectedPlan,
          token
        );
        setPendingSubscription(subscription);
        localStorage.setItem("pendingSubscriptionId", subscription._id);
        await handleFreeSubscription(subscription._id);
        return;
      }

      // For paid plans, create pending subscription
      const subscription = await createPendingSubscription(selectedPlan, token);
      setPendingSubscription(subscription);
      localStorage.setItem("pendingSubscriptionId", subscription._id);
    } catch (err) {
      console.error("Failed to create subscription:", err);
      setError(err.message);
    }
  };

  // Handle free subscription activation
  const handleFreeSubscription = async (subscriptionId) => {
    try {
      const token = localStorage.getItem("token");

      // Update the existing subscription to Active status
      const response = await fetch(
        `http://localhost:3001/api/subscriptions/${subscriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "Active",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate free subscription");
      }

      // Clean up
      localStorage.removeItem("pendingSubscriptionId");
      setPaymentSuccess(true);
      setTimeout(() => navigate("/subscriptions"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Payment Form Component with Stripe
  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
      const initializePayment = async () => {
        try {
          if (!pendingSubscription) return;

          const token = localStorage.getItem("token");

          // Create subscription payment intent
          const paymentResponse = await fetch(
            "http://localhost:3001/api/payments/create-subscription-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                subscriptionId: pendingSubscription._id,
                amount: convertedPrice,
              }),
            }
          );

          const paymentData = await paymentResponse.json();
          if (!paymentResponse.ok) throw new Error(paymentData.message);

          setClientSecret(paymentData.clientSecret);
        } catch (err) {
          setPaymentError(err.message);
        }
      };

      initializePayment();
    }, [pendingSubscription]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      setProcessing(true);

      if (!stripe || !elements || !clientSecret || !pendingSubscription) {
        setProcessing(false);
        return;
      }

      try {
        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          });

        if (stripeError) {
          setPaymentError(stripeError.message);
        } else if (paymentIntent.status === "succeeded") {
          const token = localStorage.getItem("token");
          const decoded = jwtDecode(token);

          // Update existing subscription status
          const updateResponse = await fetch(
            `http://localhost:3001/api/subscriptions/${pendingSubscription._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status: "Active",
                paymentId: paymentIntent.id,
              }),
            }
          );

          if (!updateResponse.ok) {
            throw new Error("Failed to activate subscription");
          }

          // Update user's subscription type based on payment amount
          const userUpdateResponse = await fetch(
            `http://localhost:3001/User/users/${decoded.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                typeSubscription:
                  convertedPrice === 29.99 ? "Standard" : "Premium",
              }),
            }
          );

          if (!userUpdateResponse.ok) {
            console.warn("Failed to update user subscription type");
          }

          // Delete all canceled subscriptions for this user
          const deleteCanceledResponse = await fetch(
            `http://localhost:3001/api/subscriptions/user/${decoded.id}/canceled`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!deleteCanceledResponse.ok) {
            console.warn("Failed to cleanup canceled subscriptions");
          } // Clean up
          localStorage.removeItem("pendingSubscriptionId");

          // Get user details
          try {
            const userResponse = await fetch(
              `http://localhost:3001/User/users/${decoded.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (userResponse.ok) {
              const userDetails = await userResponse.json(); // Generate PDF receipt
              try {
                await generatePaymentReceipt(
                  paymentIntent,
                  userDetails,
                  pendingSubscription
                );
                console.log("Receipt generated successfully");
              } catch (error) {
                console.error("Error generating receipt:", error);
              }
            }
          } catch (error) {
            console.error("Failed to generate receipt:", error);
          }

          // Set success and navigate
          setPaymentSuccess(true);
          setTimeout(() => navigate("/subscriptions"), 2000);
        }
      } catch (err) {
        setPaymentError(err.message);
      } finally {
        setProcessing(false);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <Globe className="w-5 h-5" /> Card Payment
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Card Information
            </label>
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      iconColor: "#3b82f6",
                    },
                    invalid: {
                      color: "#e53e3e",
                      iconColor: "#e53e3e",
                    },
                  },
                }}
              />
            </div>
          </div>

          {paymentError && (
            <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <div className="flex">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
            <span className="text-gray-700 font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">
              €{convertedPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className={`w-full py-3 px-6 rounded-lg font-medium text-black transition-all ${
              !stripe || !clientSecret || processing
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-black"
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
              `Pay €${convertedPrice.toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => navigate("/subscriptions")}
                className="mt-3 flex items-center text-red-700 hover:text-red-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Return to Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Subscribe to {selectedPlan.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Complete your payment to activate your subscription
        </p>
      </div>

      {paymentSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
          <Check className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="font-bold text-green-800">
              Subscription Activated!
            </h3>
            <p className="text-green-700">
              Your subscription has been activated successfully.
              {selectedPlan.price === 0
                ? " Enjoy your free plan!"
                : " You'll receive a confirmation email shortly."}
            </p>
          </div>
        </div>
      )}

      {!loading &&
        !paymentSuccess &&
        selectedPlan.price > 0 &&
        pendingSubscription && (
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        )}
    </div>
  );
};

export default SubscriptionPayment;
