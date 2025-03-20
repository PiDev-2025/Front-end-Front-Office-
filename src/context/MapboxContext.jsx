import React, { createContext, useContext, useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';

const MapboxContext = createContext({
  isLoaded: false,
  selectedLocation: null,
  setSelectedLocation: () => {},
  userLocation: null,
  setUserLocation: () => {},
});

export const MapboxProvider = ({ children }) => {
  if (!process.env.REACT_APP_MAPBOX_TOKEN) {
    console.error('Mapbox token is not defined in environment variables');
  }

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Mapbox is properly initialized
    if (mapboxgl.accessToken) {
      setIsLoaded(true);
      
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
    }
  }, []);

  const value = {
    isLoaded,
    selectedLocation,
    setSelectedLocation,
    userLocation,
    setUserLocation,
  };

  return (
    <MapboxContext.Provider value={value}>
      {children}
    </MapboxContext.Provider>
  );
};

export const useMapbox = () => {
  const context = useContext(MapboxContext);
  if (context === undefined) {
    throw new Error('useMapbox must be used within a MapboxProvider');
  }
  return context;
};
