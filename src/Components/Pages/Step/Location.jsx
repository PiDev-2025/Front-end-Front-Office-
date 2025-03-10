import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../context/GoogleMapsContext";
import { useSearch } from "../../../context/SearchContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ParkingDetails from "../../../Pages/ParkingDetails";

const mapContainerStyle = { width: "100%", height: "calc(100vh - 90px)" }; // Adjusted for search bar
const defaultCenter = { lat: 36.8, lng: 10.18 }; // Tunisia center
const MAX_DISTANCE_KM = 5; // Default maximum distance in kilometers to consider a parking "nearby"

// User location marker icon
const userLocationIcon = {
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='32' height='32'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ff3e00' fill-opacity='0.3'/%3E%3Ccircle cx='12' cy='12' r='6' fill='%23ff3e00'/%3E%3C/svg%3E",
    scaledSize: { width: 32, height: 32 },
    anchor: { x: 16, y: 16 }
};

// Function to generate a custom price marker SVG
const generatePriceMarkerSVG = (price, isLimited) => {
    // Set colors based on availability
    const bgColor = isLimited ? '%23F59E0B' : '%2322C55E'; // Orange or Green
    
    // Format price (remove € symbol if present and trim to reasonable length)
    const formattedPrice = price.replace('€', '').trim();
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 70 40' width='70' height='40'%3E%3Cpath fill='${bgColor}' d='M35 0c-9.4 0-17 7.6-17 17 0 10.5 17 23 17 23s17-12.5 17-23c0-9.4-7.6-17-17-17z'/%3E%3Ctext x='35' y='19' font-family='Arial' font-size='12' text-anchor='middle' font-weight='bold' fill='white'%3E€${formattedPrice}%3C/text%3E%3C/svg%3E`;
};

// Generate custom marker icons for each parking based on price
const createPriceMarker = (price, isLimited) => {
    return {
        url: generatePriceMarkerSVG(price, isLimited),
        scaledSize: { width: 70, height: 40 },
        anchor: { x: 35, y: 40 }
    };
};

// Popup component for parking details
const ParkingDetailsPopup = ({ parking, onClose }) => {
    if (!parking) return null;
    
    // Close when clicking on the background overlay, but not when clicking on the content
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackgroundClick} // Add click handler to the background
        >
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-3 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Use the ParkingDetails component */}
                <ParkingDetails parkingData={parking} isPopup={true} />
            </div>
        </div>
    );
};

// Login Reminder Popup component - Updated with better button visibility
const LoginReminderPopup = ({ onClose }) => {
    const navigate = useNavigate();
    
    // Close when clicking on the background overlay
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackgroundClick}
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Sign in Required</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-700 mb-4 text-base">
                        You need to be signed in to save favorite parkings. Would you like to sign in or create an account?
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        {/* Updated Sign In button with better contrast */}
                        <button 
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-blue-600 text-black font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Sign In
                        </button>
                        
                        {/* Updated Create Account button with better visibility */}
                        <button 
                            onClick={() => navigate('/sign-up')}
                            className="flex-1 bg-green-600 text-black font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
                
                <div className="text-center text-gray-600 text-sm">
                    <p>Your favorites will be synced across devices when you sign in.</p>
                </div>
            </div>
        </div>
    );
};

