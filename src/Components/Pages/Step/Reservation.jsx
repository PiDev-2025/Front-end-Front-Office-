import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  Printer,
  DollarSign,
  X,
  CheckCircle2,
  Car,
  ChevronDown,
  MapPin,
  ArrowRight,
  ListChecks,
  ArrowLeft,
} from "lucide-react";

// Ajouter l'import pour la locale française de date-fns
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

// Enregistrer la locale française
registerLocale("fr", fr);

// Vehicle types with optimized data structure
const VEHICLE_TYPES = [
  {
    value: "Moto",
    label: "Moto",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765730/moto_xdypx2.png",
  },
  {
    value: "Citadine",
    label: "City Car",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-ville_ocwbob.png",
  },
  {
    value: "Berline / Petit SUV",
    label: "Small SUV",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/wagon-salon_bj2j1s.png",
  },
  {
    value: "Familiale / Grand SUV",
    label: "Large SUV",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-familiale_rmgclg.png",
  },
  {
    value: "Utilitaire",
    label: "Utility Vehicle",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png",
  },
];

// Payment methods with consistent structure
const PAYMENT_METHODS = [
  { id: "online", label: "online", icon: <CreditCard size={18} /> },
  { id: "cash", label: "cash", icon: <DollarSign size={18} /> },
];
const PLATE_FORMATS = [
  { id: "ar", label: "تونس", value: "تونس" },
  { id: "fr", label: "TUN", value: "TUN" },
  {id: "ar", label: "ن ت", value: "ن ت" },
];

// Ajout des styles personnalisés pour le DatePicker
const datePickerStyles = `
  .react-datepicker {
    font-family: 'Inter', sans-serif;
    border: none;
    border-radius: 0.99rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }
  
  .react-datepicker__header {
    background-color: #2563eb;
    border-bottom: none;
    padding: 1rem;
    color: white;
  }
  
  .react-datepicker__current-month {
    color: white;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .react-datepicker__day-name {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }
  
  .react-datepicker__day {
    border-radius: 0.375rem;
    transition: all 0.2s;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 0.2rem;
  }
  
  .react-datepicker__day:hover {
    background-color: #e5edff;
  }
  
  .react-datepicker__day--selected {
    background-color: #2563eb !important;
    color: white !important;
    font-weight: 600;
  }
  
  .react-datepicker__time-container {
    border-left: 1px solid #e5e7eb;
  }
  
  .react-datepicker__time-list-item {
    transition: all 0.2s;
    height: 2.5rem !important;
    line-height: 2.5rem !important;
    margin: 0 !important;
    padding: 0 1rem !important;
  }
  
  .react-datepicker__time-list-item:hover {
    background-color: #e5edff !important;
  }
  
  .react-datepicker__time-list-item--selected {
    background-color: #2563eb !important;
    color: white !important;
    font-weight: 600;
  }
`;

