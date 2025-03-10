import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const MapComponent = ({ center, zoom = 15, markers = [] }) => {
  const mapStyles = {
    height: "400px",
    width: "100%",
    borderRadius: "20px"
  };

  const customMapStyle = [
    {
      "featureType": "landscape",
      "stylers": [
        { "color": "#f5f5f5" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        { "color": "#9ca5b3" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        { "color": "#c9e9f0" }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        { "visibility": "off" }
      ]
    }
  ];

  const { isLoaded, userLocation } = useGoogleMaps();
  const [directions, setDirections] = useState(null); // Store directions
  const [distances, setDistances] = useState([]);

  // Function to calculate distance between two points using the Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    if (userLocation && markers.length > 0) {
      const results = markers.map(marker => ({
        ...marker,
        distance: calculateDistance(userLocation.lat, userLocation.lng, marker.position.lat, marker.position.lng).toFixed(1) + ' km',
      }));
      setDistances(results);
    }
  }, [userLocation, markers]);

  const handleMarkerClick = (marker) => {
    if (userLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: marker.position,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  if (!isLoaded) {
    return <div style={mapStyles}>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={zoom}
      center={center}
      options={{
        styles: customMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
        backgroundColor: '#f5f5f5',
      }}
    >
      {distances.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={`${marker.title} - ${marker.distance}`}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
      {userLocation && (
        <Marker 
          position={userLocation}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />
      )}
      {directions && (
        <DirectionsRenderer
          directions={directions}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