const SecLocation = () => {
    const { isLoaded, userLocation, setUserLocation } = useGoogleMaps();
    const { searchData, updateSearchData } = useSearch();
    const { isFavorite, toggleFavorite, isLoggedIn } = useFavorites();
    const navigate = useNavigate();
    const [mapRef, setMapRef] = useState(null);
    const [activeParking, setActiveParking] = useState(null);
    const [parkings, setParkings] = useState([]);
    const [filteredParkings, setFilteredParkings] = useState([]);
    const [hoveredParking, setHoveredParking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showLoginReminder, setShowLoginReminder] = useState(false);
    const [directions, setDirections] = useState(null); // Store directions
    
    // Set today as minimum date for date pickers
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    // Date validation error state
    const [dateError, setDateError] = useState("");
    
    // Search form states - initialize from context with validation
    const [toogleTab] = useState(searchData.toogleTab || "On time");
    const [vehicleType, setVehicleType] = useState(searchData.vehicleType);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    // Initialize date states with validation
    const [startDate, setStartDate] = useState(() => {
        const contextStartDate = searchData.startDate;
        // If date from context exists and is not in the past, use it
        if (contextStartDate && new Date(contextStartDate) >= today) {
            return new Date(contextStartDate);
        }
        // Otherwise use today as default
        return today;
    });
    
    const [endDate, setEndDate] = useState(() => {
        const contextEndDate = searchData.endDate;
        // If date from context exists and is valid, use it
        if (contextEndDate && new Date(contextEndDate) >= (startDate || today)) {
            return new Date(contextEndDate);
        }
        // Otherwise set to day after start date
        const nextDay = new Date(startDate || today);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    });
    
    const [startTime, setStartTime] = useState(searchData.startTime || "14:41");
    const [endTime, setEndTime] = useState(searchData.endTime || "15:41");
    const [autocomplete, setAutocomplete] = useState(null);
    const [address, setAddress] = useState(searchData.address || '');
    const [location, setLocation] = useState(searchData.location || defaultCenter);
    const [isSearching, setIsSearching] = useState(false);
    const [searchRadius, setSearchRadius] = useState(MAX_DISTANCE_KM);

    // Add state for popup visibility
    const [showPopup, setShowPopup] = useState(false);
    const [selectedParking, setSelectedParking] = useState(null);

    // Fix 1: Add a ref to track if this is the first render
    const initialRenderRef = useRef(true);
    
    // Fix 2: Add a ref to track if we should auto-search
    const shouldAutoSearchRef = useRef(false);

    // Add new state for filters
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 50]); // Default price range €0-50
    const [maxDistance, setMaxDistance] = useState(searchRadius); // Use searchRadius as initial value
    const [filtersApplied, setFiltersApplied] = useState(false);
    const filterPanelRef = useRef(null);

    // Replace complex filter states with simple sort state
    const [sortBy, setSortBy] = useState("distance"); // "distance" or "price"
    const [showSortDropdown, setShowSortDropdown] = useState(false);

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

    // Get user's current location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setLocation(userPos);
                    setUserLocation(userPos);
                    
                    // Reverse geocode to get the address
                    if (window.google && isLoaded) {
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: userPos }, (results, status) => {
                            if (status === "OK" && results[0]) {
                                setAddress(results[0].formatted_address);
                                updateSearchData({ 
                                    address: results[0].formatted_address,
                                    location: userPos
                                });
                            }
                        });
                    }
                    
                    // Pan map to user's location and search for parkings
                    if (mapRef) {
                        mapRef.panTo(userPos);
                        mapRef.setZoom(15);
                    }
                    
                    // Automatically search for parkings near user's location
                    handleSearch(userPos);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                    alert("Unable to retrieve your location. Please check your browser settings.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    // Fetch parkings from API
  
useEffect(() => {
    // Only run once on component mount
    const fetchParkings = async () => {
        try {
            setLoading(true);
            console.log("Fetching parkings from API...");
            const response = await axios.get('http://localhost:3001/parkings/parkings');
            console.log("API response:", response.data);
            
            // Transform the API data format to match our needs based on the updated model
            const formattedParkings = response.data.map(parking => ({
                id: parking._id,
                name: parking.name,
                description: parking.description,
                lat: parking.position.lat,
                lng: parking.position.lng,
                price: `€${parking.pricing.hourly}/hr`,
                pricingValue: parking.pricing.hourly,
                dailyRate: parking.pricing.daily,
                weeklyRate: parking.pricing.weekly,
                monthlyRate: parking.pricing.monthly,
                totalSpots: parking.totalSpots,
                availableSpots: parking.availableSpots || 0,
                features: parking.features,
                // Corriger l'accès au propriétaire (Owner au lieu de id_owner)
                owner: parking.Owner ? {
                    id: parking.Owner._id,
                    name: parking.Owner.name || 'Unknown Owner',
                    email: parking.Owner.email
                } : null,
                createdAt: parking.createdAt,
                availabilityPercentage: parking.availableSpots 
                    ? Math.floor((parking.availableSpots / parking.totalSpots) * 100)
                    : 0
            }));
            
            console.log("Formatted parkings:", formattedParkings);
            setParkings(formattedParkings);
            
            // Only auto-search if we have initial context location data
            if (searchData.location && searchData.address && shouldAutoSearchRef.current) {
                setTimeout(() => {
                    handleSearch(searchData.location);
                }, 300);
                shouldAutoSearchRef.current = false;
            } else {
                setFilteredParkings([]);
            }
            
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch parking data");
            console.error("Error fetching parking data:", err);
            setLoading(false);
        }
    };

    fetchParkings();
}, []);
    /*useEffect(() => {
        // Only run once on component mount
        const fetchParkings = async () => {
            try {
                setLoading(true);
                console.log("Fetching parkings from API...");
                const response = await axios.get('http://localhost:3001/api/parkings');
                console.log("API response:", response.data);
                
                // Transform the API data format to match our needs
                const formattedParkings = response.data.map(parking => ({
                    id: parking._id,
                    name: parking.nameP,
                    location: parking.location,
                    lat: parking.position.lat,
                    lng: parking.position.lon,
                    price: `€${parking.pricing}/hr`,
                    pricingValue: parking.pricing,
                    totalSpots: parking.totalSpots,
                    availableSpots: parking.availableSpots,
                    parkingId: parking.parkingId,
                    availabilityPercentage: Math.floor((parking.availableSpots / parking.totalSpots) * 100)
                }));
                
                console.log("Formatted parkings:", formattedParkings);
                setParkings(formattedParkings);
                
                // Only auto-search if we have initial context location data
                if (searchData.location && searchData.address && shouldAutoSearchRef.current) {
                    setTimeout(() => {
                        handleSearch(searchData.location);
                    }, 300);
                    shouldAutoSearchRef.current = false;
                } else {
                    setFilteredParkings([]); // Start with empty list until user searches
                }
                
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch parking data");
                console.error("Error fetching parking data:", err);
                setLoading(false);
            }
        };

        fetchParkings();
    }, []); // Remove dependencies to run only once on mount
    */
    // Fix 4: Add a separate effect to track when to perform an auto-search
    useEffect(() => {
        // Skip first render
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            
            // If we have location data on first render, mark that we should auto-search
            if (searchData.location && searchData.address) {
                shouldAutoSearchRef.current = true;
            }
            return;
        }
        
        // Don't auto-search after first render - let the user trigger searches explicitly
    }, [searchData.location, searchData.address]);

    // Filter parkings by proximity to the selected location
    const filterParkingsByLocation = (targetLat, targetLng, maxDistance = searchRadius) => {
        if (!targetLat || !targetLng) return [];
        
        const results = parkings.filter(parking => {
            const distance = calculateDistance(
                targetLat, targetLng,
                parking.lat, parking.lng
            );
            
            // Add distance to each parking object for display
            parking.distance = distance.toFixed(1) + ' km';
            
            // Return true if the parking is within the max distance
            return distance <= maxDistance;
        }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)); // Sort by distance
        
        return results;
    };

