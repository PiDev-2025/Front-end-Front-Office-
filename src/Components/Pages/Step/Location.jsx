import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../context/GoogleMapsContext";
import { useSearch } from "../../../context/SearchContext";
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const mapContainerStyle = { width: "100%", height: "calc(100vh - 90px)" }; // Adjusted for search bar
const defaultCenter = { lat: 48.8566, lng: 2.3522 };

const parkings = [
    { id: 1, name: "Gare de Lyon - SAEMES", lat: 48.8472, lng: 2.3696, price: "€3/hr" },
    { id: 2, name: "Bastille - Boulevard Bourdon", lat: 48.8534, lng: 2.3695, price: "€4/hr" },
    { id: 3, name: "Gare de Lyon - Citadines", lat: 48.8452, lng: 2.3710, price: "€2.5/hr" },
];

const SecLocation = () => {
    const { isLoaded } = useGoogleMaps();
    const { searchData, updateSearchData } = useSearch();
    const [mapRef, setMapRef] = useState(null);
    const [activeParking, setActiveParking] = useState(null);
    const [storedParkings, setStoredParkings] = useState([]);
    const [hoveredParking, setHoveredParking] = useState(null);
    
    // Search form states - initialize from context
    const [toogleTab, settoogleTab] = useState(searchData.toogleTab || "On time");
    const [vehicleType, setVehicleType] = useState(searchData.vehicleType);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [startDate, setStartDate] = useState(searchData.startDate);
    const [endDate, setEndDate] = useState(searchData.endDate);
    const [startTime, setStartTime] = useState(searchData.startTime || "14:41");
    const [endTime, setEndTime] = useState(searchData.endTime || "15:41");
    const [autocomplete, setAutocomplete] = useState(null);
    const [address, setAddress] = useState(searchData.address || '');
    const [location, setLocation] = useState(searchData.location);
    const [isSearching, setIsSearching] = useState(false);

    // Vehicle types for dropdown
    const vehicleTypes = [
        { id: "2wheels", name: "2 wheels", description: "Motorcycle, scooter, …" },
        { id: "little", name: "Little", description: "Clio, 208, Twingo, Polo, Corsa, …" },
        { id: "average", name: "AVERAGE", description: "Megane, 308, Scenic, C3 Picasso, Kangoo, Juke, …" },
        { id: "big", name: "Big", description: "C4 Picasso, 508, BMW 3 Series, X-Trail, RAV4, Tiguan, …" },
        { id: "high", name: "High", description: "Mercedes Vito, Renault Trafic, …" },
        { id: "very-high", name: "Very high", description: "Mercedes Sprinter, Renault Master, …" },
    ];

    // Handle vehicle selection
    const handleVehicleSelect = (id) => {
        setVehicleType(id);
        setShowVehicleDropdown(false);
        
        // Update context when vehicle type changes
        updateSearchData({ vehicleType: id });
    };

    // Get selected vehicle name
    const getSelectedVehicleName = () => {
        const selected = vehicleTypes.find(type => type.id === vehicleType);
        return selected ? selected.name : "Select vehicle type";
    };

    // Google Maps Autocomplete handlers
    const onLoadAutocomplete = (autoC) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setLocation(newLocation);
                setAddress(place.formatted_address);
                
                // Update context when location changes
                updateSearchData({ 
                    address: place.formatted_address,
                    location: newLocation
                });
                
                // Pan map to new location
                if (mapRef) {
                    mapRef.panTo(newLocation);
                    mapRef.setZoom(15);
                }
            }
        }
    };

    // Update context when form values change
    useEffect(() => {
        updateSearchData({
            startDate,
            endDate,
            startTime,
            endTime,
            toogleTab
        });
    }, [startDate, endDate, startTime, endTime, toogleTab]);

    // Handle search form submission
    const handleSearch = () => {
        setIsSearching(true);
        
        // Update all form data in the context
        updateSearchData({
            toogleTab,
            address,
            location,
            vehicleType,
            startDate,
            endDate,
            startTime,
            endTime
        });
        
        // Simulate search delay
        setTimeout(() => {
            setIsSearching(false);
            // You could update parking data here based on search criteria
            console.log("Searching for parkings with:", { address, vehicleType, startDate, endDate });
        }, 1000);
    };

    // Set map center based on context location or default
    useEffect(() => {
        if (location && mapRef) {
            mapRef.panTo(location);
            mapRef.setZoom(15);
        }
    }, [mapRef, location]);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                showVehicleDropdown && !event.target.closest('.vehicle-dropdown-toggle')) {
                setShowVehicleDropdown(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showVehicleDropdown]);

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
        <div className="flex flex-col h-full">
            {/* Horizontal Search Form */}
            <div className="bg-gray-100 py-3 mb-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end px-4">
                    {/* Destination Input */}
                    <div className="md:col-span-3">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">Destination</label>
                        <div className="flex items-center gap-2 bg-white px-3 rounded-lg border transition-all hover:border-blue-500 h-10">
                            <img src="./../images/icon.svg" alt="" className="w-4 h-4" />
                            {isLoaded ? (
                                <Autocomplete
                                    onLoad={onLoadAutocomplete}
                                    onPlaceChanged={onPlaceChanged}
                                >
                                    <Form.Control 
                                        type="text" 
                                        className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent text-xs text-gray-800 h-8 px-0 w-full' 
                                        placeholder="Enter destination" 
                                        value={address}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                            updateSearchData({ address: e.target.value });
                                        }}
                                    />
                                </Autocomplete>
                            ) : (
                                <Form.Control 
                                    type="text" 
                                    className='bg-transparent outline-none border-none shadow-none text-xs text-gray-800 h-8 px-0 w-full' 
                                    placeholder="Loading..." 
                                    disabled
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Vehicle Type */}
                    <div className="md:col-span-2 relative">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">Vehicle Type</label>
                        <div 
                            className="vehicle-dropdown-toggle flex items-center justify-between bg-white px-3 py-2 rounded-lg border cursor-pointer transition-all hover:border-blue-500 h-10"
                            onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                        >
                            <div className="text-gray-800 text-xs truncate">{getSelectedVehicleName()}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </div>
                        
                        {showVehicleDropdown && (
                            <div 
                                ref={dropdownRef}
                                className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-300 shadow-lg z-40 max-h-[240px] overflow-y-auto"
                            >
                                {vehicleTypes.map((type) => (
                                    <div 
                                        key={type.id}
                                        onClick={() => handleVehicleSelect(type.id)}
                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                            vehicleType === type.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                                        }`}
                                    >
                                        <div className="font-medium text-xs">{type.name}</div>
                                        <div className="text-xs opacity-70">{type.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Start Date & Time */}
                    <div className="md:col-span-3">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">Start Date & Time</label>
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 flex-grow h-10">
                                <img src="./../images/icon-1.svg" alt="" className="w-3 h-3" />
                                <DatePicker
                                    className='bg-transparent text-gray-800 text-xs outline-none w-full h-8'
                                    placeholderText="Start date"
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        updateSearchData({ startDate: date });
                                    }}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="MMM d"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 w-[80px] h-10">
                                <img src="./../images/icon-2.svg" alt="" className="w-3 h-3" />
                                <Form.Control
                                    type="time"
                                    className='bg-transparent text-gray-800 text-xs border-none shadow-none h-8 px-0 w-full'
                                    value={startTime}
                                    onChange={(e) => {
                                        setStartTime(e.target.value);
                                        updateSearchData({ startTime: e.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* End Date & Time */}
                    <div className="md:col-span-3">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">End Date & Time</label>
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 flex-grow h-10">
                                <img src="./../images/icon-1.svg" alt="" className="w-3 h-3" />
                                <DatePicker
                                    className='bg-transparent text-gray-800 text-xs outline-none w-full h-8'
                                    placeholderText="End date"
                                    selected={endDate}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        updateSearchData({ endDate: date });
                                    }}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="MMM d"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 w-[80px] h-10">
                                <img src="./../images/icon-2.svg" alt="" className="w-3 h-3" />
                                <Form.Control
                                    type="time"
                                    className='bg-transparent text-gray-800 text-xs border-none shadow-none h-8 px-0 w-full'
                                    value={endTime}
                                    onChange={(e) => {
                                        setEndTime(e.target.value);
                                        updateSearchData({ endTime: e.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Search Button */}
                    <div className="md:col-span-1">
                        <button 
                            onClick={handleSearch}
                            className="bg-blue-600 text-white rounded-lg py-2 px-4 w-full h-10 hover:bg-blue-700 transition-colors flex items-center justify-center"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Map and Parking List */}
            <div className="flex flex-1 bg-gray-100 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-white p-4 overflow-y-auto shadow-lg rounded-l-lg">
                    <h2 className="text-xl font-bold mb-4">🚗 Available Parkings</h2>
                    <ul className="space-y-3">
                        {storedParkings.map((parking) => (
                            <li
                                key={parking.id}
                                className={`p-3 rounded-lg shadow-md cursor-pointer transition transform hover:scale-102 hover:shadow-lg ${
                                    activeParking?.id === parking.id ? 'bg-blue-50 border-l-2 border-blue-500' : 'bg-gray-50'
                                }`}
                                onMouseEnter={() => handleHover(parking)}
                                onClick={() => handleMarkerClick(parking)}
                            >
                                <img src="/images/marker.png" alt="Parking" className="w-10 h-10 mr-2 float-left" />
                                <div>
                                    <h3 className="text-base font-semibold">{parking.name}</h3>
                                    <p className="text-gray-500 text-sm">{parking.price}</p>
                                    <p className="text-green-500 font-medium text-xs">🚶 4 min walk</p>
                                </div>
                                <div className="clear-both"></div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Google Map */}
                <div className="w-2/3 relative">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={14}
                        center={location || defaultCenter}
                        onLoad={(map) => setMapRef(map)}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                        }}
                    >
                        {storedParkings.map((parking) => (
                            <Marker
                                key={parking.id}
                                position={{ lat: parking.lat, lng: parking.lng }}
                                icon={{
                                    url: hoveredParking === parking.id || activeParking?.id === parking.id 
                                        ? "/images/black-mark.png" : "/images/red-mark.png",
                                    scaledSize: new window.google.maps.Size(40, 40),
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
                                    <h3 className="text-base font-bold">{activeParking.name}</h3>
                                    <p>{activeParking.price}</p>
                                    <p className="text-blue-500">🚶 4 min walk</p>
                                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                                        Select
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
};

export default SecLocation;
