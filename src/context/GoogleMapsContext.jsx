import React, { createContext, useContext, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsContext = createContext(null);

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
    libraries: ["places"],  // ✅ Ensure this is always the same
  });

  const [selectedLocation, setSelectedLocation] = useState(null); // Store last selected location

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, selectedLocation, setSelectedLocation }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