// Find name-based matches (as an alternative search method)
const findNameMatches = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return [];
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return parkings.filter(parking => {
        // Vérifier que parking est défini
        if (!parking) return false;
        
        // Vérifier que name est défini avant d'appeler toLowerCase()
        const nameMatches = parking.name && typeof parking.name === 'string' 
            ? parking.name.toLowerCase().includes(normalizedSearch) 
            : false;
        
        // Vérifier que location est défini avant d'appeler toLowerCase()
        const locationMatches = parking.location && typeof parking.location === 'string'
            ? parking.location.toLowerCase().includes(normalizedSearch)
            : false;
            
        return nameMatches || locationMatches;
    });
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
                
                // Automatically search for parking near this location
                setHasSearched(true);
                handleSearch(newLocation);
            } else {
                console.log('Selected place has no geometry');
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    // Handle address input change (manual typing)
    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        updateSearchData({ address: value });
        
        if (value.trim() === '') {
            setFilteredParkings([]); // Reset to empty list instead of showing all
            setHasSearched(false);
        }
    };

    // Update context when form values change
    useEffect(() => {
        // Only update if values have actually changed
        const contextStartDate = searchData.startDate ? new Date(searchData.startDate).getTime() : null;
        const currentStartDate = startDate ? startDate.getTime() : null;
        
        const contextEndDate = searchData.endDate ? new Date(searchData.endDate).getTime() : null;
        const currentEndDate = endDate ? endDate.getTime() : null;
        
        if (
            searchData.startTime !== startTime ||
            searchData.endTime !== endTime ||
            contextStartDate !== currentStartDate ||
            contextEndDate !== currentEndDate ||
            searchData.toogleTab !== toogleTab
        ) {
            updateSearchData({
                startDate,
                endDate,
                startTime,
                endTime,
                toogleTab
            });
        }
    }, [startDate, endDate, startTime, endTime, toogleTab, updateSearchData]);

    // Handle start date change with validation
    const handleStartDateChange = (date) => {
        if (date) {
            // Always enforce today as minimum date
            if (date < today) {
                setDateError("Start date cannot be in the past");
                return;
            }

            setStartDate(date);
            setDateError("");
            
            // Update context with validated date
            updateSearchData({ startDate: date });

            // If end date is now before start date, adjust it
            if (endDate && date > endDate) {
                // Set end date to day after new start date
                const newEndDate = new Date(date);
                newEndDate.setDate(date.getDate() + 1);
                setEndDate(newEndDate);
                updateSearchData({ endDate: newEndDate });
            }
        }
    };

    // Handle end date change with validation
    const handleEndDateChange = (date) => {
        if (date) {
            // End date must be >= start date
            if (startDate && date < startDate) {
                setDateError("End date must be after start date");
                return;
            }
            
            setEndDate(date);
            setDateError("");
            
            // Update context with validated date
            updateSearchData({ endDate: date });
        }
    };

    // Update time handlers with context updates
    const handleStartTimeChange = (e) => {
        const value = e.target.value;
        setStartTime(value);
        updateSearchData({ startTime: value });
    };

    const handleEndTimeChange = (e) => {
        const value = e.target.value;
        setEndTime(value);
        updateSearchData({ endTime: value });
    };

    // Expanded handle search function with validation
    const handleSearch = (targetLocation) => {
        // Validate dates before proceeding
        if (startDate < today) {
            setDateError("Start date cannot be in the past");
            return;
        }
        
        if (endDate < startDate) {
            setDateError("End date must be after start date");
            return;
        }
        
        // Clear any validation errors
        setDateError("");
        
        setIsSearching(true);
        setHasSearched(true);
        
        // Use provided target location or the current location state
        const searchLocation = targetLocation || location;
        
        // Update all form data in the context
        updateSearchData({
            toogleTab,
            address,
            location: searchLocation,
            vehicleType,
            startDate,
            endDate,
            startTime,
            endTime
        });
        
        // Simulate search delay
        setTimeout(() => {
            setIsSearching(false);
            
            // Filter by proximity
            let locationResults = filterParkingsByLocation(searchLocation.lat, searchLocation.lng);
            
            // If no proximity results, try name-based matching as backup
            if (locationResults.length === 0) {
                locationResults = findNameMatches(address);
            }
            
            // Apply current sort method
            if (locationResults.length > 0) {
                locationResults = sortParkings(locationResults, sortBy);
            }
            
            setFilteredParkings(locationResults.length > 0 ? locationResults : []);
            
            // If we have filtered results, adjust the map to show them
            if (locationResults.length > 0 && mapRef) {
                const bounds = new window.google.maps.LatLngBounds();
                // Add the search location to bounds
                bounds.extend(searchLocation);
                
                // Add all parking locations to bounds
                locationResults.forEach(parking => {
                    bounds.extend({ lat: parking.lat, lng: parking.lng });
                });
                
                mapRef.fitBounds(bounds);
                
                // If there's only one result or bounds are too small, zoom in a bit more
                setTimeout(() => {
                    if (mapRef.getZoom() > 17) {
                        mapRef.setZoom(17);
                    } else if (mapRef.getZoom() < 13) {
                        mapRef.setZoom(13);
                    }
                }, 300);
            } else if (mapRef) {
                // If no parkings found, just center on the searched location
                mapRef.panTo(searchLocation);
                mapRef.setZoom(14);
            }
            
            console.log("Searched for parkings with:", { address, vehicleType, startDate, endDate });
        }, 1000);
    };

    // Set map center based on context location or default
    useEffect(() => {
        if (location && mapRef) {
            mapRef.panTo(location);
            mapRef.setZoom(15);
        }
    }, [mapRef, location]);

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

    // Handle hover over parking item in list
    const handleHover = (parking) => {
        setHoveredParking(parking.id);
        if (mapRef) {
            mapRef.panTo({ lat: parking.lat, lng: parking.lng });
        }
    };

    // Handle marker click to show info window
    const handleMarkerClick = (parking) => {
        setActiveParking(parking);
        if (userLocation) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userLocation,
                    destination: { lat: parking.lat, lng: parking.lng },
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

    // Get marker icon based on parking availability and price
    const getParkingMarkerIcon = (parking) => {
        // Extract just the numeric part from the price string for the marker
        const priceForMarker = parking.price.replace('/hr', '');
        
        // If parking is almost full (less than 20% spots available), use orange icon
        const isLimited = parking.availabilityPercentage < 20;
        
        return createPriceMarker(priceForMarker, isLimited);
    };

    // Vehicle types for dropdown
    const vehicleTypes = [
        { id: "2wheels", name: "2 wheels", description: "Motorcycle, scooter, …" },
        { id: "little", name: "Little", description: "Clio, 208, Twingo, Polo, Corsa, …" },
        { id: "average", name: "AVERAGE", description: "Megane, 308, Scenic, C3 Picasso, Kangoo, Juke, …" },
        { id: "big", name: "Big", description: "C4 Picasso, 508, BMW 3 Series, X-Trail, RAV4, Tiguan, …" },
        { id: "high", name: "High", description: "Mercedes Vito, Renault Trafic, …" },
        { id: "very-high", name: "Very high", description: "Mercedes Sprinter, Renault Master, …" },
    ];

    // Handle search radius change
    const handleRadiusChange = (value) => {
        setSearchRadius(value);
        setMaxDistance(value); // Update max distance filter to match radius
        
        if (location && hasSearched) {
            let locationResults = filterParkingsByLocation(location.lat, location.lng, value);
            
            // Apply current sort
            locationResults = sortParkings(locationResults, sortBy);
            
            setFilteredParkings(locationResults);
            
            // Adjust map bounds
            if (mapRef && locationResults.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(location);
                locationResults.forEach(parking => {
                    bounds.extend({ lat: parking.lat, lng: parking.lng });
                });
                mapRef.fitBounds(bounds);
                
                // Adjust zoom level if needed
                setTimeout(() => {
                    if (mapRef.getZoom() > 17) {
                        mapRef.setZoom(17);
                    } else if (mapRef.getZoom() < 13) {
                        mapRef.setZoom(13);
                    }
                }, 300);
            }
        }
    };

    // Function to open popup with parking details
    const handleShowDetails = (parking, e) => {
        if (e) {
            e.stopPropagation(); // Prevent triggering parent click events
        }
        setSelectedParking(parking);
        setShowPopup(true);
    };
    
    // Function to close popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    // New sort function for parkings
    const sortParkings = (parkings, sortMethod) => {
        if (sortMethod === "distance") {
            // Sort by distance (ascending)
            return [...parkings].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        } else if (sortMethod === "price") {
            // Sort by price (ascending)
            return [...parkings].sort((a, b) => {
                const priceA = parseFloat(a.price.replace('€', '').replace('/hr', ''));
                const priceB = parseFloat(b.price.replace('€', '').replace('/hr', ''));
                return priceA - priceB;
            });
        }
        return parkings; // Default case
    };
    
    // Handle sort selection
    const handleSort = (method) => {
        setSortBy(method);
        
        if (filteredParkings.length > 0) {
            const sortedParkings = sortParkings(filteredParkings, method);
            setFilteredParkings(sortedParkings);
        }
    };

    // Handle favorite toggle
    const handleFavoriteToggle = async (parkingId, e) => {
        if (e) {
            e.stopPropagation(); // Prevent triggering parent click events
        }
        
        const result = await toggleFavorite(parkingId);
        
        if (!result.success && result.requiresAuth) {
            setShowLoginReminder(true);
        } else if (result.success && result.usingFallback) {
            // If we're using localStorage fallback, show a message
            console.log("Using local storage for favorites. Server API not available.");
        } else if (!result.success) {
            console.error("Failed to toggle favorite:", result.details || result.error);
        }
    };

    if (!isLoaded) return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Google Maps...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Show login reminder popup if needed */}
            {showLoginReminder && (
                <LoginReminderPopup onClose={() => setShowLoginReminder(false)} />
            )}
            
            {/* Show popup if visible */}
            {showPopup && selectedParking && (
                <ParkingDetailsPopup
                    parking={selectedParking}
                    onClose={handleClosePopup}
                />
            )}
            
            {/* Horizontal Search Form */}
            <div className="bg-gray-100 py-3 mb-4 rounded-lg shadow-md">
                {/* Display validation error message if present */}
                {dateError && (
                    <div className="mx-4 mb-3 text-red-500 bg-red-100 border border-red-400 rounded px-3 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {dateError}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end px-4">
                    {/* Destination Input */}
                    <div className="md:col-span-3">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">Destination</label>
                        <div className="flex items-center gap-2 bg-white px-3 rounded-lg border transition-all hover:border-blue-500 h-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
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
                                        onChange={handleAddressChange}
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
                    <div className="md:col-span-2">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">Start Date & Time</label>
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 flex-grow h-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                                <DatePicker
                                    className='bg-transparent text-gray-800 text-xs outline-none w-full h-8'
                                    placeholderText="Start date"
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="MMM d"
                                    minDate={today} // Set minimum date to today
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 w-[80px] h-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                <Form.Control
                                    type="time"
                                    className='bg-transparent text-gray-800 text-xs border-none shadow-none h-8 px-0 w-full'
                                    value={startTime}
                                    onChange={handleStartTimeChange}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* End Date & Time */}
                    <div className="md:col-span-2">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">End Date & Time</label>
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 flex-grow h-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                                <DatePicker
                                    className='bg-transparent text-gray-800 text-xs outline-none w-full h-8'
                                    placeholderText="End date"
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="MMM d"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white px-2 rounded-lg border transition-all hover:border-blue-500 w-[80px] h-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                <Form.Control
                                    type="time"
                                    className='bg-transparent text-gray-800 text-xs border-none shadow-none h-8 px-0 w-full'
                                    value={endTime}
                                    onChange={handleEndTimeChange}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Sort By Dropdown (UPDATED) */}
                    <div className="md:col-span-2 relative">
                        <label className="text-gray-700 text-xs mb-1 block font-medium">Tri par</label>
                        <div 
                            className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border cursor-pointer transition-all hover:border-blue-500 h-10"
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                        >
                            <div className="text-gray-800 text-xs truncate">{sortBy === "distance" ? "Distance" : sortBy === "price" ? "Prix" : "Favorite"}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </div>
                        
                        {showSortDropdown && (
                            <div 
                                className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-300 shadow-lg z-40 max-h-[240px] overflow-y-auto"
                            >
                                <div 
                                    onClick={() => handleSort("distance")}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${sortBy === "distance" ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                                >
                                    <div className="font-medium text-xs">Distance</div>
                                </div>
                                <div 
                                    onClick={() => handleSort("price")}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${sortBy === "price" ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                                >
                                    <div className="font-medium text-xs">Prix</div>
                                </div>
                                <div 
                                    onClick={() => handleSort("favorite")}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${sortBy === "favorite" ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                                >
                                    <div className="font-medium text-xs">Favorite</div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Search Button */}
                    <div className="md:col-span-1">
                        <button 
                            onClick={() => handleSearch()}
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
                
                {/* Search radius slider only (remove sort buttons from here) */}
                {hasSearched && (
                    <div className="mt-3 px-4 flex items-center">
                        <div className="flex items-center">
                            <div className="text-sm text-gray-600 mr-2">Search radius:</div>
                            <input 
                                type="range" 
                                min="1" 
                                max="30" 
                                value={searchRadius} 
                                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                                className="w-40 mx-2"
                            />
                            <div className="text-sm font-medium text-blue-600">{searchRadius} km</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Map and Parking List */}
            <div className="flex flex-1 bg-gray-100 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-white p-4 overflow-y-auto shadow-lg rounded-l-lg">
                    <h2 className="text-xl font-bold mb-4">🚗 Available Parkings</h2>
                    
                    {loading ? (
                        <div className="flex justify-center items-center p-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 p-4 text-center">{error}</div>
                    ) : hasSearched && filteredParkings.length === 0 ? (
                        <div className="text-gray-500 p-6 text-center bg-gray-50 rounded-lg">
                            <div className="mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="mx-auto text-gray-400" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium">No parking spots found</h3>
                            <p className="mt-2">
                                We couldn't find any parking spots near "{address}". 
                                <br />Try increasing the search radius or trying a different location.
                            </p>
                            <div className="mt-4 flex gap-2 justify-center">
                                <button onClick={() => {
                                    handleRadiusChange(Math.min(searchRadius + 5, 30));
                                }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                                    Increase radius
                                </button>
                                <button onClick={() => {
                                    setAddress('');
                                    setFilteredParkings(parkings);
                                    updateSearchData({ address: '' });
                                    setHasSearched(false);
                                }} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">
                                    Show all parkings
                                </button>
                            </div>
                        </div>
                    ) : !hasSearched ? (
                        <div className="text-gray-500 p-6 text-center bg-gray-50 rounded-lg">
                            <div className="mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="mx-auto text-gray-400" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium">No parking spots found</h3>
                            <p className="mt-2">
                                We couldn't find any parking spots near "{address}". 
                                <br />Try increasing the search radius or trying a different location.
                            </p>
                            <div className="mt-4 flex gap-2 justify-center">
                                <button onClick={() => {
                                    handleRadiusChange(Math.min(searchRadius + 5, 30));
                                }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                                    Increase radius
                                </button>
                                <button onClick={() => {
                                    setAddress('');
                                    setFilteredParkings(parkings);
                                    updateSearchData({ address: '' });
                                    setHasSearched(false);
                                }} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">
                                    Show all parkings
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredParkings.map(parking => (
                                <div 
                                    key={parking.id} 
                                    className={`p-4 rounded-lg shadow-md transition-all cursor-pointer relative ${
                                        hoveredParking === parking.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
                                    }`}
                                    onMouseEnter={() => handleHover(parking)}
                                    onMouseLeave={() => setHoveredParking(null)}
                                    onClick={() => handleMarkerClick(parking)}
                                >
                                    {/* Favorite Button - Updated Here */}
                                    <button 
                                        className="absolute top-3 right-3 z-10"
                                        onClick={(e) => handleFavoriteToggle(parking.id, e)}
                                    >
                                        {isFavorite(parking.id) ? (
                                            // Filled heart for favorites
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            // Outlined heart for non-favorites (updated)
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">{parking.name}</h3>
                                            <p className="text-sm text-gray-600">{parking.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-blue-600">{parking.price}</p>
                                            <p className="text-xs text-gray-500">{parking.distance}  away</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        <p>Total spots: {parking.totalSpots}</p>
                                        <p>Available spots: {parking.availableSpots}</p>
                                    </div>
                                    
                                    {/* Add Details button */}
                                    <div className="mt-3 flex justify-between">
                                        <button 
                                            className="bg-blue-600 text-blue py-1 px-3 rounded-md hover:bg-blue-700 transition text-sm"
                                            onClick={(e) => handleShowDetails(parking, e)}
                                        >
                                            View Details
                                        </button>
                                        
                                        <button 
                                            className="bg-green-600 text-blue py-1 px-3 rounded-md hover:bg-green-700 transition text-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/parkings/${parking.id}`);
                                            }}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={location}
                        zoom={15}
                        onLoad={map => setMapRef(map)}
                    >
                        {filteredParkings.map(parking => (
                            <Marker 
                                key={parking.id} 
                                position={{ lat: parking.lat, lng: parking.lng }}
                                onClick={() => handleMarkerClick(parking)}
                                icon={getParkingMarkerIcon(parking)}
                            />
                        ))}
                        {activeParking && (
                            <InfoWindow
                                position={{ lat: activeParking.lat, lng: activeParking.lng }}
                                onCloseClick={() => setActiveParking(null)}
                            >
                                <div className="relative">
                                    {/* Favorite Button in InfoWindow - Updated Here */}
                                    <button 
                                        className="absolute top-0 right-0"
                                        onClick={(e) => handleFavoriteToggle(activeParking.id, e)}
                                    >
                                        {isFavorite(activeParking.id) ? (
                                            // Filled heart for favorites
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            // Outlined heart for non-favorites (updated)
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    
                                    <h3 className="text-lg font-semibold pr-6">{activeParking.name}</h3>
                                    <p className="text-sm text-gray-600">{activeParking.location}</p>
                                    <p className="text-sm font-medium text-blue-600">{activeParking.price}</p>
                                    <p className="text-xs text-gray-500">{activeParking.distance} km away</p>
                                    <p className="text-xs text-gray-500">Total spots: {activeParking.totalSpots}</p>
                                    <p className="text-xs text-gray-500">Available spots: {activeParking.availableSpots}</p>
                                    <button 
                                        className="mt-2 bg-blue-600 text-white py-1 px-2 rounded-sm text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowDetails(activeParking);
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
                        {userLocation && (
                            <Marker 
                                position={userLocation}
                                icon={userLocationIcon}
                            />
                        )}
                        {directions && (
                            <DirectionsRenderer
                                directions={directions}
                            />
                        )}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
};

export default SecLocation;
