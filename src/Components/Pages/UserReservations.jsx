import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReservation, setSelectedReservation] = useState(null);

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
                
                console.log("Réservations reçues:", response.data);
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

    const handleDelete = async (reservationId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/api/reservations/${reservationId}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Mettre à jour la liste des réservations
            setReservations(prevReservations => 
                prevReservations.filter(res => res._id !== reservationId)
            );
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            setError(err.response?.data?.message || 'Erreur lors de la suppression de la réservation');
        }
    };

    const ReservationCard = ({ reservation }) => {
        const handlePrint = () => {
            const printWindow = window.open('', '', 'width=600,height=600');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code Réservation - ${reservation.parkingId.name}</title>
                        <style>
                            body { font-family: Arial; text-align: center; padding: 20px; }
                            .qr-container { margin: 20px auto; }
                            .details { margin: 20px 0; text-align: left; max-width: 400px; margin: auto; }
                            .footer { margin-top: 20px; font-size: 12px; color: #666; }
                        </style>
                    </head>
                    <body>
                        <h2>Réservation Parking - ${reservation.parkingId.name}</h2>
                        <div class="qr-container">
                            <img src="${reservation.qrCode}" alt="QR Code" style="max-width: 300px"/>
                        </div>
                        <div class="details">
                            <p><strong>Date d'arrivée:</strong> ${new Date(reservation.startTime).toLocaleString()}</p>
                            <p><strong>Date de départ:</strong> ${new Date(reservation.endTime).toLocaleString()}</p>
                            <p><strong>Type de véhicule:</strong> ${reservation.vehicleType}</p>
                            <p><strong>Montant total:</strong> ${reservation.totalPrice}€</p>
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <h3 className="text-black text-lg font-semibold">{reservation.parkingId.name}</h3>
                    <p className="text-blue-100 text-sm">
                        Réservation #{reservation.reservationId}
                    </p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Arrivée</p>
                            <p className="font-medium">
                                {format(new Date(reservation.startTime), 'PPP à HH:mm', { locale: fr })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Départ</p>
                            <p className="font-medium">
                                {format(new Date(reservation.endTime), 'PPP à HH:mm', { locale: fr })}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Véhicule:</span>
                            <span className="font-medium">{reservation.vehicleType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Prix total:</span>
                            <span className="font-medium">{reservation.totalPrice}Dt</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Statut:</span>
                            <span className={`font-medium ${
                                reservation.status === 'accepted' ? 'text-green-600' :
                                reservation.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                {reservation.status === 'accepted' ? 'Confirmée' :
                                reservation.status === 'pending' ? 'En attente' :
                                'Annulée'}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                        <button
                            onClick={() => setSelectedReservation(reservation)}
                            className="flex-1 bg-blue-600 text-black py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                           QR Code
                        </button>
                        <button
                            onClick={() => handleDelete(reservation._id)}
                            className="flex-1 bg-red-600 text-black py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const QRCodeModal = () => {
        const handlePrintQR = () => {
            const printWindow = window.open('', '', 'width=600,height=600');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code Réservation - ${selectedReservation.parkingId.name}</title>
                        <style>
                            body { font-family: Arial; text-align: center; padding: 20px; }
                            .qr-container { margin: 20px auto; }
                            .details { margin: 20px 0; text-align: left; max-width: 400px; margin: auto; }
                            .footer { margin-top: 20px; font-size: 12px; color: #666; }
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
                            <p><strong>Montant total:</strong> ${selectedReservation.totalPrice}€</p>
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
                <div className="bg-white rounded-xl p-8 max-w-md w-full">
                    <h3 className="text-xl font-semibold mb-4 text-center">QR Code de réservation</h3>
                    <img 
                        src={selectedReservation.qrCode} 
                        alt="QR Code" 
                        className="mx-auto mb-4"
                    />
                    <div className="text-center mb-6">
                        <p className="text-gray-600">Présentez ce QR code à l'entrée du parking</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handlePrintQR}
                            className="flex-1 py-2 px-4 bg-blue-600 text-black rounded-lg hover:bg-blue-700"
                        >
                            Imprimer
                        </button>
                        <button
                            onClick={() => setSelectedReservation(null)}
                            className="flex-1 py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Mes réservations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map(reservation => (
                    <ReservationCard 
                        key={reservation._id} 
                        reservation={reservation}
                    />
                ))}
            </div>
            {selectedReservation && <QRCodeModal />}
        </div>
    );
};

export default UserReservations;
