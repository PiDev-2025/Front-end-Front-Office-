import React, { createContext, useContext, useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsContext = createContext(null);

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
    libraries: ["places"],  // ✅ Ensure this is always the same
  });

  const [selectedLocation, setSelectedLocation] = useState(null); // Store last selected location
  const [userLocation, setUserLocation] = useState(null); // Store user's location

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, selectedLocation, setSelectedLocation, userLocation, setUserLocation }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
