import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

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
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