// Modifier le CustomDatePicker pour gérer la date minimum
const CustomDatePicker = ({
  selected,
  onChange,
  label,
  minDate,
  isStartDate = false,
}) => {
  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    now.setSeconds(0);
    return now;
  };

  const getMinTime = () => {
    const now = new Date();
    if (selected?.toDateString() === now.toDateString()) {
      now.setMinutes(now.getMinutes() + 10);
      return now;
    }
    return new Date(0, 0, 0, 0, 0); // Début de journée pour les autres jours
  };

  const getMaxTime = () => {
    return new Date(0, 0, 0, 23, 59); // 23:59
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption="Heure"
          dateFormat="dd/MM/yyyy HH:mm"
          minDate={isStartDate ? getMinDate() : minDate}
          minTime={
            isStartDate &&
            selected?.toDateString() === new Date().toDateString()
              ? getMinDate()
              : getMinTime()
          }
          maxTime={getMaxTime()}
          locale="fr"
          className="w-full py-3 px-12 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          popperClassName="time-picker-popper"
          popperPlacement="bottom-start"
          calendarClassName="react-datepicker-inline"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
            {
              name: "preventOverflow",
              options: {
                boundary: window,
              },
            },
          ]}
          showPopperArrow={false}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isStartDate ? (
            <Calendar className="w-5 h-5 text-blue-500" />
          ) : (
            <Clock className="w-5 h-5 text-blue-500" />
          )}
        </div>
      </div>
      <style jsx global>{`
        .react-datepicker {
          font-family: "Inter", sans-serif !important;
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          display: flex !important;
          flex-direction: row !important;
        }
        .react-datepicker__month-container {
          float: none !important;
        }
        .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb !important;
          width: 100px !important;
          float: none !important;
        }
        .react-datepicker__time-container .react-datepicker__time {
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .react-datepicker__header {
          background-color: #2563eb !important;
          border-bottom: none !important;
          padding: 1rem !important;
          color: white !important;
        }
        .react-datepicker-time__header {
          color: white !important;
        }
        .react-datepicker__current-month {
          color: white !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day-name {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .react-datepicker__day {
          border-radius: 0.375rem !important;
          margin: 0.2rem !important;
          width: 2rem !important;
          line-height: 2rem !important;
          font-size: 0.875rem !important;
        }
        .react-datepicker__day:hover {
          background-color: #e5edff !important;
        }
        .react-datepicker__day--selected {
          background-color: #2563eb !important;
          color: white !important;
        }
        .react-datepicker__time-box {
          width: 100px !important;
        }
        .react-datepicker__time-list {
          height: 280px !important;
        }
        .react-datepicker__time-list-item {
          height: 40px !important;
          line-height: 40px !important;
          font-size: 0.875rem !important;
          padding: 0 1rem !important;
        }
        .react-datepicker__time-list-item:hover {
          background-color: #e5edff !important;
        }
        .react-datepicker__time-list-item--selected {
          background-color: #2563eb !important;
          color: white !important;
        }
        .time-picker-popper {
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
};

// Vehicle type selector component
const VehicleTypeSelector = ({ selectedType, onSelect }) => (
  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-w-full">
    {VEHICLE_TYPES.map((type) => (
      <div
        key={type.value}
        onClick={() => onSelect(type.value)}
        className={`p-2 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center shadow-sm
          ${
            selectedType === type.value
              ? "border-blue-500 bg-blue-50 shadow-md scale-102"
              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
          }`}
      >
        {/* Image */}
        <div className="bg-gray-100 p-2 rounded-lg w-12 h-12 flex justify-center items-center mb-1">
          <img
            src={type.image}
            alt={type.label}
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Label */}
        <p className="font-medium text-gray-800 text-xs leading-tight">
          {type.label}
        </p>

        {/* Check icon if selected */}
        {selectedType === type.value && (
          <CheckCircle2 size={16} className="text-blue-500 mt-1" />
        )}
      </div>
    ))}
  </div>
);

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

// Ajouter le composant de sélection de matricule
const PlateNumberInput = ({ onPlateChange }) => {
  const [format, setFormat] = useState("ar");
  const [leftNumber, setLeftNumber] = useState("");
  const [rightNumber, setRightNumber] = useState("");

  // Update to create and send plate number immediately after any change
  const updatePlateNumber = (newFormat, newLeftNumber, newRightNumber) => {
    // Format correctly based on selected format/region
    const plateFormat = newFormat === "ar" ? "تونس" : (newFormat === "fr" ? "TUN" : "ن ت");
    
    // Fix order - left number should be on left and right number should be on right
    const plateNumber = `${newLeftNumber} ${plateFormat} ${newRightNumber}`.trim();
    onPlateChange(plateNumber);
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-4">
        License plate number
      </h4>

      <div className="flex items-center space-x-4">
        {/* Numéro gauche */}
        <input
          type="text"
          value={leftNumber}
          onChange={(e) => {
            const newLeftNumber = e.target.value;
            setLeftNumber(newLeftNumber);
            updatePlateNumber(format, newLeftNumber, rightNumber);
          }}
          placeholder="000"
          className="w-24 p-2 border border-gray-300 rounded-lg text-center"
          maxLength={3}
        />

        {/* Sélecteur de format */}
        <div className="flex-1">
          <select
            value={format}
            onChange={(e) => {
              const newFormat = e.target.value;
              setFormat(newFormat);
              updatePlateNumber(newFormat, leftNumber, rightNumber);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-center bg-white"
          >
            {PLATE_FORMATS.map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        {/* Numéro droite */}
        <input
          type="text"
          value={rightNumber}
          onChange={(e) => {
            const newRightNumber = e.target.value;
            setRightNumber(newRightNumber);
            updatePlateNumber(format, leftNumber, newRightNumber);
          }}
          placeholder="0000"
          className="w-24 p-2 border border-gray-300 rounded-lg text-center"
          maxLength={4}
        />
      </div>
    </div>
  );
};

// Price details component
const PriceSummary = ({ priceDetails, totalPrice }) => (
  <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200">
    {priceDetails.map((detail, index) => (
      <div
        key={index}
        className="flex justify-between text-gray-600 py-2 border-b border-gray-100"
      >
        <span>{detail}</span>
      </div>
    ))}
    <div className="border-t-2 border-gray-200 pt-4 mt-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-blue-600">{totalPrice}Dt</span>
      </div>
    </div>
  </div>
);

// QR Code modal component
const QRCodeModal = ({ qrCode, onPrint, onViewReservations }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-semibold text-center flex-grow">
            Votre QR Code
          </h4>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl flex justify-center mb-6">
          <img src={qrCode} alt="QR Code" className="max-w-full" />
        </div>
        <p className="text-center text-gray-600 mb-6">
          Conservez ce QR Code pour accéder au parking
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onPrint}
            className="w-full py-3 px-6 bg-blue-600 text-black font-medium rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            <Printer size={18} className="mr-2" /> Imprimer le QR Code
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-6 bg-green-600 text-black font-medium rounded-xl hover:bg-green-700 flex items-center justify-center transition-colors"
          >
            <CheckCircle2 size={18} className="mr-2" /> Terminer
          </button>
          <button
            onClick={onViewReservations}
            className="w-full py-3 px-6 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            Voir mes réservations
          </button>
        </div>
      </div>
    </div>
  );
};

const Reservation = ({
  parkingData,
  reservationData,
  setReservationData,
  onContinue,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // 1: dates, 2: vehicle type
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Add this constant definition
  const commonClasses =
    "bg-white p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg";

  useEffect(() => {
    if (!parkingData?.pricing?.hourly) return;

    const hours = Math.ceil(
      (new Date(reservationData.endDate) -
        new Date(reservationData.startDate)) /
        (1000 * 60 * 60)
    );

    const total = hours * parkingData.pricing.hourly;
    setCalculatedPrice(parseFloat(total.toFixed(2)));
  }, [reservationData.startDate, reservationData.endDate, parkingData.pricing]);

  const calculatePrice = () => {
    try {
      if (!parkingData?.pricing?.hourly) {
        throw new Error("Tarifs non disponibles");
      }

      const start = new Date(reservationData.startDate);
      const end = new Date(reservationData.endDate);

      if (isNaN(start) || isNaN(end)) {
        throw new Error("Dates invalides");
      }

      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours <= 0) {
        setCalculatedPrice(0);
        return;
      }

      const total = Math.ceil(diffHours) * parkingData.pricing.hourly;
      setCalculatedPrice(parseFloat(total.toFixed(2)));
    } catch (error) {
      console.error("Erreur de calcul:", error);
      setCalculatedPrice(0);
    }
  };

  useEffect(() => {
    console.log("Current reservation data:", {
      parkingId: parkingData?._id,
      dates: {
        start: reservationData.startDate,
        end: reservationData.endDate,
      },
      vehicle: reservationData.vehicleType,
      spot: parkingData?.selectedSpotId,
      pricing: parkingData?.pricing,
      calculatedPrice,
    });
  }, [reservationData, parkingData, calculatedPrice]);

  // Dans le composant Reservation, ajoutez cette vérification
  useEffect(() => {
    if (
      parkingData &&
      (!parkingData.position ||
        !parkingData.position.lat ||
        !parkingData.position.lng)
    ) {
      console.error(
        "Parking data is missing position coordinates",
        parkingData
      );
      setError("Les coordonnées GPS du parking sont manquantes");
    }
  }, [parkingData]);

  const checkAvailability = async (startDate, endDate) => {
    try {
      if (!parkingData?._id || !parkingData.selectedSpotId) {
        return true;
      }

      if (!startDate || !endDate) {
        return true;
      }

      const response = await axios.get(
        `https://parkini-backend.onrender.com/api/reservations/by-spot?parkingId=${parkingData._id}&spotId=${parkingData.selectedSpotId}`
      );

      // Vérifier les réservations existantes
      const existingReservations = response.data;
      const newStartTime = new Date(startDate).getTime();
      const newEndTime = new Date(endDate).getTime();

      // Vérifier les chevauchements avec les réservations existantes
      const hasOverlap = existingReservations.some((reservation) => {
        if (reservation.status !== "accepted") return false;

        const existingStartTime = new Date(reservation.startTime).getTime();
        const existingEndTime = new Date(reservation.endTime).getTime();

        return (
          (newStartTime >= existingStartTime &&
            newStartTime < existingEndTime) ||
          (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
          (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
        );
      });

      if (hasOverlap) {
        setError(
          "This space is already reserved for the selected period. Please choose another."
        );
        return false;
      }

      setError(""); // Effacer l'erreur si tout est ok
      return true;
    } catch (err) {
      console.error("Erreur lors de la vérification de disponibilité:", err);
      setError("Erreur lors de la vérification de disponibilité");
      return false;
    }
  };

  // Handle reservation submission
  const handleSubmit = async () => {
    try {
      if (!parkingData?._id) {
        setError("Données du parking invalides");
        return;
      }
      const spotId = parkingData.selectedSpotId;

      if (!spotId) {
        setError("Please Select a parking spot");
        return;
      }

      if (!reservationData.vehicleType) {
        setError("Select a vehicle type");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Login required to make a reservation");
        return;
      }

      // Validate date range
      const minDuration = 60 * 60 * 1000; // 1 heure minimum
      if (
        new Date(reservationData.endDate) -
          new Date(reservationData.startDate) <
        minDuration
      ) {
        setError("Minimum duration is 1 hour");
        return;
      }

      // Validate dates are not in the past
      if (new Date(reservationData.startDate) < new Date()) {
        setError("Start date cannot be in the past");
        return;
      }

      setLoading(true);
      setError("");

      const reservationPayload = {
        parkingId: parkingData._id,
        spotId: spotId,
        startTime: new Date(reservationData.startDate).toISOString(),
        endTime: new Date(reservationData.endDate).toISOString(),
        vehicleType: reservationData.vehicleType,
        totalPrice: calculatedPrice,
        paymentMethod: paymentMethod === "online" ? "online" : "cash",
        matricule: reservationData.matricule,
        userId: localStorage.getItem("userId"),
        status: "pending",
        paymentStatus: "pending",
      };

      console.log("Sending reservation data:", reservationPayload);

      const response = await axios.post(
        "https://parkini-backend.onrender.com/api/reservations",
        reservationPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reservation response:", response.data);

      // Handle different payment methods
      if (paymentMethod === "online") {
        // Store reservation data and navigate to confirmation
        localStorage.setItem("currentReservationId", response.data._id);
        onContinue(); // Use the onContinue prop to navigate to confirmation
      } else {
        // For cash payment, show QR code directly
        setQrCode(response.data.qrCode);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error("Erreur de réservation:", err);
      if (err.response) {
        console.error("Response error data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      const errorMessage =
        err.response?.data?.message ||
        "Erreur lors de la réservation. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAvailability = async () => {
      if (reservationData.startDate && reservationData.endDate) {
        await checkAvailability(
          reservationData.startDate,
          reservationData.endDate
        );
      }
    };

    const timer = setTimeout(verifyAvailability, 500);
    return () => clearTimeout(timer);
  }, [reservationData.startDate, reservationData.endDate]);

  // Ajouter cet useEffect pour le scroll automatique
  useEffect(() => {
    if (currentStep === 2) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  // Handle QR code printing
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code Réservation - ${parkingData.name}</title>
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
            <h2>${parkingData.name}</h2>
            <div class="qr-container">
              <img src="${qrCode}" alt="QR Code" style="max-width: 250px"/>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Date d'arrivée:</span>
                <span>${new Date(
                  reservationData.startDate
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date de départ:</span>
                <span>${new Date(
                  reservationData.endDate
                ).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type de véhicule:</span>
                <span>${reservationData.vehicleType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Montant total:</span>
                <span>${calculatedPrice}Dt</span>
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

  // Navigate to next step or confirm
  const handleNextOrConfirm = async () => {
    if (currentStep === 1 && isStepValid()) {
      // Vérifier la disponibilité avant de passer à l'étape suivante
      const isAvailable = await checkAvailability(
        reservationData.startDate,
        reservationData.endDate
      );
      if (isAvailable) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2 && isStepValid()) {
      handleSubmit();
    }
  };

  // Update the isStepValid function to properly handle payment method validation
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return reservationData.startDate && reservationData.endDate;
      case 2:
        return reservationData.vehicleType && paymentMethod;
      default:
        return false;
    }
  };

  // Render content based on current step
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Main content layout */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <>
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-blue-100 shadow-md">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                <div className="bg-blue-50 p-3 rounded-full mr-3">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                Parking dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CustomDatePicker
                  selected={reservationData.startDate}
                  onChange={async (date) => {
                    const newEndDate =
                      date > reservationData.endDate
                        ? new Date(date.getTime() + 60 * 60 * 1000)
                        : reservationData.endDate;

                    const isAvailable = await checkAvailability(
                      date,
                      newEndDate
                    );
                    if (isAvailable) {
                      setReservationData((prev) => ({
                        ...prev,
                        startDate: date,
                        endDate: newEndDate,
                      }));
                    }
                  }}
                  label=" Arrival date and time"
                  isStartDate
                />

                <CustomDatePicker
                  selected={reservationData.endDate}
                  onChange={async (date) => {
                    const isAvailable = await checkAvailability(
                      reservationData.startDate,
                      date
                    );
                    if (isAvailable) {
                      setReservationData((prev) => ({
                        ...prev,
                        endDate: date,
                      }));
                    }
                  }}
                  label=" Departure date and time"
                  minDate={reservationData.startDate}
                />
              </div>

              <div className="mt-6">
                <PlateNumberInput
                  onPlateChange={(plateNumber) =>
                    setReservationData((prev) => ({
                      ...prev,
                      matricule: plateNumber,
                    }))
                  }
                />
              </div>
            </div>

            {/* Récapitulatif section moved here for step 1 */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border-2 border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100 flex items-center">
                <ListChecks className="mr-2 text-blue-500" size={18} />
                Summary
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium">{parkingData?.name}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Start</span>
                  <span className="font-medium">
                    {reservationData.startDate.toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">End</span>
                  <span className="font-medium">
                    {reservationData.endDate.toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {reservationData.vehicleType && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span className="font-medium">
                      {reservationData.vehicleType}
                    </span>
                  </div>
                )}

                {reservationData.matricule && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Matricule</span>
                    <span className="font-medium text-blue-600">
                      {reservationData.matricule}
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-2 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">
                      {Math.ceil(
                        (new Date(reservationData.endDate) -
                          new Date(reservationData.startDate)) /
                          (1000 * 60 * 60)
                      )}{" "}
                      heures
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Price Per hour</span>
                    <span className="font-medium">
                      {parkingData?.pricing?.hourly}Dt
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      {calculatedPrice}Dt
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
              <button
  onClick={handleNextOrConfirm}
  disabled={loading || !isStepValid()}
  className={`bg-black text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out flex-1 flex items-center justify-center font-medium ${
    loading || !isStepValid()
      ? "bg-gray-300 cursor-not-allowed text-gray-500"
      : "bg-blue-600 hover:bg-blue-700 text-black"
  }`}
>
  {loading ? (
    <>
      <span className="animate-spin mr-2">⌛</span>
      Traitement...
    </>
  ) : (
    <>
      Next <ArrowRight className="ml-1" size={16} />
    </>
  )}
</button>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-blue-100 shadow-md">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                <div className="bg-blue-50 p-3 rounded-full mr-3">
                  <Car className="text-blue-600" size={24} />
                </div>
                Vehicule Type
              </h3>

              <VehicleTypeSelector
                selectedType={reservationData.vehicleType}
                onSelect={(type) =>
                  setReservationData((prev) => ({
                    ...prev,
                    vehicleType: type,
                  }))
                }
              />

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div className="bg-blue-50 p-3 rounded-full mr-3">
                    <CreditCard className="text-blue-600" size={24} />
                  </div>
                  Payment Method
                </h3>

                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl border-2 border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-100 flex items-center">
                <ListChecks className="mr-2 text-blue-500" size={18} />
                Summary
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium">{parkingData?.name}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Start</span>
                  <span className="font-medium">
                    {reservationData.startDate.toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">End</span>
                  <span className="font-medium">
                    {reservationData.endDate.toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {reservationData.vehicleType && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span className="font-medium">
                      {reservationData.vehicleType}
                    </span>
                  </div>
                )}

                {reservationData.matricule && (
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">License Plate</span>
                    <span className="font-medium text-blue-600">
                      {reservationData.matricule}
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-2 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">
                      {Math.ceil(
                        (new Date(reservationData.endDate) -
                          new Date(reservationData.startDate)) /
                          (1000 * 60 * 60)
                      )}{" "}
                      heures
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">PrPrice Per Hour</span>
                    <span className="font-medium">
                      {parkingData?.pricing?.hourly}Dt
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      {calculatedPrice}Dt
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {/* Create a flex container for buttons */}
                <div className="flex gap-4">
                 
                  
                  {/* Back button */}
                  <button
  onClick={() => setCurrentStep(1)}
  disabled={loading}
  className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out flex-1 flex items-center justify-center font-medium"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  Back to Dates
</button>
<button
  onClick={handleNextOrConfirm}
  disabled={loading || !isStepValid()}
  className={`bg-black text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out flex-1 flex items-center justify-center font-medium${
    loading || !isStepValid()
      ? "bg-gray-300 cursor-not-allowed text-gray-500"
      : "bg-blue-600 hover:bg-blue-700 text-black"
  }`}
>
  {loading ? (
    <>
      <span className="animate-spin mr-2">⌛</span>
      Traitement...
    </>
  ) : (
    <>
      Confirm
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </>
  )}
</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 flex items-center mt-5">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* QR code modal */}
      {qrCode && (
        <QRCodeModal
          qrCode={qrCode}
          onPrint={handlePrint}
          onContinue={() => {
            setQrCode(null);
            onContinue();
          }}
          onViewReservations={() => navigate("/mes-reservations")}
        />
      )}
    </div>
  );
};

export default Reservation;
