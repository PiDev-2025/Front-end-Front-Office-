import React, { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../context/GoogleMapsContext"; // Import Google Maps context

const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris (Default center)

const parkings = [
    { id: 1, name: "Gare de Lyon - SAEMES", lat: 48.84720497852658, lng: 2.3696914951579324 },
    { id: 2, name: "Bastille - Boulevard Bourdon", lat: 48.8534, lng: 2.3695 },
    { id: 3, name: "Gare de Lyon - Citadines", lat: 48.8452, lng: 2.3710 },
    { id: 4, name: "Rue du Faubourg Saint Antoine", lat: 48.8530, lng: 2.3718 },
    { id: 5, name: "Gare de Bercy - AccorHotels Arena", lat: 48.8373, lng: 2.3796 },
];

const SecLocation = () => {
    const { isLoaded } = useGoogleMaps(); // Check if Google Maps is loaded
    const [mapRef, setMapRef] = useState(null); // Store Google Map reference

    if (!isLoaded) return <div>Loading Google Maps...</div>;

    // Red marker icon
    const redMarkerIcon = {
        url: "../../../marker.png",
        scaledSize: new window.google.maps.Size(40, 40),
    };

    // Function to move the map to a selected parking location
    const handleHover = (parking) => {
        if (mapRef) {
            console.log("Map reference:", mapRef); // Check if it's initialized
            mapRef.panTo({ lat: parking.lat, lng: parking.lng });
            mapRef.setZoom(16);
        }
    };


    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Available Parkings</h2>
                <ul>
                    {parkings.map((parking) => (
                        <li
                            key={parking.id}
                            className="p-3 mb-2 bg-white shadow-md rounded cursor-pointer hover:bg-gray-200"
                            onMouseEnter={() => handleHover(parking)}
                        >
                            {parking.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Google Map */}
            <div className="w-2/3">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={14}
                    center={defaultCenter}
                    onLoad={(map) => setMapRef(map)}
                >
                    <Marker position={{ lat: 48.8566, lng: 2.3522 }} />
                    {parkings.map((parking) => (
                        <Marker
                            key={parking.id}
                            position={{ lat: parking.lat, lng: parking.lng }}
                        />
                    ))}
                </GoogleMap>

            </div>
        </div>
    );
};

export default SecLocation;
