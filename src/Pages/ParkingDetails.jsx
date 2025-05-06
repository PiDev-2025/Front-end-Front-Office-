import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapbox } from "../context/MapboxContext";

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

const ParkingDetails = ({ parkingData, isPopup }) => {
  const { id } = useParams();
  const [parking, setParking] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { isLoaded } = useMapbox();

  useEffect(() => {
    // If parkingData is provided (popup mode), use that directly
    if (parkingData) {
      // Transform popup data format to match API format if needed
      const formattedData = {
        name: parkingData.name || parkingData.nameP, // Try both formats
        description: parkingData.description || "",
        position: {
          lat: parkingData.position?.lat || parkingData.lat,
          lng: parkingData.position?.lng || parkingData.lng
        },
        location: parkingData.location || "", // Keep the location field for backward compatibility
        pricing: {
          hourly: parseFloat(parkingData.pricing?.hourly || parkingData.pricing?.perHour || 0),
          daily: parseFloat(parkingData.pricing?.daily || parkingData.pricing?.perDay || 0),
          weekly: parseFloat(parkingData.pricing?.weekly || parkingData.pricing?.perWeek || 0),
          monthly: parseFloat(parkingData.pricing?.monthly || 0)
        },
        totalSpots: parkingData.totalSpots,
        availableSpots: parkingData.availableSpots,
        vehicleTypes: parkingData.vehicleTypes || parkingData.vehicleTypes || ["Citadine", "Berline / Petit SUV"],
        features: parkingData.features || [],
        images: parkingData.images || []
      };
      setParking(formattedData);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch from API using ID from URL params
    if (id) {
      axios.get(`https://parkini-backend.onrender.com/parkings/parkings/${id}`)
        .then(response => {
          // Handle potential difference in API response format
          const data = response.data;
          const formattedData = {
            name: data.name || data.nameP,
            description: data.description || "",
            position: {
              lat: data.position?.lat || data.lat,
              lng: data.position?.lng || data.lng
            },
            location: data.location || "",
            pricing: {
              hourly: parseFloat(data.pricing?.hourly || data.pricing?.perHour || 0),
              daily: parseFloat(data.pricing?.daily || data.pricing?.perDay || 0),
              weekly: parseFloat(data.pricing?.weekly || data.pricing?.perWeek || 0),
              monthly: parseFloat(data.pricing?.monthly || 0)
            },
            totalSpots: data.totalSpots,
            availableSpots: data.availableSpots,
            vehicleTypes: data.vehicleTypes || ["Citadine", "Berline / Petit SUV"],
            features: data.features || [],
            images: data.images || []
          };
          setParking(formattedData);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error while fetching parking details:", error);
          setError("Unable to load parking details.");
          setLoading(false);
        });
    }
  }, [id, parkingData]);
  
  useEffect(() => {
    if (isLoaded && mapContainer.current && parking) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [parking.position.lng, parking.position.lat],
        zoom: 15
      });

      // Ajouter le marqueur
      const el = document.createElement('div');
      el.className = 'parking-marker';
      el.innerHTML = `
        <svg width="30" height="45" viewBox="0 0 30 45">
          <path fill="#22C55E" d="M15 0C6.7 0 0 6.7 0 15c0 8.3 15 30 15 30s15-21.7 15-30c0-8.3-6.7-15-15-15z"/>
          <circle fill="white" cx="15" cy="15" r="7"/>
        </svg>
      `;

      new mapboxgl.Marker(el)
        .setLngLat([parking.position.lng, parking.position.lat])
        .addTo(map.current);

      // Ajouter les contrôles de navigation
      map.current.addControl(new mapboxgl.NavigationControl());

      return () => map.current.remove();
    }
  }, [isLoaded, parking]);

  const TitleBox = ({ children, icon }) => {
    return (
      <div className="py-3 px-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg border-b">
        <h2 className="text-blue-800 font-bold text-xl flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {children}
        </h2>
      </div>
    );
  };

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



  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>;

  const availabilityPercentage = (parking.availableSpots / parking.totalSpots) * 100;
  const availabilityColor = 
    availabilityPercentage > 50 ? "bg-green-500" : 
    availabilityPercentage > 20 ? "bg-yellow-500" : 
    "bg-red-500";

  // Display name with fallback
  const parkingName = parking.name || parking.nameP || "Parking";
  const parkingDescription = parking.description || "";
  const parkingLocation = parking.location || "";
  

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header with name (moved description to its own box below) */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
           <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <TitleBox icon="📍">Location</TitleBox>
            <div className="overflow-hidden rounded-b-lg">
              <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />
            </div>
          </div>
          
          {/* Photos */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <TitleBox icon="📸">Parking Views</TitleBox>
            <div className="p-4">
              {parking.images?.length > 0 ? (
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
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
    
       {/* Availability */}

       

          {/* Accepted Vehicles */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
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

export default ParkingDetails;