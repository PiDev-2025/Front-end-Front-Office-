import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Check,
  Clock,
  Calendar,
  Car,
  CreditCard,
  AlertCircle,
  Globe,
  Flag,
  X,
  Download,
} from "lucide-react";
import QRCode from "qrcode";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

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

// Helper function to calculate prices
const calculatePrices = (reservation) => {
  if (!reservation) return { original: 0, converted: 0 };

  const originalPrice = reservation.totalPrice || 0;
  const convertedPrice = originalPrice / 3; // Convert TND to EUR by dividing by 3

  return {
    original: originalPrice,
    converted: convertedPrice,
  };
};

// Flouci Payment Component - For Tunisians (original price in TND)
const FlouciPayment = ({ reservation, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { original: totalPrice } = calculatePrices(reservation);

  const onPaymentSuccess = async (reservationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://parkini-backend.onrender.com/api/reservations/${reservationId}/statusPayment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "accepted",
            paymentStatus: "completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      const updatedReservation = await response.json();
      onSuccess && onSuccess(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("Failed to update reservation status");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      // Convert the price to millimes (multiply by 1000)
      const amountInMillimes = Math.round(totalPrice * 1000);

      // Store the reservation ID in localStorage for verification after redirect
      localStorage.setItem("currentReservationId", reservation._id);

      const response = await fetch(
        "https://parkini-backend.onrender.com/api/payments/flouci/paiement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: amountInMillimes,
            reservationId: reservation._id,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to generate Flouci payment");

      // Redirect to the Flouci payment link
      window.location.href = data.result.link;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h3 className="text-xl font-bold text-black flex items-center gap-2">
          <Flag className="w-5 h-5" /> Flouci Payment (Tunisia)
        </h3>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg mb-6">
          <div className="text-center">
            <img
              src="/images/flouci-horizontal.jpg"
              alt="Flouci Logo"
              className="mx-auto mb-3"
            />
            <p className="text-gray-700">
              Pay securely using Flouci, supporting Tunisian Dinar payments.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-xl font-bold text-blue-600">
            TND {totalPrice?.toFixed(3) || "0.000"}
          </span>
        </div>

        <div className="flex justify-center">
  <button
    onClick={handlePayment}
    disabled={loading}
    className={`bg-black text-white px-6 py-3 rounded-full font-semibold 
            shadow-lg flex items-center space-x-2 hover:bg-blue-50 hover:text-black transition-all duration-300 
            transform hover:scale-105 ${
      loading
        ? "bg-blue-300 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {loading ? (
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
      `Pay with Flouci TND ${totalPrice?.toFixed(3) || "0.000"}`
    )}
  </button>
</div>
      </div>
    </div>
  );
};

// Payment Form Component - For International Users (converted price in EUR)
const PaymentForm = ({ reservationId, reservation, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { converted: convertedPrice } = calculatePrices(reservation);

  const onPaymentSuccess = async (reservationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://parkini-backend.onrender.com/api/reservations/${reservationId}/statusPayment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "accepted",
            paymentStatus: "completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      const updatedReservation = await response.json();
      onSuccess && onSuccess(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("Failed to update reservation status");
    }
  };

  useEffect(() => {
    if (reservationId) {
      const fetchPaymentIntent = async () => {
        try {
          const token = localStorage.getItem("token");
          // Send the converted price (divided by 3) to the backend
          const response = await fetch(
            "https://parkini-backend.onrender.com/api/payments/create-payment-intent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                reservationId,
                // Add the converted amount
                amount: convertedPrice,
              }),
            }
          );

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          setClientSecret(data.clientSecret);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchPaymentIntent();
    }
  }, [reservationId, convertedPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !clientSecret) {
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
        setError(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        const token = localStorage.getItem("token");
        const confirmResponse = await fetch(
          "https://parkini-backend.onrender.com/api/payments/confirm-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reservationId,
              paymentIntentId: paymentIntent.id,
            }),
          }
        );

        const confirmData = await confirmResponse.json();
        if (!confirmResponse.ok) throw new Error(confirmData.message);

        await onPaymentSuccess(reservationId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h3 className="text-xl font-bold text-black flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> Stripe Payment (International)
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

        {error && (
          <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-xl font-bold text-blue-600">
            €{convertedPrice?.toFixed(2) || "0.00"}
          </span>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg mb-6 text-sm">
          <p className="flex items-center text-blue-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>
              Original price: TND{" "}
              {reservation?.totalPrice?.toFixed(3) || "0.000"}
            </span>
          </p>
          <p className="text-blue-700 pl-6">
            Converted price: €{convertedPrice?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="flex justify-center">
        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className={`bg-black text-white px-6 py-3 rounded-full font-semibold 
            shadow-lg flex items-center space-x-2 hover:bg-blue-50 hover:text-black transition-all duration-300 
            transform hover:scale-105 ${
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
            `Pay with Stripe €${convertedPrice?.toFixed(2) || "0.00"}`
          )}
        </button>
        </div>
      </form>
    </div>
  );
};

// Format date and time
const formatDateTime = (date) => {
  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Payment Selection Component
const PaymentSelection = ({ reservationId, reservation, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const { original: originalPrice, converted: convertedPrice } =
    calculatePrices(reservation);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Select Payment Method
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                paymentMethod === "stripe"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Globe className="w-8 h-8 text-blue-600 mb-2" />
              <span className="font-medium">International</span>
              <span className="text-sm text-gray-500">Pay with Stripe</span>
              <div className="mt-2 text-sm font-medium text-blue-600">
                €{convertedPrice?.toFixed(2)}
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("flouci")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                paymentMethod === "flouci"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Flag className="w-8 h-8 text-blue-600 mb-2" />
              <span className="font-medium">Tunisia</span>
              <span className="text-sm text-gray-500">Pay with Flouci</span>
              <div className="mt-2 text-sm font-medium text-blue-600">
                TND {originalPrice?.toFixed(3)}
              </div>
            </button>
          </div>
        </div>
      </div>

      {paymentMethod === "stripe" ? (
        <Elements stripe={stripePromise}>
          <PaymentForm
            reservationId={reservationId}
            reservation={reservation}
            onSuccess={onSuccess}
          />
        </Elements>
      ) : (
        <FlouciPayment reservation={reservation} onSuccess={onSuccess} />
      )}
    </div>
  );
};

// Details Item component for reservation details
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start mb-4">
    <div className="bg-blue-100 p-2 rounded-lg mr-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

// Update QR Code Modal component
const QRCodeModal = ({ qrCode, onClose }) => {
  const handleSave = async () => {
    try {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = `parking-qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to save QR code:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-semibold text-center flex-grow">
            Your QR Code
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl flex justify-center mb-6">
          <img src={qrCode} alt="QR Code" className="max-w-full" />
        </div>
        <p className="text-center text-gray-600 mb-6">
          Keep this QR code to access the parking
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleSave}
            className="w-full py-3 px-6 bg-blue-600 text-black font-medium rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            <Download size={18} className="mr-2" /> Save QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Confirmation Component
const Confirmation = () => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const onPaymentSuccess = async (reservationId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://parkini-backend.onrender.com/api/reservations/${reservationId}/statusPayment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "accepted",
            paymentStatus: "completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      const updatedReservation = await response.json();
      setPaymentSuccess(true);
      setReservation(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  // Check for payment verification from Flouci redirect
  useEffect(() => {
    const checkFlouciPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get("payment_id");
      const reservationId = localStorage.getItem("currentReservationId");

      if (paymentId && reservationId) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `https://parkini-backend.onrender.com/api/payments/verify/${paymentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (data.success && data.result.status === "SUCCESS") {
            await onPaymentSuccess(reservationId);
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (err) {
          console.error("Failed to verify payment:", err);
        }
      }
    };

    checkFlouciPayment();
  }, []);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Decode token to get user ID
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        // Fetch reservation
        const response = await fetch(
          `https://parkini-backend.onrender.com/api/reservation/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reservation");
        }

        const data = await response.json();
        setReservation(data);

        // Store reservation ID for Flouci redirect callback
        localStorage.setItem("currentReservationId", data._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [paymentSuccess]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Refresh reservation data to get updated payment status
    setLoading(true);
  };

  // Add print handler
  const handlePrint = () => {
    if (!qrCode || !reservation) return;

    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write(`
      <html>
        <head></head>
          <title>QR Code - Parking Reservation</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              background-color: #f9fafc;
              color: #333;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .qr-container { 
              margin: 20px auto;
              padding: 15px;
              background-color: #f1f5f9;
              border-radius: 8px;
              display: inline-block;
            }
            .details { 
              margin: 20px auto;
              text-align: left;
              max-width: 400px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Parking Reservation QR Code</h2>
            <div class="qr-container">
              <img src="${qrCode}" alt="QR Code" style="max-width: 250px"/>
            </div>
            <div class="details">
              <p><strong>Reservation ID:</strong> ${reservation._id}</p>
              <p><strong>Start Time:</strong> ${new Date(
                reservation.startTime
              ).toLocaleString()}</p>
              <p><strong>End Time:</strong> ${new Date(
                reservation.endTime
              ).toLocaleString()}</p>
              <p><strong>Vehicle Type:</strong> ${reservation.vehicleType}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    const generateQRCode = async () => {
      if (paymentSuccess && reservation) {
        try {
          const qrData = {
            reservationId: reservation._id,
            status: "completed",
            paymentStatus: "completed",
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            vehicleType: reservation.vehicleType,
          };

          // Generate QR code as data URL
          const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });

          setQrCode(qrCodeDataUrl);
        } catch (err) {
          console.error("Failed to generate QR code:", err);
        }
      }
    };

    generateQRCode();
  }, [paymentSuccess, reservation]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Reservation Confirmation
        </h1>
        <p className="text-gray-600 mt-2">
          Review your details and complete payment
        </p>
      </div>

      {paymentSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
          <Check className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="font-bold text-green-800">Payment Successful!</h3>
            <p className="text-green-700">
              Your reservation is now confirmed. You'll receive a confirmation
              email shortly.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-6">
        {/* Reservation Details Card */}
        <div className="md:col-span-5 lg:col-span-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h3 className="font-bold text-lg">Error</h3>
              </div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : reservation ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 p-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Car className="w-5 h-5" /> Reservation Details
                </h3>
              </div>

              <div className="p-6">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                  <p className="font-mono bg-gray-50 p-2 rounded">
                    {reservation.displayId || reservation._id}
                  </p>
                </div>

                <DetailItem
                  icon={<Car className="w-5 h-5 text-blue-600" />}
                  label="Vehicle Type"
                  value={reservation.vehicleType}
                />

                <DetailItem
                  icon={<Calendar className="w-5 h-5 text-blue-600" />}
                  label="Start Time"
                  value={formatDateTime(reservation.startTime)}
                />

                <DetailItem
                  icon={<Calendar className="w-5 h-5 text-blue-600" />}
                  label="End Time"
                  value={formatDateTime(reservation.endTime)}
                />

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Price (TND):</span>
                    <span className="text-xl font-bold text-blue-600">
                      TND {reservation.totalPrice.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Payment Status:</span>
                    <StatusBadge status={reservation.paymentStatus} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No reservation found</p>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="md:col-span-7 lg:col-span-8">
          {reservation && reservation.paymentStatus !== "completed" ? (
            <PaymentSelection
              reservationId={reservation?._id}
              reservation={reservation}
              onSuccess={handlePaymentSuccess}
            />
          ) : reservation ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 p-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Check className="w-5 h-5" /> Payment Completed
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg mb-4">
                  <Check className="w-10 h-10 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-bold text-lg text-green-800">
                      Payment Successful
                    </h4>
                    <p className="text-green-700">
                      Your reservation has been paid and confirmed.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Payment Summary</p>
                  <div className="flex justify-between mt-2">
                    <span>Total Amount Paid:</span>
                    <span className="font-bold">
                      {reservation.paymentMethod === "stripe"
                        ? `€${(reservation.totalPrice / 3).toFixed(2)}`
                        : `TND ${reservation.totalPrice.toFixed(3)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Update QR code modal */}
      {qrCode && (
        <QRCodeModal qrCode={qrCode} onClose={() => setQrCode(null)} />
      )}
    </div>
  );
};

export default Confirmation;
