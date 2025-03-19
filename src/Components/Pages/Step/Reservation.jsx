import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';

// Ajouter l'import pour la locale française de date-fns
import { registerLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';

// Enregistrer la locale française
registerLocale('fr', fr);

// Vehicle types with optimized data structure
const VEHICLE_TYPES = [
  {
    value: "Moto",
    label: "Moto",
    image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765730/moto_xdypx2.png"
  },
  {
    value: "Citadine",
    label: "City Car",
    image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-ville_ocwbob.png"
  },
  {
    value: "Berline / Petit SUV",
    label: "Small SUV",
    image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/wagon-salon_bj2j1s.png"
  },
  {
    value: "Familiale / Grand SUV",
    label: "Large SUV",
    image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-familiale_rmgclg.png"
  },
  {
    value: "Utilitaire",
    label: "Utility Vehicle",
    image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png"
  }
];

// Payment methods with consistent structure
const PAYMENT_METHODS = [
  { id: 'online', label: 'Carte bancaire', icon: <CreditCard size={18} /> },
  { id: 'cash', label: 'Espèces', icon: <DollarSign size={18} /> }
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
const CustomDatePicker = ({ selected, onChange, label, minDate, isStartDate = false }) => {
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
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
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
      isStartDate && selected?.toDateString() === new Date().toDateString()
        ? getMinDate()
        : getMinTime()
    }
    maxTime={getMaxTime()}
    locale="fr"
    className="w-full py-3 px-12 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    calendarClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
    dayClassName={date => 
      date.getDate() === selected?.getDate() && 
      date.getMonth() === selected?.getMonth() 
        ? "bg-blue-500 text-white rounded-full" 
        : "text-gray-700 hover:bg-blue-100"
    }
    popperClassName="z-50"
    popperPlacement="bottom-start"
    popperModifiers={[
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ]}
    showPopperArrow={false}
    autoComplete="off"
    disabledKeyboardNavigation
    placeholderText="Sélectionner date et heure"
    timeInputLabel="Heure:"
    filterTime={(time) => {
      const minutes = time.getMinutes();
      return minutes === 0 || minutes === 30;
    }}
  />
  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
    {isStartDate ? (
      <Calendar className="w-5 h-5 text-blue-500" />
    ) : (
      <Clock className="w-5 h-5 text-blue-500" />
    )}
  </div>
  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
    <ChevronDown className="w-5 h-5 text-gray-400" />
  </div>
</div>
    </div>
  );
};

