import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../context/GoogleMapsContext";

const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 48.8566, lng: 2.3522 };

const parkings = [
    { id: 1, name: "Gare de Lyon - SAEMES", lat: 48.8472, lng: 2.3696, price: "€3/hr" },
    { id: 2, name: "Bastille - Boulevard Bourdon", lat: 48.8534, lng: 2.3695, price: "€4/hr" },
    { id: 3, name: "Gare de Lyon - Citadines", lat: 48.8452, lng: 2.3710, price: "€2.5/hr" },
];

const SecLocation = () => {
    const { isLoaded } = useGoogleMaps();
    const [mapRef, setMapRef] = useState(null);
    const [activeParking, setActiveParking] = useState(null);
    const [storedParkings, setStoredParkings] = useState([]);
    const [hoveredParking, setHoveredParking] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem("parkings");
        if (storedData) {
            setStoredParkings(JSON.parse(storedData));
        } else {
            setStoredParkings(parkings);
            localStorage.setItem("parkings", JSON.stringify(parkings));
        }
    }, []);

    useEffect(() => {
        if (storedParkings.length > 0) {
            localStorage.setItem("parkings", JSON.stringify(storedParkings));
        }
    }, [storedParkings]);

    const handleHover = (parking) => {
        setHoveredParking(parking.id);
        if (mapRef) {
            mapRef.panTo({ lat: parking.lat, lng: parking.lng });
            mapRef.setZoom(16);
        }
    };

    const handleMarkerClick = (parking) => {
        setActiveParking(parking);
    };

    if (!isLoaded) return <div>Loading Google Maps...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 bg-white p-6 overflow-y-auto shadow-lg">
                <h2 className="text-2xl font-bold mb-6">🚗 Available Parkings</h2>
                <ul className="space-y-4">
                    {storedParkings.map((parking) => (
                        <li
                            key={parking.id}
                            className={`p-4 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105 hover:shadow-xl bg-gray-100 flex items-center`}
                            onMouseEnter={() => handleHover(parking)}
                        >
                            <img src="/images/marker.png" alt="Parking" className="w-12 h-12 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold">{parking.name}</h3>
                                <p className="text-gray-500">{parking.price}</p>
                                <p className="text-green-500 font-semibold">🚶 4 min walk</p>
                                {activeParking?.id === parking.id && (
                                    <button className="mt-2 px-4 py-2 bg-blue-600 text-black font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300">
                                        ✅ Selected
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Google Map */}
            <div className="w-2/3 relative">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={14}
                    center={defaultCenter}
                    onLoad={(map) => setMapRef(map)}
                >
                    {storedParkings.map((parking) => (
                        <Marker
                            key={parking.id}
                            position={{ lat: parking.lat, lng: parking.lng }}
                            icon={{
                                url: hoveredParking === parking.id ? "/images/black-mark.png" : "/images/red-mark.png",
                                scaledSize: new window.google.maps.Size(50, 50),
                            }}
                            onClick={() => handleMarkerClick(parking)}
                        />
                    ))}

                    {/* Show InfoWindow only when clicking on marker */}
                    {activeParking && (
                        <InfoWindow
                            position={{ lat: activeParking.lat, lng: activeParking.lng }}
                            onCloseClick={() => setActiveParking(null)}
                        >
                            <div>
                                <h3 className="text-lg font-bold">{activeParking.name}</h3>
                                <p>{activeParking.price}</p>
                                <p className="text-blue-500">🚶 4 min walk</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default SecLocation;
