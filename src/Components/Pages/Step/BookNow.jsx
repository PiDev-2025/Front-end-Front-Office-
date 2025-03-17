import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";


const mapContainerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 36.8065, lng: 10.1815 }; // Default: Tunis

const vehiculeOptions = [
  { value: "Moto", label: "Motorcycle", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765730/moto_xdypx2.png" },
  { value: "Citadine", label: "City Car", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-ville_ocwbob.png" },
  { value: "Berline / Petit SUV", label: "Sedan / Small SUV", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/wagon-salon_bj2j1s.png" },
  { value: "Familiale / Grand SUV", label: "Family / Large SUV", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-familiale_rmgclg.png" },
  { value: "Utilitaire", label: "Utility vehicle", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png" }
];

const featureIcons = {
  "Indoor Parking": "🏢",
  "Underground Parking": "🚇",
  "Unlimited Entrances & Exits": "🔄",
  "Extension Available": "⏱️"
};

const BookNow = ({ parkingData, onContinue }) => {
  const { id } = useParams();
  const [parking, setParking] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    if (parkingData) {
        console.log("📩 Données reçues via parkingData:", parkingData);

        const formattedData = {
            name: parkingData.name || parkingData.nameP,
            description: parkingData.description || "",
            position: {
                lat: parkingData.position?.lat || parkingData.lat,
                lng: parkingData.position?.lng || parkingData.lng
            },
            location: parkingData.location || "",
            pricing: {
                hourly: parseFloat(parkingData.pricing?.hourly || parkingData.pricing?.perHour || 0),
                daily: parseFloat(parkingData.pricing?.daily || parkingData.pricing?.perDay || 0),
                weekly: parseFloat(parkingData.pricing?.weekly || parkingData.pricing?.perWeek || 0),
                monthly: parseFloat(parkingData.pricing?.monthly || 0)
            },
            totalSpots: parkingData.totalSpots,
            availableSpots: parkingData.availableSpots,
            vehicleTypes: parkingData.vehicleTypes || ["Citadine", "Berline / Petit SUV"],
            features: parkingData.features || [],
            images: parkingData.images || []
        };

        console.log("📌 Données après formatage:", formattedData);

        setParking(formattedData);
        setLoading(false);
        return;
    }

    if (id) {
        axios.get(`http://localhost:3001/parkings/parkings/${id}`)
            .then(response => {
                console.log("📥 Données reçues depuis l'API:", response.data);

                const formattedData = {
                    name: response.data.name || response.data.nameP,
                    description: response.data.description || "",
                    position: {
                        lat: response.data.position?.lat || response.data.lat,
                        lng: response.data.position?.lng || response.data.lng
                    },
                    location: response.data.location || "",
                    pricing: {
                        hourly: parseFloat(response.data.pricing?.hourly || response.data.pricing?.perHour || 0),
                        daily: parseFloat(response.data.pricing?.daily || response.data.pricing?.perDay || 0),
                        weekly: parseFloat(response.data.pricing?.weekly || response.data.pricing?.perWeek || 0),
                        monthly: parseFloat(response.data.pricing?.monthly || 0)
                    },
                    totalSpots: response.data.totalSpots,
                    availableSpots: response.data.availableSpots,
                    vehicleTypes: response.data.vehicleTypes || ["Citadine", "Berline / Petit SUV"],
                    features: response.data.features || [],
                    images: response.data.images || []
                };

                console.log("📌 Données API après formatage:", formattedData);

                setParking(formattedData);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ Erreur lors de la récupération des détails:", error);
                setError("Impossible de charger les détails du parking.");
                setLoading(false);
            });
    }
}, [id, parkingData]);
const TitleBox = ({ icon, children }) => (
  <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
    <span className="text-xl">{icon}</span>
    <h2 className="font-semibold text-gray-800">{children}</h2>
  </div>
);

  
  
  const mapCenter = parking?.position?.lat && parking?.position?.lng 
    ? { lat: parking.position.lat, lng: parking.position.lng } 
    : defaultCenter;



  const ImageModal = () => {
    if (!selectedImage) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
        <div className="max-w-4xl max-h-screen overflow-auto" onClick={e => e.stopPropagation()}>
          <img src={selectedImage} alt="Parking view" className="max-w-full max-h-[90vh] object-contain" />
          <button 
            className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  // Function to handle reservation
  const handleReservation = () => {
    const parkingToUse = parkingData || parking;
    
    if (onContinue && parkingToUse) {
      console.log("Using onContinue with parking data:", parkingToUse);
      onContinue(parkingToUse);
    } else {
      console.log("Navigating to booking with parking data:", parkingToUse);
      navigate('/booking', { 
        state: { 
          selectedParking: parkingToUse,
          step: 3 
        }
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>;

  const availabilityPercentage = (parking.availableSpots / parking.totalSpots) * 100;
  
  let availabilityColor = "bg-green-500";
  if (availabilityPercentage < 20) {
    availabilityColor = "bg-red-500";
  } else if (availabilityPercentage < 50) {
    availabilityColor = "bg-yellow-500";
  }



  // Display name with fallback
  const parkingName = parking.name || parking.nameP || "Parking";
  const parkingDescription = parking.description || "";
  const parkingLocation = parking.location || "";
  

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header with name (moved description to its own box below) */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
        <h1 className="text-3xl font-bold text-black text-center">{parkingName || "Nom du parking"}</h1>
          {parkingLocation && (
            <p className="mt-3 text-blue-200 flex items-center">
              <span className="mr-1">📍</span> {parkingLocation}
            </p>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Map and Availability */}
        <div className="lg:col-span-2 space-y-6">
           {/* Map */}
           <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
           <TitleBox icon="📍">Location</TitleBox>
            <div className="overflow-hidden rounded-b-lg">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={mapCenter}
                options={{ streetViewControl: false, mapTypeControl: false }}
              >
                {(parking.position?.lat || parking.lat) && (parking.position?.lng || parking.lng) && (
                  <Marker position={mapCenter} />
                )}
              </GoogleMap>
            </div>
          </div>
          
                 {/* Photos */}
                 <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                 <TitleBox icon="📸">Parking Views</TitleBox>
            <div className="p-4">
              {parking?.images && parking.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {parking.images.map((image, index) => (
                    <div key={index} className="aspect-video overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={image}
                        alt={`Parking view ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedImage(image)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No images available</p>
                </div>
              )}
            </div>
          </div>
   
          {parkingDescription && (
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
              <TitleBox icon="📝">Description</TitleBox>
              <div className="p-5">
                <p className="text-gray-700">{parkingDescription}</p>
              </div>
            </div>
          )}
          
         

        </div>

        {/* Right column - Details */}
        <div className="space-y-6">
                {/* Pricing */}
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                <TitleBox icon="💰">Pricing</TitleBox>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">⏱️</span>
                  <span>Per Hour</span>
                </div>
                <span className="text-xl font-bold">{parking.pricing?.hourly || parking.pricing?.perHour || 0} Dt</span>
              </div>
              
              {(parking.pricing?.daily > 0 || parking.pricing?.perDay > 0) && (
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">📅</span>
                    <span>Per Day</span>
                  </div>
                  <span className="text-xl font-bold">{parking.pricing?.daily || parking.pricing?.perDay} Dt</span>
                </div>
              )}
              
              {(parking.pricing?.weekly > 0 || parking.pricing?.perWeek > 0) && (
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">🗓️</span>
                    <span>Per Week</span>
                  </div>
                  <span className="text-xl font-bold">{parking.pricing?.weekly || parking.pricing?.perWeek} Dt</span>
                </div>
              )}
              
              {parking.pricing?.monthly > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">📆</span>
                    <span>Per Month</span>
                  </div>
                  <span className="text-xl font-bold">{parking.pricing?.monthly} Dt</span>
                </div>
              )}
                {/* Reservation Button - Modified */}
                <button 
                onClick={handleReservation}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-black foBdium rounded-lg transition-colors text-center"
              >
                Réserver
              </button>
            </div>
          </div>
       {/* Availability */}
       <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
       <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
        <span className="text-blue-500 mr-2">🅿️</span>
        <span className="font-bold text-lg">Availability</span>
      </div>
      
      <div className="p-5">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium text-lg">Current Capacity</span>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${availabilityColor}`}></span>
              <span className="font-bold text-lg">{parking.availableSpots}/{parking.totalSpots} spots</span>
            </div>
          </div>
          
          <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <div
              className={`h-full ${availabilityColor} transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${availabilityPercentage}%` }}
            >
              {availabilityPercentage > 15 && (
                <span className="text-white text-xs font-bold">{availabilityPercentage.toFixed(0)}%</span>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {availabilityPercentage < 20 ? "Almost Full" :
                availabilityPercentage < 50 ? "Moderately Occupied" :
                "Good Availability"}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              availabilityPercentage < 20 ? "bg-red-100 text-red-800" :
              availabilityPercentage < 50 ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
            }`}>
              {availabilityPercentage.toFixed(0)}% Available
            </span>
          </div>
        </div>
      </div>
    </div>

       

          {/* Accepted Vehicles */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
          <TitleBox icon="🚗">Accepted Vehicles</TitleBox>
            <div className="p-5">
              <div className="flex flex-wrap gap-4 justify-center">
                {parking.vehicleTypes && parking.vehicleTypes.length > 0 ? (
                  parking.vehicleTypes.map((type) => {
                    const vehicle = vehiculeOptions.find((v) => v.value === type);
                    return vehicle ? (
                      <div key={type} className="flex flex-col items-center bg-gray-50 rounded-lg p-3 w-24 text-center">
                        <img src={vehicle.image} alt={vehicle.label} className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium text-gray-700">{vehicle.label}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-500 text-sm text-center">No vehicles specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Features (if available) */}
          {parking.features && parking.features.length > 0 && (
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
              <TitleBox icon="✨">Features</TitleBox>
              <div className="p-5">
                <ul className="space-y-2">
                  {parking.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-2 text-lg">{featureIcons[feature] || "✓"}</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

     

      {/* Image modal */}
      {selectedImage && <ImageModal />}
    </div>
  );
};

export default BookNow;