// Vehicle type selector component
const VehicleTypeSelector = ({ selectedType, onSelect }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {VEHICLE_TYPES.map(type => (
      <div
        key={type.value}
        onClick={() => onSelect(type.value)}
        className={`p-3 border rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center shadow-sm
          ${
            selectedType === type.value 
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
      >
        {/* Image */}
        <div className="bg-gray-100 p-3 rounded-xl w-16 h-16 flex justify-center items-center mb-3">
          <img src={type.image} alt={type.label} className="w-12 h-12 object-contain" />
        </div>

        {/* Label */}
        <p className="font-semibold text-gray-800">{type.label}</p>

        {/* Check icon if selected */}
        {selectedType === type.value && (
          <CheckCircle2 size={24} className="text-blue-500 mt-2" />
        )}
      </div>
    ))}
  </div>
);

// Payment method selector component
const PaymentMethodSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
    {PAYMENT_METHODS.map(method => (
      <div
        key={method.id}
        onClick={() => onSelect(method.id)}
        className={`p-4 border rounded-xl cursor-pointer transition-all ${
          selected === method.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
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

// Price details component
const PriceSummary = ({ priceDetails, totalPrice }) => (
  <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200">
    {priceDetails.map((detail, index) => (
      <div key={index} className="flex justify-between text-gray-600 py-2 border-b border-gray-100">
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
const QRCodeModal = ({ qrCode, onPrint, onContinue, onViewReservations }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-semibold text-center flex-grow">Votre QR Code</h4>
        <button
          onClick={onContinue}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
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
          onClick={onContinue}
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


const Reservation = ({ parkingData, onContinue }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationInfo, setReservationInfo] = useState({
    startDate: (() => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10); // Ajoute 10 minutes
      now.setSeconds(0); // Mettre les secondes à 0
      return now;
    })(),
    endDate: (() => {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 70); // 10 minutes + 1 heure
      date.setSeconds(0);
      return date;
    })(),
    vehicleType: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  useEffect(() => {
    if (parkingData?._id) {
      calculatePrice();
    }
  }, [parkingData, reservationInfo.startDate, reservationInfo.endDate]);

  // Calculate price based on duration and parking rates
  const calculatePrice = () => {
    if (!parkingData?.pricing?.hourly) return;
  
    const timeDiff = new Date(reservationInfo.endDate) - new Date(reservationInfo.startDate);
    const totalMinutes = Math.ceil(timeDiff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    let total = 0;
  
    // Monthly calculation
    if (hours >= 720) {
      const months = Math.floor(hours / 720);
      total += months * parkingData.pricing.monthly;
      const remainingHours = hours % 720;
      
      if (remainingHours > 0 || remainingMinutes > 0) {
        // Daily calculation for remaining time
        if (remainingHours >= 24) {
          const days = Math.floor(remainingHours / 24);
          total += days * parkingData.pricing.daily;
          const lastHours = remainingHours % 24;
          
          // Calculate remaining hours and minutes
          if (lastHours > 0 || remainingMinutes > 0) {
            total += (lastHours * parkingData.pricing.hourly);
            total += (remainingMinutes / 60) * parkingData.pricing.hourly;
          }
        } else {
          // Less than a day remaining
          total += (remainingHours * parkingData.pricing.hourly);
          total += (remainingMinutes / 60) * parkingData.pricing.hourly;
        }
      }
    }
    // Daily calculation
    else if (hours >= 24) {
      const days = Math.floor(hours / 24);
      total += days * parkingData.pricing.daily;
      const remainingHours = hours % 24;
      
      // Calculate remaining hours and minutes
      if (remainingHours > 0 || remainingMinutes > 0) {
        total += (remainingHours * parkingData.pricing.hourly);
        total += (remainingMinutes / 60) * parkingData.pricing.hourly;
      }
    }
    // Hourly and minutes calculation
    else {
      total += (hours * parkingData.pricing.hourly);
      total += (remainingMinutes / 60) * parkingData.pricing.hourly;
    }
  
    // Round to 2 decimal places
    setCalculatedPrice(Math.round(total * 100) / 100);
  };
  
  // Format price details for display
  const priceDetails = useMemo(() => {
    if (!parkingData?.pricing) return [];
  
    const timeDiff = new Date(reservationInfo.endDate) - new Date(reservationInfo.startDate);
    const totalMinutes = Math.ceil(timeDiff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
  
    let details = [];
  
    if (months > 0) {
      details.push(`${months} mois à ${parkingData.pricing.monthly}Dt/mois`);
    }
  
    const remainingDays = days % 30;
    if (remainingDays > 0) {
      details.push(`${remainingDays} jours à ${parkingData.pricing.daily}Dt/jour`);
    }
  
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      const hourlyPrice = (remainingHours * parkingData.pricing.hourly).toFixed(2);
      details.push(`${remainingHours} heure${remainingHours > 1 ? 's' : ''} à ${hourlyPrice}Dt`);
    }
  
    if (remainingMinutes > 0) {
      const minutePrice = ((remainingMinutes / 60) * parkingData.pricing.hourly).toFixed(2);
      details.push(`${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} à ${minutePrice}Dt`);
    }
  
    return details;
  }, [parkingData, reservationInfo.startDate, reservationInfo.endDate]);
  

  // Handle reservation submission
  const handleSubmit = async () => {
    try {
      if (!parkingData?._id) {
        setError('Données du parking invalides');
        return;
      }

      if (!reservationInfo.vehicleType) {
        setError('Veuillez sélectionner un type de véhicule');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour effectuer une réservation');
        return;
      }

      // Validate date range
      const minDuration = 60 * 60 * 1000; // 1 heure minimum
      if (new Date(reservationInfo.endDate) - new Date(reservationInfo.startDate) < minDuration) {
        setError('La durée minimale de réservation est de 1 heure');
        return;
      }

      // Validate dates are not in the past
      if (new Date(reservationInfo.startDate) < new Date()) {
        setError('La date de début ne peut pas être dans le passé');
        return;
      }

      setLoading(true);
      setError('');

      const reservationData = {
        parkingId: parkingData._id,
        startTime: reservationInfo.startDate.toISOString(),
        endTime: reservationInfo.endDate.toISOString(),
        vehicleType: reservationInfo.vehicleType,
        totalPrice: calculatedPrice,
        paymentMethod: paymentMethod
      };

      const response = await axios.post(
        'http://localhost:3001/api/reservations',
        reservationData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setQrCode(response.data.qrCode);
      setCurrentStep(4);

    } catch (err) {
      console.error('Erreur de réservation:', err);
      const errorMessage = err.response?.data?.message || 
                         'Erreur lors de la réservation. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle QR code printing
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
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
                <span>${new Date(reservationInfo.startDate).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date de départ:</span>
                <span>${new Date(reservationInfo.endDate).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type de véhicule:</span>
                <span>${reservationInfo.vehicleType}</span>
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

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Date selection
        const minDuration = 60 * 60 * 1000; // 1 heure en millisecondes
        
        return (
          reservationInfo.startDate && 
          reservationInfo.endDate && 
          new Date(reservationInfo.endDate) > new Date(reservationInfo.startDate) &&
          (new Date(reservationInfo.endDate) - new Date(reservationInfo.startDate)) >= minDuration
        );
      case 2: // Vehicle type
        return !!reservationInfo.vehicleType;
      case 3: // Payment method
        return !!paymentMethod;
      default:
        return false;
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
        case 1: // Date selection
        return (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                  <Calendar className="mr-2 text-blue-600" size={20} />
                  Dates de stationnement
                </h3>
                
            {/* Changement pour affichage vertical avec DatePickers plus larges */}
<div className="flex flex-col space-y-10 w-full max-w-lg">
  <CustomDatePicker
    selected={reservationInfo.startDate}
    onChange={date => setReservationInfo(prev => ({
      ...prev,
      startDate: date,
      // Ensure endDate is at least 1 hour after startDate
      endDate: new Date(date.getTime() + 60 * 60 * 1000) > prev.endDate
        ? new Date(date.getTime() + 60 * 60 * 1000)
        : prev.endDate
    }))}
    label="Date et heure d'arrivée"
    minDate={new Date()}
    isStartDate={true}
    className="w-full"
  />

  <CustomDatePicker
    selected={reservationInfo.endDate}
    onChange={date => setReservationInfo(prev => ({
      ...prev,
      endDate: date
    }))}
    label="Date et heure de départ"
    minDate={new Date(reservationInfo.startDate.getTime() + 60 * 60 * 1000)}
    className="w-full"
  />
</div>

                
                <div className="mt-6 pt-5 border-t-2 border-gray-200">
                  <div className="flex items-center text-blue-700 mb-3">
                    <Clock size={20} className="mr-2" />
                    <span className="font-medium">Durée totale:</span>
                  </div>
                  <div className="bg-blue-50/90 text-gray-800 font-semibold p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                    {(() => {
                      const diff = new Date(reservationInfo.endDate) - new Date(reservationInfo.startDate);
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      
                      let result = [];
                      if (days > 0) result.push(`${days} jour${days > 1 ? 's' : ''}`);
                      if (hours > 0) result.push(`${hours} heure${hours > 1 ? 's' : ''}`);
                      if (days === 0 && minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
                      
                      return result.join(' et ') || '0 minute';
                    })()}
                  </div>
                </div>
              </div>
            </div>
          );
      case 2: // Vehicle type selection
        return (
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Car className="mr-2 text-blue-500" size={30} />
              Type de véhicule
            </h3>
            <VehicleTypeSelector 
              selectedType={reservationInfo.vehicleType}
              onSelect={(type) => setReservationInfo(prev => ({...prev, vehicleType: type}))}
            />
          </div>
        );
      
      case 3: // Payment method
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2 text-blue-500" size={20} />
                Méthode de paiement
              </h3>
              <PaymentMethodSelector
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </div>
            
            <div className="bg-blue-50/90 p-5 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 shadow-sm">
                  <AlertCircle size={18} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Information importante</h4>
                  <p className="text-blue-600 text-sm">
                    Le paiement sera effectué sur place. Veuillez vous présenter avec votre QR code pour accéder au parking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Nouvelle section pour le nom du parking et places disponibles */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl mb-8 border-2 border-gray-200 shadow-md text-center">
  {/* Titre centré */}
  <h2 className="text-3xl font-bold text-gray-800 mb-3">
    {parkingData?.name || "Nom du parking"}
  </h2>
  
  {/* Informations alignées au centre */}
  <div className="flex justify-center items-center space-x-4">
    {/* Nombre de places disponibles */}
    <div className="flex items-center">
      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
      <span className="font-medium text-gray-700">
        {parkingData?.availableSpots ?? 0} places disponibles
      </span>
    </div>
    
    <span className="text-gray-400">|</span>
    
    {/* Adresse */}
    <div className="text-gray-600 flex items-center">
      <MapPin size={16} className="mr-1" />
      {parkingData?.address || "Adresse du parking"}
    </div>
  </div>
</div>

 
      
      {/* Main form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Current step content */}
        <div>
          {renderStepContent()}
        </div>
  
        {/* Right column - Summary and action button */}
        <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
        <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">Récapitulatif</h3>
            
            {/* Reservation details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Parking</span>
                <span className="font-medium">{parkingData?.name}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Début</span>
                <span className="font-medium">
                  {reservationInfo.startDate.toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Fin</span>
                <span className="font-medium">
                  {reservationInfo.endDate.toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              {reservationInfo.vehicleType && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Type de véhicule</span>
                  <span className="font-medium">{reservationInfo.vehicleType}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Total A payer</span>
                <span className="font-medium">{calculatedPrice}Dt</span>
              </div>
              
              {currentStep >= 3 && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Méthode de paiement</span>
                  <span className="font-medium">
                    {paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4 flex items-center">
                <AlertCircle size={18} className="mr-2 text-red-500" />
                {error}
              </div>
            )}
            
          {/* Boutons en ligne */}

<div className="flex justify-between w-full">
  {/* Bouton retour (affiché seulement si currentStep > 1) */}
  {currentStep > 1 && (
    <button
      onClick={() => setCurrentStep(currentStep - 1)}
      className="py-2 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
    >
      Retour
    </button>
  )}

  {/* Espacement pour s'assurer que les boutons restent aux extrémités */}
  <div className="flex-1"></div>

  {/* Bouton d'action */}
  <button
    onClick={nextStep}
    disabled={loading || !isStepValid()}
    className={`py-4 px-6 text-lg font-medium rounded-xl flex items-center justify-center transition-colors ${
      loading || !isStepValid()
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-black'
    }`}
  >
    {loading ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Traitement...
      </>
    ) : (
      currentStep < 3 ? 'Continuer' : 'Confirmer et payer'
    )}
  </button>
</div>

          </div>
        </div>
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
          onViewReservations={() => {
            setQrCode(null);
            navigate('/mes-reservations');
          }}
        />
      )}
    </div>
  );
};

export default Reservation;
