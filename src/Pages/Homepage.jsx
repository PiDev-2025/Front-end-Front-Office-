import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { CardCar } from '../Components/Card/Card'
import HowItWorks from '../Components/Pages/HowItWorks'
import GridInfo from '../Components/Pages/GridInfo'
import { NavLink, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import { useSearch } from '../context/SearchContext';
import LoadingPopup from '../Components/LoadingPopup';

const Homepage = () => {
    const navigate = useNavigate();
    const { searchData, updateSearchData } = useSearch();
    const { isLoaded } = useGoogleMaps();
    
    // Loading popup state
    const [isSearching, setIsSearching] = useState(false);

    // Get values from context or use defaults
    const [toogleTab, settoogleTab] = useState(searchData.toogleTab)
    const [vehicleType, setVehicleType] = useState(searchData.vehicleType)
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const [focusedVehicleIndex, setFocusedVehicleIndex] = useState(-1);
    const dropdownRef = useRef(null);
    
    // Google Maps Autocomplete states
    const [autocomplete, setAutocomplete] = useState(null);
    const [address, setAddress] = useState(searchData.address || '');
    const [location, setLocation] = useState(searchData.location);

    // Date and time states
    const [startDate, setStartDate] = useState(searchData.startDate);
    const [endDate, setEndDate] = useState(searchData.endDate);
    const [startTime, setStartTime] = useState(searchData.startTime || "14:41");
    const [endTime, setEndTime] = useState(searchData.endTime || "15:41");

    const [errors, setErrors] = useState({});

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};
        const now = new Date();
        if (!address) newErrors.address = "Address is required";
        if (!vehicleType) newErrors.vehicleType = "Vehicle type is required";
        if (!startDate) newErrors.startDate = "Start date is required";
        if (!endDate) newErrors.endDate = "End date is required";
        if (!startTime) newErrors.startTime = "Start time is required";
        if (!endTime) newErrors.endTime = "End time is required";
        if (startDate && startDate < now) newErrors.startDate = "Start date cannot be in the past";
        if (endDate && endDate < now) newErrors.endDate = "End date cannot be in the past";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            } else {
                console.log('Selected place has no geometry');
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };
    
    // Handle search form submission
    const handleSearch = () => {
        if (!validateForm()) return;

        // Save all form data to the context
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
        
        // Show loading popup
        setIsSearching(true);
        
        // Navigate to the booking page after delay
        setTimeout(() => {
            setIsSearching(false);
            navigate('/booking');
        }, 2000); // 2 seconds delay

    };

    const dataProfile = [
        {
            img: "./../images/Tunis.png",
            name: "5 parking lots available ",
            Detail: ["Centre Vill", "..", "...", "...", "..."]
        },
        {
            img: "./../images/Tunis.png",
            name: "5 parking lots available ",
            Detail: ["Centre Vill", "..", "...", "...", "..."]
        },
        {
            img: "./../images/Tunis.png",
            name: "5 parking lots available ",
            Detail: ["Centre Vill", "..", "...", "...", "..."]
        },
        {
            img: "./../images/Tunis.png",
            name: "5 parking lots available ",
            Detail: ["Centre Vill", "..", "...", "...", "..."]
        }
    ]

    const dataCars = [
        {
            img: "./../images/car (4).png",
            name: "Luxury Model Y",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (5).png",
            name: "Luxury Model Z",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (6).png",
            name: "Luxury Model M",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (1).png",
            name: "Luxury Model Z",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (2).png",
            name: "Luxury Model L",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (3).png",
            name: "Luxury Model S",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
    ]

    const vehicleTypes = [
        { id: "2wheels", name: "2 wheels", description: "Motorcycle, scooter, …" },
        { id: "little", name: "Little", description: "Clio, 208, Twingo, Polo, Corsa, …" },
        { id: "average", name: "AVERAGE", description: "Megane, 308, Scenic, C3 Picasso, Kangoo, Juke, …" },
        { id: "big", name: "Big", description: "C4 Picasso, 508, BMW 3 Series, X-Trail, RAV4, Tiguan, …" },
        { id: "high", name: "High", description: "Mercedes Vito, Renault Trafic, …" },
        { id: "very-high", name: "Very high", description: "Mercedes Sprinter, Renault Master, …" },
    ];
    
    // Function to handle vehicle selection and close dropdown
    const handleVehicleSelect = (id) => {
        setVehicleType(id);
        setShowVehicleDropdown(false);
        setFocusedVehicleIndex(-1);
    };

    // Get selected vehicle name
    const getSelectedVehicleName = () => {
        const selected = vehicleTypes.find(type => type.id === vehicleType);
        return selected ? selected.name : "Select vehicle type";
    };
    
    // Handle keyboard navigation in dropdown
    const handleVehicleKeyDown = (e) => {
        if (!showVehicleDropdown) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                setShowVehicleDropdown(true);
                setFocusedVehicleIndex(0);
                e.preventDefault();
            }
            return;
        }
        
        switch (e.key) {
            case "Escape":
                setShowVehicleDropdown(false);
                setFocusedVehicleIndex(-1);
                break;
            case "ArrowDown":
                setFocusedVehicleIndex(prevIndex => 
                    prevIndex < vehicleTypes.length - 1 ? prevIndex + 1 : 0
                );
                e.preventDefault();
                break;
            case "ArrowUp":
                setFocusedVehicleIndex(prevIndex => 
                    prevIndex > 0 ? prevIndex - 1 : vehicleTypes.length - 1
                );
                e.preventDefault();
                break;
            case "Enter":
            case " ":
                if (focusedVehicleIndex >= 0) {
                    handleVehicleSelect(vehicleTypes[focusedVehicleIndex].id);
                }
                e.preventDefault();
                break;
            default:
                break;
        }
    };
    
    // Scroll focused item into view
    useEffect(() => {
        if (dropdownRef.current && focusedVehicleIndex >= 0) {
            const focusedItem = dropdownRef.current.children[focusedVehicleIndex];
            if (focusedItem) {
                focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [focusedVehicleIndex]);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                showVehicleDropdown && !event.target.closest('.vehicle-dropdown-toggle')) {
                setShowVehicleDropdown(false);
                setFocusedVehicleIndex(-1);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showVehicleDropdown]);

    return (
        <Fragment>
            {/* Enhanced Loading Popup */}
            <LoadingPopup 
                isVisible={isSearching} 
                message="We are looking for a place for you" 
            />

            {/* start:hero */}
            <section className='relative overflow-hidden min-h-[calc(100vh_-_88px)] lg:min-h-[calc(100vh_-_98px)] bg-[#010101] flex flex-wrap pb-0'>
                <img src="./../images/img (1).png" className='absolute left-0 top-0 w-full h-full object-cover object-top hidden md:block' alt="" />
                <Container className='relative z-[2] w-full flex flex-col h-full'>
                    <Row className='flex-grow items-center'>
                        <Col md={5} lg={6} className="mt-8 md:mt-0 mb-6 md:mb-0">
                            <p className='text__18 text-Mgreen mb-2'>CAR PARKING</p>
                            <h1 className='font-bold text__48 text-Mwhite mb-4'>Find Convenient and Affordable Parking</h1>
                            <p className='text__18 text-[#A3A3A3] mb-4 md:mb-0'>Reserve your parking spot by the hour, day, or month with ease. Book in advance or rent your space and enjoy seamless parking in private residential, hotel, or business lots.</p>
                            <p className='text__18 text-[#A3A3A3] hidden md:block'>Benefit from competitive rates in city centers, train stations, and airports across Tunisia. Join our community and experience stress-free parking with thousands of satisfied members.</p>
                        </Col>
                        
                        <Col md={7} lg={6} className="bg-[#00000080] backdrop-blur-sm rounded-lg p-4 shadow-lg">
                            <div className="flex items-center text-center mb-4 border-b border-[#333]">
                                <div onClick={() => settoogleTab("On time")} className={"py-3 cursor-pointer md:min-w-[140px] text__16 text-Mwhite w-full md:w-auto " + (toogleTab == "On time" ? "border-b-2 border-solid border-Mgreen -mb-px" : "opacity-50")}>On time</div>
                                <div onClick={() => settoogleTab("Monthly")} className={"py-3 cursor-pointer md:min-w-[140px] text__16 text-Mwhite w-full md:w-auto " + (toogleTab == "Monthly" ? "border-b-2 border-solid border-Mgreen -mb-px" : "opacity-50")}>Monthly</div>
                            </div>
                            
                            {
                                toogleTab == "On time" ? 
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                                        <div className="flex flex-col w-full md:w-[50%]">
                                            <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] w-full transition-all hover:bg-[#ffffff26]`}>
                                                <img src="./../images/icon.svg" alt="" />
                                                {isLoaded ? (
                                                    <Autocomplete
                                                        onLoad={onLoadAutocomplete}
                                                        onPlaceChanged={onPlaceChanged}
                                                    >
                                                        <Form.Control 
                                                            type="text" 
                                                            className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mwhite placeholder-[#A3A3A3] h-[54px] px-0 w-full' 
                                                            placeholder="Enter your destination" 
                                                            value={address}
                                                            onChange={(e) => {
                                                                setAddress(e.target.value);
                                                                setErrors(prev => ({ ...prev, address: '' }));
                                                            }}
                                                        />
                                                    </Autocomplete>
                                                ) : (
                                                    <Form.Control 
                                                        type="text" 
                                                        className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mwhite placeholder-[#A3A3A3] h-[54px] px-0 w-full' 
                                                        placeholder="Loading Google Maps..." 
                                                        disabled
                                                    />
                                                )}
                                            </div>
                                            {errors.address && <div className="text-white text-xs mt-1">{errors.address}</div>}
                                        </div>
                                        
                                        <div className="relative w-full md:w-[50%]">
                                            <div 
                                                className={`vehicle-dropdown-toggle flex items-center justify-between bg-[#ffffff1a] px-3 py-3 h-[54px] rounded-[16px] cursor-pointer transition-all hover:bg-[#ffffff26]`}
                                                onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                                                onKeyDown={handleVehicleKeyDown}
                                                tabIndex={0}
                                                role="combobox"
                                                aria-expanded={showVehicleDropdown}
                                                aria-haspopup="listbox"
                                                aria-labelledby="vehicle-type-label"
                                            >
                                                <div className="text-Mwhite text__14">{getSelectedVehicleName()}</div>
                                                <div className="flex items-center">
                                                    <button 
                                                        className="p-1 mr-1 text-white opacity-60 hover:opacity-100 focus:opacity-100" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!showVehicleDropdown) {
                                                                setShowVehicleDropdown(true);
                                                                setFocusedVehicleIndex(0);
                                                            } else {
                                                                setFocusedVehicleIndex(prev => 
                                                                    prev < vehicleTypes.length - 1 ? prev + 1 : 0
                                                                );
                                                            }
                                                        }}
                                                        aria-label="Navigate vehicle types"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {showVehicleDropdown && (
                                                <ul 
                                                    className="absolute z-10 w-full bg-[#333333] rounded-[16px] mt-1 max-h-60 overflow-auto"
                                                    ref={dropdownRef}
                                                    role="listbox"
                                                    aria-labelledby="vehicle-type-label"
                                                >
                                                    {vehicleTypes.map((type, index) => (
                                                        <li 
                                                            key={type.id}
                                                            className={`px-3 py-2 cursor-pointer ${focusedVehicleIndex === index ? 'bg-[#555555]' : ''}`}
                                                            onClick={() => handleVehicleSelect(type.id)}
                                                            onMouseEnter={() => setFocusedVehicleIndex(index)}
                                                            role="option"
                                                            aria-selected={focusedVehicleIndex === index}
                                                        >
                                                            <div className="text-Mwhite text__14">{type.name}</div>
                                                            <div className="text-[#A3A3A3] text__12">{type.description}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {errors.vehicleType && <div className="text-white text-xs mt-1">{errors.vehicleType}</div>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                                        <div className="w-full md:w-1/2">
                                            <label className="text-Mwhite text__14 block mb-1">Beginning</label>
                                            <div className="flex w-full gap-2">
                                                <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] flex-grow transition-all hover:bg-[#ffffff26]`}>
                                                    <img src="./../images/icon-1.svg" alt="" />
                                                    <DatePicker
                                                        className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none w-full'
                                                        placeholderText="Sun March 2"
                                                        selected={startDate}
                                                        onChange={(date) => {
                                                            setStartDate(date);
                                                            setErrors(prev => ({ ...prev, startDate: '' }));
                                                        }}
                                                        minDate={new Date()}
                                                    />
                                                </div>
                                                {errors.startDate && <div className="text-white text-xs mt-1">{errors.startDate}</div>}
                                                <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] w-[120px] transition-all hover:bg-[#ffffff26]`}>
                                                    <img src="./../images/icon-2.svg" alt="" />
                                                    <Form.Control
                                                        type="time"
                                                        className='bg-transparent text-Mwhite text__14 font-normal outline-none border-none shadow-none'
                                                        value={startTime}
                                                        onChange={(e) => {
                                                            setStartTime(e.target.value);
                                                            setErrors(prev => ({ ...prev, startTime: '' }));
                                                        }}
                                                    />
                                                </div>
                                                {errors.startTime && <div className="text-white text-xs mt-1">{errors.startTime}</div>}
                                            </div>
                                        </div>
                                        
                                        <div className="w-full md:w-1/2">
                                            <label className="text-Mwhite text__14 block mb-1">END</label>
                                            <div className="flex w-full gap-2">
                                                <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] flex-grow transition-all hover:bg-[#ffffff26]`}>
                                                    <img src="./../images/icon-1.svg" alt="" />
                                                    <DatePicker
                                                        className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none w-full'
                                                        placeholderText="end date"
                                                        selected={endDate}
                                                        onChange={(date) => {
                                                            setEndDate(date);
                                                            setErrors(prev => ({ ...prev, endDate: '' }));
                                                        }}
                                                        selectsEnd
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        minDate={startDate || new Date()}
                                                    />
                                                </div>
                                                {errors.endDate && <div className="text-white text-xs mt-1">{errors.endDate}</div>}
                                                <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] w-[120px] transition-all hover:bg-[#ffffff26]`}>
                                                    <img src="./../images/icon-2.svg" alt="" />
                                                    <Form.Control
                                                        type="time"
                                                        className='bg-transparent text-Mwhite text__14 font-normal outline-none border-none shadow-none'
                                                        value={endTime}
                                                        onChange={(e) => {
                                                            setEndTime(e.target.value);
                                                            setErrors(prev => ({ ...prev, endTime: '' }));
                                                        }}
                                                    />
                                                </div>
                                                {errors.endTime && <div className="text-white text-xs mt-1">{errors.endTime}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className={`font-medium text__16 text-Mwhite rounded-[24px] border-Mblue bg-Mblue hover:bg-Mblue/90 active:bg-Mblue/80 transition-all btnClass w-full md:w-auto px-8 ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {isSearching ? (
                                            <>
                                                <span className="inline-block mr-2 animate-spin">⟳</span>
                                                Searching...
                                            </>
                                        ) : (
                                            'Search'
                                        )}
                                    </button>
                                </div> 
                                : 
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                                        <div className="flex flex-col w-full md:w-[50%]">
                                            <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] w-full transition-all hover:bg-[#ffffff26]`}>
                                                <img src="./../images/icon.svg" alt="" />
                                                {isLoaded ? (
                                                    <Autocomplete
                                                        onLoad={onLoadAutocomplete}
                                                        onPlaceChanged={onPlaceChanged}
                                                    >
                                                        <Form.Control 
                                                            type="text" 
                                                            className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mwhite placeholder-[#A3A3A3] h-[54px] px-0 w-full' 
                                                            placeholder="Enter your destination" 
                                                            value={address}
                                                            onChange={(e) => {
                                                                setAddress(e.target.value);
                                                                setErrors(prev => ({ ...prev, address: '' }));
                                                            }}
                                                        />
                                                    </Autocomplete>
                                                ) : (
                                                    <Form.Control 
                                                        type="text" 
                                                        className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mwhite placeholder-[#A3A3A3] h-[54px] px-0 w-full' 
                                                        placeholder="Loading Google Maps..." 
                                                        disabled
                                                    />
                                                )}
                                            </div>
                                            {errors.address && <div className="text-white text-xs mt-1">{errors.address}</div>}
                                        </div>
                                        
                                        <div className="relative w-full md:w-[50%]">
                                            <div 
                                                className={`vehicle-dropdown-toggle flex items-center justify-between bg-[#ffffff1a] px-3 py-3 h-[54px] rounded-[16px] cursor-pointer transition-all hover:bg-[#ffffff26]`}
                                                onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                                                onKeyDown={handleVehicleKeyDown}
                                                tabIndex={0}
                                                role="combobox"
                                                aria-expanded={showVehicleDropdown}
                                                aria-haspopup="listbox"
                                                aria-labelledby="vehicle-type-label"
                                            >
                                                <div className="text-Mwhite text__14">{getSelectedVehicleName()}</div>
                                                <div className="flex items-center">
                                                    <button 
                                                        className="p-1 mr-1 text-white opacity-60 hover:opacity-100 focus:opacity-100" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!showVehicleDropdown) {
                                                                setShowVehicleDropdown(true);
                                                                setFocusedVehicleIndex(0);
                                                            } else {
                                                                setFocusedVehicleIndex(prev => 
                                                                    prev < vehicleTypes.length - 1 ? prev + 1 : 0
                                                                );
                                                            }
                                                        }}
                                                        aria-label="Navigate vehicle types"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {showVehicleDropdown && (
                                                <ul 
                                                    className="absolute z-10 w-full bg-[#333333] rounded-[16px] mt-1 max-h-60 overflow-auto"
                                                    ref={dropdownRef}
                                                    role="listbox"
                                                    aria-labelledby="vehicle-type-label"
                                                >
                                                    {vehicleTypes.map((type, index) => (
                                                        <li 
                                                            key={type.id}
                                                            className={`px-3 py-2 cursor-pointer ${focusedVehicleIndex === index ? 'bg-[#555555]' : ''}`}
                                                            onClick={() => handleVehicleSelect(type.id)}
                                                            onMouseEnter={() => setFocusedVehicleIndex(index)}
                                                            role="option"
                                                            aria-selected={focusedVehicleIndex === index}
                                                        >
                                                            <div className="text-Mwhite text__14">{type.name}</div>
                                                            <div className="text-[#A3A3A3] text__12">{type.description}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {errors.vehicleType && <div className="text-white text-xs mt-1">{errors.vehicleType}</div>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                                        <div className="w-full md:w-1/2">
                                            <label className="text-Mwhite text__14 block mb-1">Beginning</label>
                                            <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] w-full transition-all hover:bg-[#ffffff26]`}>
                                                <img src="./../images/icon-1.svg" alt="" />
                                                <DatePicker
                                                    className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none w-full'
                                                    placeholderText="Select start date"
                                                    selected={startDate}
                                                    onChange={(date) => {
                                                        setStartDate(date);
                                                        setErrors(prev => ({ ...prev, startDate: '' }));
                                                    }}
                                                    minDate={new Date()}
                                                />
                                            </div>
                                            {errors.startDate && <div className="text-white text-xs mt-1">{errors.startDate}</div>}
                                        </div>
                                        
                                        <div className="w-full md:w-1/2">
                                            <label className="text-Mwhite text__14 block mb-1">END</label>
                                            <div className={`flex items-center gap-2 bg-[#ffffff1a] px-3 rounded-[16px] w-full transition-all hover:bg-[#ffffff26]`}>
                                                <img src="./../images/icon-1.svg" alt="" />
                                                <DatePicker
                                                    className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none w-full'
                                                    placeholderText="Select end date"
                                                    selected={endDate}
                                                    onChange={(date) => {
                                                        setEndDate(date);
                                                        setErrors(prev => ({ ...prev, endDate: '' }));
                                                    }}
                                                    minDate={startDate || new Date()}
                                                />
                                            </div>
                                            {errors.endDate && <div className="text-white text-xs mt-1">{errors.endDate}</div>}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className={`font-medium text__16 text-Mwhite rounded-[24px] border-Mblue bg-Mblue hover:bg-Mblue/90 active:bg-Mblue/80 transition-all btnClass w-full md:w-auto px-8 ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {isSearching ? (
                                            <>
                                                <span className="inline-block mr-2 animate-spin">⟳</span>
                                                Searching...
                                            </>
                                        ) : (
                                            'Search'
                                        )}
                                    </button>
                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            </section>
            {/* end:hero */}

            <HowItWorks />

            {/* 
            <section>
                <Container>
                    <div className="text-center mb-10">
                        <h2 className='font-bold text__48'>Our Collections Car</h2>
                    </div>

                    <Row className='gap-y-4'>
                        {
                            dataCars.map((obj) => {
                                return <Col sm={6} lg={4}>
                                    <CardCar data={obj} />
                                </Col>
                            })
                        }

                    </Row>

                </Container>
            </section>


            <section>
                <Container>
                    <Row>
                        <Col md={6} className='md:!order-1 order-2 my-auto'>
                            <p className='text__18 mb-2'>GREENER WORLD</p>
                            <h1 className='font-bold text__48 mb-10'>The more you drive the more you contribute to a greener world</h1>
                            <p className='text__18 text-[#525252] mb-6'>We have partnered with OneTreePlanted to <br /> strengthen our commitment to cleaner air. Earn <br className='hidden lg:block' /> EcoPoints for every rental - 100 EcoPoints earned = <br className='hidden lg:block' /> 1 tree planted on your behalf.</p>
                            <NavLink to="/booking" className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass">Book a Car</NavLink>
                        </Col>
                        <Col md={6} className='order-1 md:!order-2 relative'>
                            <img src="./../images/fgfgfd.png" className='md:max-w-[34rem] lg:max-w-[58rem]  md:-translate-x-[7rem] lg:-translate-x-[12rem] lg:translate-y-[3rem]' alt="" />
                        </Col>
                    </Row>
                </Container>
            </section>


          <section className='pt-0'>
                <Container>
                    <p className='text__18 mb-2'>CARENT</p>
                    <h1 className='font-bold text__48 mb-10'>Rent an electric vehicle <br className='md:block hidden' /> with Carent today</h1>
                    <Row className='mb-8 lg:mb-0'>
                        <Col md={7} className='my-auto relative'>
                            <img src="./../images/sdgsdgd.png" className='xl:max-w-[56rem] xl:-translate-x-[7rem]' alt="" />
                        </Col>
                        <Col md={5} className='my-auto'>
                            <p className='text__18 text-[#525252] mb-6'>The best prices and customer experience along your business or leisure journey. UFODRIVE covers airport rental locations (like our Frankfurt Airport EV Rental Centre) as well as premium city locations (like our Paris EV Rental Hub).</p>
                            <NavLink to="/booking" className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass">Book a Car</NavLink>
                        </Col>
                    </Row>

                    <GridInfo />
                </Container>
            </section>

*/}

            <section>
                <Container>
                    <div className="text-center mb-8">
                        <p className='text__18 mb-2'>Find parking near </p>
                        <h3 className='font-bold text__48'>your destination<br /> </h3>
                    </div>

                    <Row className='gap-y-4'>
                        {
                            dataProfile.map((obj) => {
                                return <Col className='col-6' lg={3}>
                                    <div className="w-full border border-solid border-[#E5E5E5] p-2 sm:p-4">
                                        <div className="w-full h-[150px] sm:h-[250px] bg-[#FAFAFA] mb-3">
                                            <img src={obj.img} className='w-full h-full object-cover' alt="" />
                                        </div>

                                        <div className="text-center">
                                            <h5 className='font-bold text__20 mb-2'>{obj.name}</h5>
                                            <div className="uppercase text__16 text-[#525252]">
                                                {Array.isArray(obj.Detail)
                                                    ? obj.Detail.map((city, index) => (
                                                        <p key={index}>{city}</p>
                                                    ))
                                                    : <p>{obj.Detail}</p> /* If obj.job is a string, display it directly */}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            })
                        }

                    </Row>


                </Container>
            </section>

            <section>
                <Container>
                    <p className='text__18 mb-2'>SMART PARKING, HASSLE-FREE</p>
                    <h3 className='font-bold text__48 mb-8'>The Future of Parking<br className='hidden sm:block' /> Is Here</h3>
                    <GridInfo />
                </Container>
            </section>

            <section className='bg-Mgreen pb-0 relative overflow-hidden'>
                <img src="./../images/patern.svg" className='absolute left-0 top-0 w-full h-full object-cover' alt="" />
                <Container className='text-center relative z-2'>
                    <p className='text__18 mb-2'>NEWSLETTER</p>
                    <h2 className='font-bold text__48 mb-8'>Stay up to date on the <br /> latest news</h2>

                    <div className="flex items-center gap-2 justify-center mb-10">
                        <div className="flex items-center gap-2 px-3 w-full sm:w-auto sm:min-w-[335px] border border-solid !border-Mblack rounded-[24px]">
                            <img src="./../images/sms.svg" alt="" />
                            <Form.Control type="text" className='h-[52px] px-0 text__14 !text-Mblack placeholder:text-[#525252] outline-none bg-transparent border-none shadow-none focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none' placeholder="Enter your email address" />
                        </div>
                        <div className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass !py-[14px]">Subscribe</div>
                    </div>
                </Container>
            </section>
        </Fragment >
    )
}

export default Homepage


