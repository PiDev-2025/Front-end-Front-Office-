import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ParkingLiveView = ({ parkingId: propParkingId }) => {
  const { id: urlParkingId } = useParams(); // Si utilisation de React Router
  const parkingId = propParkingId || urlParkingId;

  // États pour les données du parking
  const [parkingSpots, setParkingSpots] = useState([]);
  const [streets, setStreets] = useState([]);
  const [parkingInfo, setParkingInfo] = useState({
    name: "Parking",
    totalSpots: 0,
    availableSpots: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  // Chargement des données du parking
  useEffect(() => {
    if (parkingId) {
      loadParkingData();
    }
  }, [parkingId]);

  // Fonction pour charger les données du parking
  const loadParkingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/parkings/parkings/${parkingId}`
      );
      const parkingData = response.data;

      // Mise à jour des états avec les données reçues
      setParkingSpots(
        parkingData.spots.map((spot) => ({
          id: spot.id,
          position: { left: spot.x, top: spot.y },
          rotation: spot.rotation,
          size: { width: spot.width, height: spot.height },
          isOccupied: spot.status === "occupied",
          isReserved: spot.status === "reserved",
        }))
      );

      if (parkingData.layout?.streets) {
        setStreets(
          parkingData.layout.streets.map((street) => ({
            id: street.id,
            position: { left: street.x, top: street.y },
            rotation: street.rotation,
            width: street.width,
            length: street.length,
            hasEntrance: street.hasEntrance,
            hasExit: street.hasExit,
          }))
        );
      }

      // Mise à jour des informations générales du parking
      setParkingInfo({
        name: parkingData.name || "Parking",
        totalSpots: parkingData.totalSpots || parkingData.spots.length,
        availableSpots:
          parkingData.availableSpots ||
          parkingData.spots.filter((spot) => spot.status === "available")
            .length,
      });

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du parking:", error);
      setError("Impossible de charger les données du parking");
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour l'état d'occupation d'une place
  const toggleOccupancy = async (id) => {
    // Trouver le spot actuel
    const currentSpot = parkingSpots.find((spot) => spot.id === id);
  
    // Si le spot est déjà réservé ou occupé, ne rien faire
    if (currentSpot.isOccupied || currentSpot.isReserved) {
      return;
    }
  
    // Mettre à jour l'état local immédiatement pour une meilleure réactivité
    const updatedSpots = parkingSpots.map((spot) => {
      if (spot.id === id) {
        return { ...spot, isReserved: true, isOccupied: false };
      }
      return spot;
    });
  
    // Mise à jour du state
    setParkingSpots(updatedSpots);
  
    // Mettre à jour les compteurs
    const availableCount = updatedSpots.filter(
      (spot) => !spot.isOccupied && !spot.isReserved
    ).length;
    setParkingInfo({
      ...parkingInfo,
      availableSpots: availableCount,
    });
  
    // Préparation des données pour l'API
    const spotData = {
      status: "reserved",
    };
  
    try {
      setUpdateStatus("updating");
      const token = localStorage.getItem('token');
    
    // Créer les en-têtes avec le token d'authentification
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Appel à l'API pour mettre à jour le statut de la place avec le token
    await axios.patch(
      `http://localhost:3001/parkings/${parkingId}/spots/${id}`,
      spotData,
      config
    );
  
      setUpdateStatus("success");
      // Effacer le statut après 2 secondes
      setTimeout(() => setUpdateStatus(null), 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la place:", error);
      setUpdateStatus("error");
  
      // Rétablir l'état précédent en cas d'erreur
      setParkingSpots(parkingSpots);
      setParkingInfo({
        ...parkingInfo,
        availableSpots: parkingSpots.filter(
          (spot) => !spot.isOccupied && !spot.isReserved
        ).length,
      });
  
      // Effacer le statut d'erreur après 3 secondes
      setTimeout(() => setUpdateStatus(null), 3000);
    }
  };

  // Fonction pour dessiner une place de parking
  const renderParkingSpot = (spot) => {
    const spotWidth = spot.size?.width || 60;
    const spotHeight = spot.size?.height || 30;

    // Déterminer la couleur en fonction du statut
    let fillColor = "#2ecc71"; // Vert par défaut (disponible)
    let spotText = "P";

    if (spot.isOccupied) {
      fillColor = "#e74c3c"; // Rouge pour occupé
      spotText = "X";
    } else if (spot.isReserved) {
      fillColor = "#f39c12"; // Orange pour réservé
      spotText = "R";
    }

    return (
      <div
        key={spot.id}
        style={{
          position: "absolute",
          left: spot.position.left,
          top: spot.position.top,
          width: `${spotWidth}px`,
          height: `${spotHeight}px`,
          transform: `rotate(${spot.rotation}rad)`,
          transformOrigin: "center center",
          cursor:
            spot.isOccupied || spot.isReserved ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
        }}
        onClick={() => toggleOccupancy(spot.id)}
        title={`Place ${spot.id} - ${
          spot.isOccupied
            ? "Occupée"
            : spot.isReserved
            ? "Réservée"
            : "Disponible"
        }`}
      >
        <svg
          width={spotWidth}
          height={spotHeight}
          viewBox={`0 0 ${spotWidth} ${spotHeight}`}
        >
          <rect
            x="2"
            y="2"
            width={spotWidth - 4}
            height={spotHeight - 4}
            rx="2"
            stroke="#fff"
            strokeWidth="2"
            fill={fillColor}
            fillOpacity="0.7"
          >
            <animate
              attributeName="fillOpacity"
              values={
                updateStatus === "updating" && spot.id ? "0.7;0.3;0.7" : "0.7"
              }
              dur="1s"
              repeatCount="1"
            />
          </rect>
          <text
            x={spotWidth / 2}
            y={spotHeight / 2}
            fontSize="14"
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {spotText}
          </text>
        </svg>
      </div>
    );
  };

  // Dessin d'une rue
  const renderStreet = (street) => {
    return (
      <div
        key={street.id}
        style={{
          position: "absolute",
          left: street.position.left,
          top: street.position.top,
          width: `${street.width}px`,
          height: `${street.length}px`,
          transform: `rotate(${street.rotation}rad)`,
          transformOrigin: "center center",
          backgroundColor: "#444",
          borderRadius: "4px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Marquage central */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "4px",
            height: "100%",
            backgroundColor: "#fff",
            opacity: 0.6,
            borderRadius: "2px",
            zIndex: 1,
          }}
        />

        {/* Entrée */}
        {street.hasEntrance && (
          <div
            style={{
              position: "absolute",
              top: "5px",
              left: "5px",
              width: "20px",
              height: "20px",
              backgroundColor: "#3498db",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px" }}>E</span>
          </div>
        )}

        {/* Sortie */}
        {street.hasExit && (
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              width: "20px",
              height: "20px",
              backgroundColor: "#e74c3c",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px" }}>S</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement du parking...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* En-tête avec informations générales */}
      <div className="bg-gray-800 text-white p-4 rounded-t-lg shadow-lg mb-1">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{parkingInfo.name}</h1>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm">Total</div>
              <div className="text-xl font-bold">{parkingInfo.totalSpots}</div>
            </div>
            <div className="text-center">
              <div className="text-sm">Disponibles</div>
              <div className="text-xl font-bold text-green-400">
                {parkingInfo.availableSpots}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm">Occupées</div>
              <div className="text-xl font-bold text-red-400">
                {parkingInfo.totalSpots - parkingInfo.availableSpots}
              </div>
            </div>
            <button
              onClick={loadParkingData}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Notification de mise à jour */}
      {updateStatus && (
        <div
          className={`p-2 mb-2 rounded-md text-center transition-all ${
            updateStatus === "updating"
              ? "bg-yellow-100 text-yellow-800"
              : updateStatus === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {updateStatus === "updating"
            ? "Mise à jour en cours..."
            : updateStatus === "success"
            ? "Mise à jour réussie!"
            : "Erreur lors de la mise à jour"}
        </div>
      )}

      {/* Légende */}
      <div className="bg-gray-100 p-3 mb-4 rounded-md flex gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
          <span>Occupée</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
          <span>Réservée</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Entrée</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
          <span>Sortie</span>
        </div>
        <div className="ml-auto italic text-gray-500">
          Cliquez sur une place disponible pour la réserver
        </div>
      </div>

      {/* Zone de visualisation du parking */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          backgroundColor: "#222",
          border: "2px solid #444",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Rendu des rues */}
        {streets.map(renderStreet)}

        {/* Rendu des places de parking */}
        {parkingSpots.map(renderParkingSpot)}
      </div>
    </div>
  );
};

export default ParkingLiveView;
