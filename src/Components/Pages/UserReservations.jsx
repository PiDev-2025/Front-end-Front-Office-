import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useMapbox } from "../../context/MapboxContext";
import { toast } from 'react-toastify';
import MapModal from '../Modals/MapModal';

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [travelTimes, setTravelTimes] = useState({});
    const { isLoaded } = useMapbox();
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedRouteReservation, setSelectedRouteReservation] = useState(null);

    // Ajout d'un ref pour éviter les calculs redondants
    const calculatedRoutes = React.useRef(new Set());

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token non trouvé');
                }

                const response = await axios.get(
                    'http://localhost:3001/api/reservations/my-reservations',
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                // Log pour le débogage
                response.data.forEach(reservation => {
                    console.log("Parking data:", {
                        id: reservation._id,
                        parkingName: reservation.parkingId?.name,
                        position: reservation.parkingId?.position,
                        coordinates: reservation.parkingId?.coordinates,
                        lat: reservation.parkingId?.lat,
                        lng: reservation.parkingId?.lng
                    });
                });

                setReservations(response.data);
            } catch (err) {
                console.error("Erreur de chargement:", err);
                setError(err.response?.data?.message || 'Erreur lors du chargement des réservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    // Ajoutez cette fonction utilitaire de conversion
    const formatDuration = (minutes) => {
        if (minutes < 60) {
          return `${Math.round(minutes)} min`;
        } else {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = Math.round(minutes % 60);
          return remainingMinutes > 0 
            ? `${hours}h ${remainingMinutes}min`
            : `${hours}h`;
        }
    };

    const calculateTravelTime = React.useCallback(async (reservation) => {
        if (calculatedRoutes.current.has(reservation._id)) {
            return null;
        }
      
        if (!isLoaded || !userLocation || !reservation.parkingId) {
            return null;
        }
      
        try {
            calculatedRoutes.current.add(reservation._id);
            
            const parkingPosition = reservation.parkingId.position;
            
            if (!parkingPosition?.lat || !parkingPosition?.lng) {
                return null;
            }
      
            // Utiliser l'API de directions de Mapbox
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${parkingPosition.lng},${parkingPosition.lat}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
            );
      
            const data = await response.json();
            
            if (data.routes && data.routes.length > 0) {
                const duration = data.routes[0].duration;
                const durationMinutes = duration / 60;
                const formattedDuration = formatDuration(durationMinutes);
                
                setTravelTimes(prev => ({
                    ...prev,
                    [reservation._id]: {
                        text: formattedDuration,
                        value: duration,
                        minutes: durationMinutes
                    }
                }));
                
                return formattedDuration;
            }
        } catch (error) {
            console.error("Error calculating travel time:", error);
        }
        return null;
    }, [isLoaded, userLocation]);

    // Modifier l'effet de géolocalisation
    useEffect(() => {
        if (!isLoaded || !navigator.geolocation) return;

        let mounted = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!mounted) return;

                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(userPos);
            },
            (error) => {
                console.error("Error getting user location:", error);
            }
        );

        return () => {
            mounted = false;
        };
    }, [isLoaded]);

    // Effet séparé pour le calcul des temps de trajet
    useEffect(() => {
        if (!userLocation || !isLoaded || reservations.length === 0) return;

        // Reset calculated routes when user location changes
        calculatedRoutes.current.clear();

        // Calculate travel times sequentially
        const calculateTravelTimes = async () => {
            for (const reservation of reservations) {
                if (reservation.parkingId?.position) {
                    await calculateTravelTime(reservation);
                }
            }
        };

        calculateTravelTimes();
    }, [userLocation, isLoaded, reservations, calculateTravelTime]);

    const handleDelete = async (reservationId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Session expirée. Veuillez vous reconnecter.');
                return;
            }
    
            const response = await axios.delete(
                `http://localhost:3001/api/reservations/${reservationId}`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.status === 200) {
                // Mise à jour de l'état local
                setReservations(prevReservations => 
                    prevReservations.filter(res => res._id !== reservationId)
                );
                toast.success('Réservation supprimée avec succès');
            }
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de la réservation';
            toast.error(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'accepted':
                return {
                    style: {
                        backgroundColor: '#d1fae5',
                        color: '#065f46'
                    },
                    label: 'confirmed'
                };
            case 'pending':
                return {
                    style: {
                        backgroundColor: '#fef3c7',
                        color: '#92400e'
                    },
                    label: 'pending'
                };
            default:
                return {
                    style: {
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c'
                    },
                    label: 'cancelled'
                };
        }
    };

    const vehiculeOptions = [
        { value: "Moto", label: "Moto", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765730/moto_xdypx2.png" },
        { value: "Citadine", label: "City Car", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-ville_ocwbob.png" },
        { value: "Berline / Petit SUV", label: "Small SUV", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/wagon-salon_bj2j1s.png" },
        { value: "Familiale / Grand SUV", label: "Large SUV", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-familiale_rmgclg.png" },
        { value: "Utilitaire", label: "Utility vehicle", image: "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png" }
    ];
    
    const getVehicleIcon = (vehicleType) => {
        const matchedOption = vehiculeOptions.find(option =>
            vehicleType.toLowerCase().includes(option.value.toLowerCase())
        );
    
        if (matchedOption) {
            return (
                <img
                    src={matchedOption.image}
                    alt={matchedOption.label}
                    className="w-5 h-5 mr-1"
                />
            );
        }
    
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        );
    };

    const handleShowRoute = (reservation) => {
        setSelectedRouteReservation(reservation);
        setIsMapModalOpen(true);
    };

    const ReservationCard = React.memo(({ reservation }) => {
        const statusInfo = getStatusColor(reservation.status);
        
        useEffect(() => {
            if (reservation.parkingId) {
                calculateTravelTime(reservation);
            }
        }, [reservation]);

        const renderTravelTime = () => {
            const travelTime = travelTimes[reservation._id];
            if (!travelTime) return null;
    
            return (
                <div className="mt-3 flex items-center text-gray-600 bg-gray-50 p-4 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Temps de trajet estimé:</span>
                        <span className="text-lg font-semibold text-blue-600">{travelTime.text}</span>
                    </div>
                </div>
            );
        };

        const handleShowQRCode = () => {
            setSelectedReservation(reservation);
        };

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 relative">
                    <div className="absolute top-0 right-0 mt-2 mr-2">
                    <span style={statusInfo.style} className="text-xs px-3 py-1 rounded-full font-semibold">
    {statusInfo.label}
</span>
                    </div>
                    <h3 className="text-black text-xl font-semibold">{reservation.parkingId?.name || 'Parking'}</h3>
                    <p className="text-blue-100 text-sm opacity-90">
                    </p>
                </div>
                
                <div className="p-6">
                    <div className="flex justify-between mb-6 bg-gray-50 rounded-lg p-4">
                        <div className="text-center flex-1 border-r border-gray-200">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Arrivée</p>
                            <p className="font-medium text-gray-800">
                                {format(new Date(reservation.startTime), 'dd MMM yyyy', { locale: fr })}
                            </p>
                            <p className="text-sm text-gray-700">
                                {format(new Date(reservation.startTime), 'HH:mm', { locale: fr })}
                            </p>
                        </div>
                        <div className="text-center flex-1">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Départ</p>
                            <p className="font-medium text-gray-800">
                                {format(new Date(reservation.endTime), 'dd MMM yyyy', { locale: fr })}
                            </p>
                            <p className="text-sm text-gray-700">
                                {format(new Date(reservation.endTime), 'HH:mm', { locale: fr })}
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 mb-5">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div className="flex items-center text-gray-700">
                                {getVehicleIcon(reservation.vehicleType)}
                                <span className="text-sm">Véhicule</span>
                            </div>
                            <span className="font-medium text-gray-900">{reservation.vehicleType}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div className="flex items-center text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">Prix total</span>
                            </div>
                            <span className="font-semibold text-lg text-blue-700">{reservation.totalPrice} Dt</span>
                        </div>
                    </div>
                    
                    {renderTravelTime()}

                    <div className="flex space-x-2 mt-6">
                    <button
                            onClick={handleShowQRCode} // Changed to handleShowQRCode
                            className="flex-1 bg-white border border-red-500 text-red-500 py-2.5 px-4 rounded-lg hover:bg-red-50 transition-colors flex justify-center items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            QR Code
                        </button>
                    <button
                            onClick={() => handleShowRoute(reservation)}
                            className="flex-1 bg-white border border-red-500 text-red-500 py-2.5 px-4 rounded-lg hover:bg-red-50 transition-colors flex justify-center items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Itinéraire
                        </button>
                      
                        <button
 onClick={() => handleDelete(reservation._id)}
     className="flex-1 bg-white border border-red-500 text-red-500 py-2.5 px-4 rounded-lg hover:bg-red-50 transition-colors flex justify-center items-center"
>
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
                            
                        </button>
                       
                    </div>
                </div>
            </div>
        );
    });

    const QRCodeModal = () => {
        const handlePrintQR = () => {
            const printWindow = window.open('', '', 'width=600,height=600');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code Réservation - ${selectedReservation.parkingId.name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                            .qr-container { margin: 20px auto; }
                            .details { margin: 20px 0; text-align: left; max-width: 400px; margin: auto; }
                            .footer { margin-top: 20px; font-size: 12px; color: #666; }
                            h2 { color: #3B82F6; }
                            .details p { padding: 8px 0; border-bottom: 1px solid #eee; }
                        </style>
                    </head>
                    <body>
                        <h2>Réservation Parking - ${selectedReservation.parkingId.name}</h2>
                        <div class="qr-container">
                            <img src="${selectedReservation.qrCode}" alt="QR Code" style="max-width: 300px"/>
                        </div>
                        <div class="details">
                            <p><strong>Date d'arrivée:</strong> ${new Date(selectedReservation.startTime).toLocaleString()}</p>
                            <p><strong>Date de départ:</strong> ${new Date(selectedReservation.endTime).toLocaleString()}</p>
                            <p><strong>Type de véhicule:</strong> ${selectedReservation.vehicleType}</p>
                            <p><strong>Montant total:</strong> ${selectedReservation.totalPrice} Dt</p>
                        </div>
                        <div class="footer">
                            <p>Veuillez présenter ce QR code à l'entrée du parking</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
                    <button 
                        onClick={() => setSelectedReservation(null)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">QR Code de réservation</h3>
                    <p className="text-center text-sm text-gray-600 mb-6">Parking {selectedReservation.parkingId.name}</p>
                    
                    <div className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-xl mb-6 shadow-inner">
                        <img 
                            src={selectedReservation.qrCode} 
                            alt="QR Code" 
                            className="mx-auto w-64 h-64 object-contain"
                        />
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center text-blue-800 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Instructions</span>
                        </div>
                        <p className="text-blue-700 text-sm">
                            Présentez ce QR code à l'entrée du parking pour accéder à votre place.
                        </p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <button
                            onClick={handlePrintQR}
                            className="flex-1 py-3 px-4 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimer
                    </button>
                    <button
                        onClick={() => setSelectedReservation(null)}
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};
    // Animation pour le chargement
    if (loading) return (   
        <div className="flex flex-col justify-center items-center min-h-[500px]">   
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500 font-medium">Chargement de vos réservations...</p>
        </div>   
    );

    // Message d'erreur amélioré  
    if (error) return (  
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto my-8">
            <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800">Erreur de chargement</h3>
            </div>
            <p className="text-red-600">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors inline-flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réessayer
            </button>
        </div>  
    );

    // Pas de réservations    
    if (reservations.length === 0) return (    
        <div className="container mx-auto px-4 py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Aucune réservation trouvée</h3>
                <p className="text-gray-500 mb-6">Vous n'avez pas  encore effectué de réservation.</p>
                <a href="/Booking" className="inline-block bg-blue-600 text-black py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Découvrir les parkings
                </a>
            </div>
        </div>    
    );

    return (    
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Mes réservations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map(reservation => (
                    <ReservationCard 
                        key={reservation._id || Math.random().toString()} 
                        reservation={reservation}
                        onShowRoute={handleShowRoute}  // Changed from showRoute to handleShowRoute
                    />
                ))}
            </div>
            {isMapModalOpen && selectedRouteReservation && userLocation && (
                <MapModal
                    isOpen={isMapModalOpen}
                    onClose={() => {
                        setIsMapModalOpen(false);
                        setSelectedRouteReservation(null);
                    }}
                    reservation={selectedRouteReservation}
                    userLocation={userLocation}
                />
            )}
            {selectedReservation && <QRCodeModal />}
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}</style>
        </div>    
    );
};

<<<<<<< HEAD
=======

>>>>>>> main
export default UserReservations;
