import React, { useEffect, useState } from "react";
import axios from "axios";
import ParkingRequestForm from "./ParkingForm";
import ParkingEditForm from "./ParkingEditForm";
import { useNavigate } from "react-router-dom"; 
import { showToast } from "../utils/toast";



const ParkingListOwner = () => {
  const [myParkings, setMyParkings] = useState([]);
  const navigate = useNavigate(); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingParking, setEditingParking] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingRequestParkings, setPendingRequestParkings] = useState({});
  const [selectedParking, setSelectedParking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredParking, setHoveredParking] = useState(null);
  

  // 🔹 Fonction pour récupérer les parkings de l'Owner
  const fetchMyParkings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ Aucun token trouvé !");
        setError("Utilisateur non authentifié !");
        return;
      }

      console.log("Envoi de la requête pour récupérer les parkings..."); // 🔍 Debug
      const response = await axios.get("http://localhost:3001/parkings/my-parkings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Réponse reçue :", response.data); // 🔍 Debug
      setMyParkings(response.data);
      
      // Check pending requests for all parkings after fetching
      checkAllPendingRequests(response.data);
    } catch (err) {
      console.error("Erreur API :", err); // 🔍 Debug
      setError(err.response?.data?.message || "Erreur lors du chargement des parkings");
    } finally {
      setLoading(false);
    }
  };

  // Vérifier les requêtes en attente pour tous les parkings
  const checkAllPendingRequests = async (parkings) => {
    const pendingStatus = {};
    
    // Vérifier chaque parking de façon parallèle
    const promises = parkings.map(async (parking) => {
      try {
        await axios.get(`http://localhost:3001/parkings/check-pending/${parking._id}`);
        // Si la requête réussit, il n'y a pas de requête en attente
        pendingStatus[parking._id] = false;
      } catch (error) {
        // Si status 400, il y a une requête en attente
        pendingStatus[parking._id] = error.response?.status === 400;
      }
    });
    
    await Promise.all(promises);
    setPendingRequestParkings(pendingStatus);
  };

  // 🔹 Récupération des parkings au montage du composant
  useEffect(() => {
    fetchMyParkings();
  }, []);

  const handleEdit = async (parking) => {
    try {
      // Vérifier s'il y a déjà une requête en attente
      const response = await axios.get(
        `http://localhost:3001/parkings/check-pending/${parking._id}`
      );
  
      if (response.status === 200) {
        // ✅ Aucune requête en attente, on peut éditer
        setEditingParking(parking);
        setIsAdding(false); // Désactiver le mode ajout lors de l'édition
      }
    } catch (error) {
      // ❌ Une requête en attente existe, afficher un message d'erreur
      showToast.alert(error.response?.data?.message || "Erreur lors de la vérification.");
    }
  };

  // 🔹 Fonction pour ajouter un parking
  const handleAdd = () => {
    setEditingParking(null);
    setIsAdding(true); // ✅ Activer le mode ajout
  };

  // 🔹 Fonction pour supprimer un parking
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce parking ?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/parkings/parkings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mise à jour de la liste des parkings après suppression
        setMyParkings((prevParkings) => prevParkings.filter((parking) => parking._id !== id));
      } catch (err) {
        showToast.alert("Erreur lors de la suppression !");
      }
    }
  };
  
  const handleShowDetails = (parking, e) => {
    if (e) e.stopPropagation();
    setSelectedParking(parking);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedParking(null);
  };

  const handleHover = (parking) => {
    setHoveredParking(parking._id);
  };
  
  // Popup amélioré et professionnel
  const ParkingDetailsPopup = ({ parking, onClose }) => {
    // Animation d'ouverture
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
      // Ajouter un court délai pour l'animation
      setIsOpen(true);
      
      // Empêcher le défilement du corps pendant l'affichage du popup
      document.body.style.overflow = 'hidden';
      
      // Nettoyer lors du démontage
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
    
    // Fonction pour fermer avec animation
    const closeWithAnimation = () => {
      setIsOpen(false);
      setTimeout(() => {
        onClose();
      }, 300); // Délai correspondant à la durée de transition
    };
    
    // Gestionnaire pour fermer en cliquant à l'extérieur
    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget) {
        closeWithAnimation();
      }
    };
    
    // Gestionnaire pour la touche Échap
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeWithAnimation();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, []);
    
    const formattedPrice = parking.price ? 
      `€${parseFloat(parking.price).toFixed(2)}/hr` : 
      "€5.00/hr";
    
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-60' : 'bg-opacity-0'
        }`}
        onClick={handleOutsideClick}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className={`bg-white rounded-lg shadow-xl w-full max-w-md p-0 relative transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${
            isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* En-tête du popup avec image de fond */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <button
              onClick={closeWithAnimation}
              className="absolute top-3 right-3 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Contenu du popup */}
          <div className="px-6 pt-4 pb-6 -mt-10">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4 relative">
              <h2 className="text-2xl font-bold text-gray-800">{parking.name}</h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {parking.location}
              </p>
            </div>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <p className="text-xs font-medium text-gray-500 uppercase">Total spots</p>
                  <p className="text-lg font-semibold text-gray-800 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    {parking.totalSpots}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <p className="text-xs font-medium text-gray-500 uppercase">Available spots</p>
                  <p className="text-lg font-semibold text-gray-800 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {parking.availableSpots}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <p className="text-xs font-medium text-gray-500 uppercase">Price</p>
                  <p className="text-lg font-semibold text-blue-600 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formattedPrice}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <p className="text-lg font-semibold text-green-600 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Active
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Description
              </h3>
              <p className="text-gray-600 mt-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                {parking.description || "Secure parking location with 24/7 access and video surveillance."}
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Features
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24/7 Access
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Indoor
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Camera Surveillance
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  closeWithAnimation();
                  setTimeout(() => {
                    handleEdit(parking);
                  }, 300);
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              <button 
                onClick={() => {
                  closeWithAnimation();
                  setTimeout(() => {
                    handleDelete(parking._id);
                  }, 300);
                }}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Show popup if visible */}
      {showPopup && selectedParking && (
        <ParkingDetailsPopup
          parking={selectedParking}
          onClose={handleClosePopup}
        />
      )}
      
      <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🚗 Gérer mes Parkings</h2>

          {/* ✅ Nouveau bouton qui redirige vers /ParkingRequestForm */}
          <button
            onClick={() => navigate("/ParkingRequestForm")} // ✅ Redirection
            className="bg-green-600 text-black rounded-lg py-2 px-4 hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Ajouter un parking
          </button>
        </div>
        
        {/* Form Section */}
        {isAdding && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau parking</h3>
            <ParkingRequestForm
              onSuccess={() => {
                setIsAdding(false);
                fetchMyParkings();
              }}
            />
          </div>
        )}
        
        {editingParking && !isAdding && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Modifier le parking</h3>
            <ParkingEditForm
              editingParking={editingParking}
              setEditingParking={setEditingParking}
              refreshParkings={fetchMyParkings}
            />
          </div>
        )}
        
        {/* Parking List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Mes Parkings</h3>
          
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : myParkings.length === 0 ? (
            <div className="text-gray-500 p-6 text-center bg-gray-50 rounded-lg">
              <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="mx-auto text-gray-400" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Aucun parking ajouté</h3>
              <p className="mt-2">
                Vous n'avez pas encore ajouté de parking. 
                <br />Cliquez sur "Ajouter un parking" pour commencer.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myParkings.map(parking => (
                <div 
                  key={parking._id} 
                  className={`p-4 rounded-lg shadow-md transition-all cursor-pointer relative ${
                    hoveredParking === parking._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white border'
                  }`}
                  onMouseEnter={() => handleHover(parking)}
                  onMouseLeave={() => setHoveredParking(null)}
                  onClick={() => handleShowDetails(parking)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{parking.name}</h3>
                      <p className="text-sm text-gray-600">{parking.location}</p>
                    </div>
                   
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Total places</p>
                      <p className="font-semibold">{parking.totalSpots}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Disponibles</p>
                      <p className="font-semibold">{parking.availableSpots}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between">
                    {!pendingRequestParkings[parking._id] && (
                      <button 
                        className="bg-blue-600 text-black py-1 px-3 rounded-md hover:bg-blue-700 transition text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(parking);
                        }}
                      >
                        Modifier
                      </button>
                    )}
                    
                    <button
                      className="bg-red-600 text-black py-1 px-3 rounded-md hover:bg-red-700 transition text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(parking._id);
                      }}
                    >
                      Supprimer
                    </button>
                    
                    <button 
                      className="bg-gray-600 text-black py-1 px-3 rounded-md hover:bg-gray-700 transition text-sm"
                      onClick={(e) => handleShowDetails(parking, e)}
                    >
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingListOwner;