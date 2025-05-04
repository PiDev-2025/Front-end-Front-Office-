import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  DollarSign,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  
  Globe,
  Flag,
  X,
  Download,
  Arrowleft,
  Printer,
} from "lucide-react";
import QRCode from "qrcode";

// API Base URL
const API_BASE_URL = window.runtimeConfig?.apiUrl || process.env.REACT_APP_API_URL || "http://localhost:3001/api";

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

// Payment methods with consistent structure
const PAYMENT_METHODS = [
  { id: "cash", label: "Espèces", icon: <DollarSign size={18} /> },
  { id: "online", label: "Paiement en ligne", icon: <CreditCard size={18} /> },
];

// Online payment options
const ONLINE_PAYMENT_TYPES = [
  { 
    id: "flouci", 
    label: "Flouci (Tunisia)", 
    icon: <Flag size={18} />,
    description: "Pay in Tunisian Dinars"
  },
  { 
    id: "stripe", 
    label: "Stripe (International)", 
    icon: <Globe size={18} />,
    description: "Pay in Euros" 
  },
];

// Payment method selector component
const PaymentMethodSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
    {PAYMENT_METHODS.map((method) => (
      <div
        key={method.id}
        onClick={() => onSelect(method.id)}
        className={`p-4 border rounded-xl cursor-pointer transition-all ${
          selected === method.id
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex items-center">
          {method.icon}
          <span className="ml-2">{method.label}</span>
          {selected === method.id && (
            <CheckCircle2 size={16} className="text-blue-500 ml-auto" />
          )}
        </div>
      </div>
    ))}
  </div>
);

// Online payment type selector
const OnlinePaymentTypeSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
    {ONLINE_PAYMENT_TYPES.map((type) => (
      <div
        key={type.id}
        onClick={() => onSelect(type.id)}
        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
          selected === type.id
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-3 rounded-full mb-2">
            {type.icon}
          </div>
          <div className="font-medium">{type.label}</div>
          <div className="text-sm text-gray-500 mt-1">{type.description}</div>
          {selected === type.id && (
            <CheckCircle2 size={20} className="text-blue-500 mt-2" />
          )}
        </div>
      </div>
    ))}
  </div>
);

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
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get auth token from storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication token is missing. Please login again.");
      }

      // Save the current reservation ID to localStorage for retrieval after redirect
      localStorage.setItem('currentReservationId', reservation._id);

      // Call the backend API to initiate Flouci payment
      const response = await axios.post(
        `${API_BASE_URL}/payments/flouci/paiement`,
        {
          amount: totalPrice * 1000, // Convert to millimes
          reservationId: reservation._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Flouci payment initiation response:", response.data);

      // Check if the response contains a payment URL
      if (response.data && response.data.payment_url) {
        // Redirect to the Flouci payment page
        window.location.href = response.data.payment_url;
      } else if (response.data && response.data.result && response.data.result.link) {
        window.location.href = response.data.result.link;
      } else {
        throw new Error("Invalid payment response from server");
      }
    } catch (err) {
      console.error("Error initiating Flouci payment:", err);
      setError(err.response?.data?.message || err.message || "Failed to initiate payment");
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
              className="mx-auto mb-3 h-16"
              onError={(e) => {e.target.onerror = null; e.target.src = "https://flouci.com/assets/img/logo.webp";}}
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

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-black transition-all ${
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

  useEffect(() => {
    if (reservationId) {
      const fetchPaymentIntent = async () => {
        try {
          const token = localStorage.getItem("token");
          
          // First, update the reservation payment method to 'online'
          await axios.put(
            `${API_BASE_URL}/reservations/${reservationId}`,
            { paymentMethod: 'online' },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          // Then create payment intent
          const response = await axios.post(
            `${API_BASE_URL}/payments/create-payment-intent`,
            {
              reservationId,
              amount: convertedPrice,
              currency: 'eur'
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data && response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (err) {
          setError(err.response?.data?.message || err.message || "Failed to create payment intent");
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
        const confirmResponse = await axios.post(
          `${API_BASE_URL}/payments/confirm-payment`,
          {
            reservationId,
            paymentIntentId: paymentIntent.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (confirmResponse.data && confirmResponse.data.success) {
          onSuccess(confirmResponse.data.reservation);
        } else {
          throw new Error(confirmResponse.data?.message || "Payment confirmation failed");
        }
      }
    } catch (err) {
      setError(err.message || "Payment processing failed");
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
            `Pay €${convertedPrice?.toFixed(2) || "0.00"}`
          )}
        </button>
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

// QR Code modal component - Updated for better UX
const QRCodeModal = ({ qrCode, onClose, reservation, onPrint }) => {
  const navigate = useNavigate();
  
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
            Réservation confirmée !
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Success animation */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounceIn">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
        </div>
        
        <div className="mb-6 text-center">
          <h5 className="text-xl font-bold text-gray-800 mb-2">Merci pour votre réservation</h5>
          <p className="text-gray-600">Voici votre QR Code pour accéder au parking</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl flex justify-center mb-6">
          <img src={qrCode} alt="QR Code" className="max-w-full" />
        </div>
        
        {reservation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Arrivée:</span>
              <span className="font-medium">{formatDateTime(reservation.startTime)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Départ:</span>
              <span className="font-medium">{formatDateTime(reservation.endTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{reservation.totalPrice}Dt</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleSave}
            className="w-full py-3 px-6 bg-blue-600 text-black font-medium rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            <Download size={18} className="mr-2" /> Télécharger le QR Code
          </button>
          
          <button
            onClick={onPrint}
            className="w-full py-3 px-6 bg-green-600 text-black font-medium rounded-xl hover:bg-green-700 flex items-center justify-center transition-colors"
          >
            <Printer size={18} className="mr-2" /> Imprimer le QR Code
          </button>
          
          <button
            onClick={() => navigate("/mes-reservations")}
            className="w-full py-3 px-6 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            Voir mes réservations
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Confirmation Component
const Confirmation = ({ initialReservationData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Default to cash
  const [onlinePaymentType, setOnlinePaymentType] = useState("flouci"); // Default online payment type
  const [creatingReservation, setCreatingReservation] = useState(false);
  const [reservationCreated, setReservationCreated] = useState(false); // Track if reservation was already created
  
  // Function to create reservation if needed
  const createReservation = async (reservationData) => {
    // Add safety check to prevent duplicate creation
    if (reservationCreated) {
      console.log("Reservation already created, skipping creation");
      return reservation;
    }

    try {
      setCreatingReservation(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token is missing. Please login again.");
      }
      
      const payload = {
        parkingId: reservationData.parkingId,
        spotId: reservationData.spotId,
        startTime: new Date(reservationData.startTime).toISOString(),
        endTime: new Date(reservationData.endTime).toISOString(),
        vehicleType: reservationData.vehicleType,
        totalPrice: reservationData.totalPrice,
        matricule: reservationData.matricule || null,
        paymentMethod: reservationData.paymentMethod || 'cash',
        status: 'pending'
      };
      
      console.log("Creating reservation with payload:", payload);
      
      const response = await axios.post(
        `${API_BASE_URL}/reservations`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Reservation created successfully:", response.data);
      
      // Save the reservation ID to localStorage
      localStorage.setItem('currentReservationId', response.data._id);
      
      // Set the created reservation in state
      setReservation(response.data);
      
      // Mark that we've created a reservation to prevent duplicates
      setReservationCreated(true);
      
      return response.data;
    } catch (err) {
      console.error("Error creating reservation:", err);
      setError(err.response?.data?.message || err.message || "Failed to create reservation");
      throw err;
    } finally {
      setCreatingReservation(false);
      setLoading(false);
    }
  };
  
  // Process pending reservation creation only once during initial component mount
  useEffect(() => {
    if (!initialReservationData || reservation || reservationCreated) return;
    
    const handleInitialData = async () => {
      // If we have data that needs to be created first
      if (initialReservationData?.pendingCreation) {
        try {
          await createReservation(initialReservationData);
        } catch (err) {
          console.error("Failed to create reservation during initialization:", err);
        }
      } else if (initialReservationData?._id) {
        // If we already have a complete reservation
        setReservation(initialReservationData);
        setReservationCreated(true);
        setLoading(false);
        
        // If payment is already completed, set success state
        if (initialReservationData.paymentStatus === 'completed') {
          setPaymentSuccess(true);
        }
      } else {
        // Continue with regular flow
        handleURLParameters();
      }
    };
    
    handleInitialData();
  }, [initialReservationData]); // No other dependencies to prevent duplicate execution
  
  // Process URL parameters on component mount to handle Flouci redirects
  const handleURLParameters = useCallback(() => {
    if (reservationCreated) return; // Skip if we already have a reservation
    
    const queryParams = new URLSearchParams(location.search);
    const paymentSuccess = queryParams.get('paymentSuccess');
    const reservationId = queryParams.get('reservationId');
    const idPayment = queryParams.get('id_payment');
    const flouciPaymentId = queryParams.get('payment_id');
    
    // Check if user has been redirected from Flouci
    if (flouciPaymentId) {
      console.log("Detected Flouci payment_id in URL:", flouciPaymentId);
      verifyFlouciPayment(flouciPaymentId);
      return;
    }

    // Handle other payment redirect scenarios
    if (paymentSuccess && reservationId) {
      checkPaymentStatus(reservationId);
    } else if (idPayment) {
      verifyFlouciPayment(idPayment);
    } else {
      // Regular component initialization
      const resId = localStorage.getItem('currentReservationId');
      if (resId) {
        fetchReservation(resId);
      } else {
        setLoading(false);
      }
    }
  }, [location.search, reservationCreated]);
  
  // Handle URL parameters only on first render
  useEffect(() => {
    if (!initialReservationData?.pendingCreation && !initialReservationData?._id) {
      handleURLParameters();
    }
  }, [handleURLParameters, initialReservationData]);
  
  // Check payment status for a reservation
  const checkPaymentStatus = async (reservationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      
      console.log(`Checking payment status for reservation ID: ${reservationId}`);
      const response = await axios.get(`${API_BASE_URL}/payments/payment-status/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Payment status response:", response.data);
      
      if (response.data.success) {
        setReservation(response.data.reservation);
        // If payment is completed, show success and QR code
        if (response.data.paymentCompleted) {
          setPaymentSuccess(true);
          setQrCode(response.data.reservation.qrCode);
        }
      } else {
        throw new Error(response.data.message || "Failed to verify payment status");
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      setError(err.response?.data?.message || err.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Flouci payment verification (legacy)
  const handleFlouciVerification = async (paymentId) => {
    try {
      setLoading(true);
      console.log(`Verifying Flouci payment with ID: ${paymentId}`);
      
      // Call backend to verify payment
      const response = await axios.get(`${API_BASE_URL}/payments/verify/${paymentId}`);
      
      if (response.data && response.data.success) {
        console.log("Payment verified successfully:", response.data);
        
        // Get the reservation ID from the response or localStorage
        const resId = response.data.reservationId || localStorage.getItem('currentReservationId');
        
        if (resId) {
          // Fetch the updated reservation details
          fetchReservation(resId);
          setPaymentSuccess(true);
          
          // Clear the stored reservation ID
          localStorage.removeItem('currentReservationId');
        } else {
          console.error("No reservation ID found after payment verification");
          setError("Une erreur est survenue lors de la vérification du paiement. Veuillez contacter le support.");
        }
      } else {
        console.error("Payment verification failed:", response.data);
        setError("La vérification du paiement a échoué. Veuillez réessayer ou contacter le support.");
      }
    } catch (error) {
      console.error("Error verifying Flouci payment:", error);
      setError("Une erreur est survenue lors de la vérification du paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  
  // If initialReservationData has full reservation object, use it directly
  useEffect(() => {
    // If initialReservationData is a complete reservation, use it directly
    if (initialReservationData && initialReservationData._id) {
      setReservation(initialReservationData);
      setLoading(false);
      
      // If payment is already completed, set success state
      if (initialReservationData.paymentStatus === 'completed') {
        setPaymentSuccess(true);
      }
    } else if (initialReservationData?.reservationId) {
      // If only ID is provided, fetch the full reservation
      fetchReservation(initialReservationData.reservationId);
    } else {
      // Try to get reservation ID from URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get('reservationId');
      const storedReservationId = localStorage.getItem('currentReservationId');
      
      if (reservationId) {
        fetchReservation(reservationId);
      } else if (storedReservationId) {
        fetchReservation(storedReservationId);
        // Clear the stored ID after using it
        localStorage.removeItem('currentReservationId');
      } else {
        setLoading(false);
      }
    }
  }, [initialReservationData]);
  
  // Function to fetch reservation details
  const fetchReservation = async (reservationId) => {
    if (!reservationId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      console.log(`Fetching reservation data for ID: ${reservationId}`);
      
      // Ensure valid API URL format
      const apiUrl = `${API_BASE_URL}/reservations/${reservationId}`;
      console.log("API URL:", apiUrl);
      
      const response = await axios.get(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data) {
        throw new Error('Reservation not found');
      }
      
      console.log("Fetched reservation data:", response.data);
      setReservation(response.data);
      setReservationCreated(true); // Mark that we have a valid reservation
      
      // If payment is already completed, set success state
      if (response.data.paymentStatus === 'completed') {
        setPaymentSuccess(true);
        
        // Display QR code if available
        if (response.data.qrCode) {
          setQrCode(response.data.qrCode);
        }
      }
    } catch (err) {
      console.error('Error fetching reservation:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Unable to load reservation details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cash payment confirmation
  const handleConfirmCashPayment = async () => {
    if (!reservation?._id) {
      setError("No reservation to confirm");
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      
      // Update reservation payment status to 'completed'
      const response = await axios.put(
        `${API_BASE_URL}/reservations/${reservation._id}/statusPayment`,
        {
          paymentStatus: 'completed',
          paymentMethod: 'cash'
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data) {
        throw new Error("Failed to update reservation");
      }
      
      // Update reservation with response data
      setReservation(response.data);
      setPaymentSuccess(true);
      
      // Show QR code modal
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      } else {
        // Generate QR code if not provided
        await generateQRCode(response.data);
      }
    } catch (err) {
      console.error("Error confirming cash payment:", err);
      setError(err.response?.data?.message || err.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code for a reservation
  const generateQRCode = async (reservationData) => {
    if (!reservationData) return;
    
    try {
      const qrData = JSON.stringify({
        reservationId: reservationData._id,
        parkingName: reservationData.parkingId?.name || 'Parking',
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
        totalPrice: reservationData.totalPrice,
        vehicleType: reservationData.vehicleType,
      });
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      setQrCode(qrCodeDataUrl);
      
      return qrCodeDataUrl;
    } catch (err) {
      console.error("Error generating QR code:", err);
      return null;
    }
  };

  // Handle successful payment callback - enhanced to update payment method and status
  const handlePaymentSuccess = (updatedReservation) => {
    if (updatedReservation) {
      // Ensure we update to completed status and use online payment method
      setReservation(prev => ({
        ...updatedReservation,
        paymentStatus: updatedReservation.paymentStatus || 'completed',
        paymentMethod: 'online'
      }));
      setPaymentSuccess(true);
      
      // Show QR code if available or generate it
      if (updatedReservation.qrCode) {
        setQrCode(updatedReservation.qrCode);
      } else {
        generateQRCode(updatedReservation);
      }
    } else {
      // Refresh reservation data to get updated payment status
      if (reservation?._id) {
        fetchReservation(reservation._id);
      }
    }
  };

  // Handle payment method change - simplified to avoid unnecessary API calls
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    
    // Set online payment type if needed
    if (method === "online") {
      setOnlinePaymentType("flouci");
    }
  };

  // Handle QR code printing functionality
  const handlePrint = () => {
    if (!qrCode || !reservation)
      return;

    const printWindow = window.open("", "", "width=600,height=600");
    if (!printWindow) {
      alert("Please allow pop-ups to print the QR code");
      return;
    }

    const parkingName = reservation.parkingId?.name || 'Parking';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Parkini - Reservation QR Code</title>
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
            .logo {
              margin-bottom: 20px;
              font-size: 24px;
              font-weight: bold;
              color: #3b82f6;
            }
            .qr-container { 
              margin: 20px auto;
              padding: 15px;
              background-color: #f1f5f9;
              border-radius: 8px;
              display: inline-block;
            }
            .details { 
              margin: 30px auto; 
              text-align: left; 
              max-width: 400px; 
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .footer { 
              margin-top: 20px; 
              font-size: 14px; 
              color: #666; 
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            h2 {
              color: #1e3a8a;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px dashed #e5e7eb;
            }
            .detail-label {
              font-weight: 600;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Parking Réservation</div>
            <h2>${reservation.parkingId?.name || "Parking"}</h2>
            <div class="qr-container">
              <img src="${qrCode}" alt="QR Code" style="max-width: 250px"/>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Date d'arrivée:</span>
                <span>${new Date(
                  reservation.startTime
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date de départ:</span>
                <span>${new Date(
                  reservation.endTime
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type de véhicule:</span>
                <span>${reservation.vehicleType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Montant total:</span>
                <span>${reservation.totalPrice}Dt</span>
              </div>
            </div>
            <div class="footer">
              <p>Veuillez présenter ce QR code à l'entrée du parking</p>
              <p>Réservation effectuée le ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Add these states for payment verification
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  
  // Extract URL parameters for payment verification
  const urlParams = new URLSearchParams(window.location.search);
  const flouciPaymentId = urlParams.get('payment_id');
  
  useEffect(() => {
    // Check if we're returning from a Flouci payment
    if (flouciPaymentId) {
      console.log("Detected Flouci payment ID from URL:", flouciPaymentId);
      verifyFlouciPayment(flouciPaymentId);
    } else {
      // Normal flow - fetch reservation from location state or storage
      fetchReservation();
    }
  }, [location]);
  
  // Improved verifyFlouciPayment function to properly handle payment status
  const verifyFlouciPayment = async (paymentId) => {
    setVerifyingPayment(true);
    setVerificationError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token is missing. Please login again.");
      }
      
      // Get the reservation ID from localStorage (saved before redirect)
      const reservationId = localStorage.getItem('currentReservationId');
      if (!reservationId) {
        throw new Error("Reservation information is missing. Please try again.");
      }
      
      console.log("Verifying Flouci payment:", paymentId, "for reservation:", reservationId);
      
      // Call backend API to verify the payment
      const response = await axios.get(
        `${API_BASE_URL}/payments/verify/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Payment verification response:", response.data);
      
      if (response.data && response.data.success) {
        // Payment verified successfully - set payment status to completed
        setPaymentSuccess(true);
        
        // Fetch the updated reservation details
        const reservationResponse = await axios.get(
          `${API_BASE_URL}/reservations/${reservationId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update local reservation state with server data
        const updatedReservation = reservationResponse.data;
        setReservation(updatedReservation);
        
        // Ensure payment status and method are set correctly
        if (updatedReservation.paymentStatus !== 'completed') {
          // Force update payment status to completed if not already
          await axios.put(
            `${API_BASE_URL}/reservations/${reservationId}/statusPayment`,
            {
              paymentStatus: 'completed',
              paymentMethod: 'online'
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          // Refresh reservation to get updated status
          const finalResponse = await axios.get(
            `${API_BASE_URL}/reservations/${reservationId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          setReservation(finalResponse.data);
        }
        
        // Generate/display QR code
        if (updatedReservation.qrCode) {
          setQrCode(updatedReservation.qrCode);
        } else {
          const generatedQr = await generateQRCode(updatedReservation);
          setQrCode(generatedQr);
        }
      } else {
        throw new Error(response.data?.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Error verifying Flouci payment:", err);
      setVerificationError(err.response?.data?.message || err.message || "Failed to verify payment");
    } finally {
      setVerifyingPayment(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Confirmation de réservation
        </h1>
        <p className="text-gray-600 mt-2">
          Vérifiez vos détails et complétez le paiement
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="font-bold text-red-800">Une erreur est survenue</h3>
            <p className="text-red-700">
              {error}
            </p>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retour
            </button>
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
          <Check className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="font-bold text-green-800">Paiement réussi!</h3>
            <p className="text-green-700">
              Votre réservation est maintenant confirmée. Vous recevrez un email de confirmation.
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
          ) : error && !reservation ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h3 className="font-bold text-lg">Erreur</h3>
              </div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : reservation ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 p-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Car className="w-5 h-5" /> Détails de la réservation
                </h3>
              </div>

              <div className="p-6">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">ID Réservation</p>
                  <p className="font-mono bg-gray-50 p-2 rounded">
                    {reservation.displayId || reservation._id}
                  </p>
                </div>

                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type de véhicule</p>
                    <p className="font-medium">{reservation.vehicleType}</p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date d'arrivée</p>
                    <p className="font-medium">{formatDateTime(reservation.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de départ</p>
                    <p className="font-medium">{formatDateTime(reservation.endTime)}</p>
                  </div>
                </div>

                {reservation.matricule && (
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Matricule</p>
                      <p className="font-medium">{reservation.matricule}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Prix total (TND):</span>
                    <span className="text-xl font-bold text-blue-600">
                      TND {reservation.totalPrice?.toFixed(3) || "0.000"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Statut du paiement:</span>
                    <StatusBadge status={reservation.paymentStatus} />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center"
                  >
                       Retour
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Veuillez vous connecter ou créer une nouvelle réservation</p>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="md:col-span-7 lg:col-span-8">
          {reservation && reservation.paymentStatus !== "completed" ? (
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 p-4">
                  <h3 className="text-xl font-bold text-black flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Méthode de paiement
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Veuillez sélectionner votre méthode de paiement préférée:
                  </p>
                  
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onSelect={handlePaymentMethodChange}
                  />
                  
                  {/* Cash payment section */}
                  {paymentMethod === "cash" && (
                    <div className="mt-6">
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <h4 className="font-medium text-yellow-800 mb-2">Paiement en espèces</h4>
                        <p className="text-yellow-700 text-sm">
                          Le paiement en espèces sera effectué à l'entrée du parking. 
                          Veuillez présenter votre QR code au personnel sur place.
                        </p>
                      </div>
                      
                      <button
                        onClick={handleConfirmCashPayment}
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg font-medium text-black transition-all ${
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
                            Traitement...
                          </span>
                        ) : (
                          `Confirmer le paiement en espèces`
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Online payment section */}
                  {paymentMethod === "online" && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-2">Choisissez votre option de paiement en ligne:</h4>
                      
                      <OnlinePaymentTypeSelector
                        selected={onlinePaymentType}
                        onSelect={setOnlinePaymentType}
                      />
                      
                      {/* Flouci Payment Form */}
                      {onlinePaymentType === "flouci" && (
                        <div className="mt-6">
                          <FlouciPayment 
                            reservation={reservation} 
                            onSuccess={handlePaymentSuccess} 
                          />
                        </div>
                      )}
                      
                      {/* Stripe Payment Form */}
                      {onlinePaymentType === "stripe" && (
                        <div className="mt-6">
                          <Elements stripe={stripePromise}>
                            <PaymentForm
                              reservationId={reservation._id}
                              reservation={reservation}
                              onSuccess={handlePaymentSuccess}
                            />
                          </Elements>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : reservation ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 p-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Check className="w-5 h-5" /> Paiement complété
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg mb-4">
                  <Check className="w-10 h-10 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-bold text-lg text-green-800">
                      Paiement réussi
                    </h4>
                    <p className="text-green-700">
                      Votre réservation a été payée et confirmée.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium">Récapitulatif du paiement</p>
                  <div className="flex justify-between mt-2">
                    <span>Montant total payé:</span>
                    <span className="font-bold">
                      {reservation.paymentMethod === "stripe"
                        ? `€${(reservation.totalPrice / 3).toFixed(2)}`
                        : `TND ${reservation.totalPrice?.toFixed(3) || "0.000"}`}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    try {
                      // Use existing QR code or generate a new one
                      if (reservation.qrCode) {
                        setQrCode(reservation.qrCode);
                      } else {
                        await generateQRCode(reservation);
                      }
                    } catch (err) {
                      console.error("Failed to process QR code:", err);
                    }
                  }}
                  className="w-full mt-4 py-3 px-6 bg-blue-600 text-black font-medium rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <Download size={18} className="mr-2" /> Afficher le QR Code
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* QR code modal with print functionality */}
      {qrCode && (
        <QRCodeModal 
          qrCode={qrCode} 
          onClose={() => setQrCode(null)} 
          reservation={reservation}
          onPrint={handlePrint}
        />
      )}
      
      {/* Add animation styles */}
      <style jsx="true">{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Confirmation;