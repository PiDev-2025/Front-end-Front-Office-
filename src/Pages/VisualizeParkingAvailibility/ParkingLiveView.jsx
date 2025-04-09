import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ParkingLiveView = ({ parkingId: propParkingId }) => {
  const { id: urlParkingId } = useParams(); // Si utilisation de React Router
  const parkingId = propParkingId || urlParkingId;

  const [parkingSpots, setParkingSpots] = useState([]);
  const [streets, setStreets] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [parkingInfo, setParkingInfo] = useState({
    name: "Parking",
    totalSpots: 0,
    availableSpots: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [parkingDimensions, setParkingDimensions] = useState({
    width: 0,
    height: 0,
    boundingBox: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isMouseOverVisualization, setIsMouseOverVisualization] =
    useState(false);
  const containerRef = useRef(null);
  const [isReservationPopupOpen, setIsReservationPopupOpen] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  const calculateParkingDimensions = (spots, streets, arrows) => {
    // Make sure to include arrows in the calculation
    const allElements = [...spots, ...streets, ...arrows];

    if (allElements.length === 0)
      return {
        width: 0,
        height: 0,
        boundingBox: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
      };

    const boundingBox = allElements.reduce(
      (acc, el) => {
        const left = el.position?.left || 0;
        const top = el.position?.top || 0;
        const width = el.size?.width || el.width || 60;
        const height = el.size?.height || el.length || 30;

        return {
          minX: Math.min(acc.minX, left),
          minY: Math.min(acc.minY, top),
          maxX: Math.max(acc.maxX, left + width),
          maxY: Math.max(acc.maxY, top + height),
        };
      },
      {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      }
    );

    return {
      width: boundingBox.maxX - boundingBox.minX,
      height: boundingBox.maxY - boundingBox.minY,
      boundingBox,
    };
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Bouton gauche de la souris
      setIsDragging(true);
      setStartPos({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = (e.clientX - startPos.x) / zoom;
    const dy = (e.clientY - startPos.y) / zoom;

    setOffset((prevOffset) => ({
      x: prevOffset.x + dx,
      y: prevOffset.y + dy,
    }));

    setStartPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Fin du drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Gestion du zoom avec la molette de la souris
  const handleWheel = (e) => {
    // Vérifier explicitement si le curseur est au-dessus du conteneur de visualisation
    const isMouseOverContainer =
      e.target === containerRef.current ||
      containerRef.current.contains(e.target);

    // Si le curseur n'est pas sur le conteneur, ne pas gérer le zoom
    if (!isMouseOverContainer) {
      return;
    }

    // Stopper complètement la propagation et le comportement par défaut
    e.preventDefault();
    e.stopPropagation();

    // Désactiver le scroll par défaut sur le conteneur
    containerRef.current.style.overflow = "hidden";

    // Pinch-to-zoom style zooming
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));

    // Position of the mouse relative to the container
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    // Calculate new offset to zoom towards mouse position
    setOffset((prevOffset) => ({
      x: prevOffset.x - mouseX * (newZoom - zoom),
      y: prevOffset.y - mouseY * (newZoom - zoom),
    }));

    setZoom(newZoom);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Désactiver l'option de scroll passif pour cet élément
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel, { passive: false });
      };
    }
  }, [zoom, offset]);

  // Chargement des données du parking
  useEffect(() => {
    if (parkingId) {
      loadParkingData();
    }
  }, [parkingId]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      calculateInitialView();
    }
  }, [loading, parkingSpots, streets, containerRef.current]);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Multi-touch for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const initialDistance = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY
      );
      e.currentTarget.initialDistance = initialDistance;
    } else if (e.touches.length === 1) {
      // Single touch for panning
      const touch = e.touches[0];
      setIsDragging(true);
      setStartPos({
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Vérifier explicitement si le curseur est au-dessus du conteneur de visualisation
      const isMultiTouchOverContainer =
        e.currentTarget === containerRef.current ||
        containerRef.current.contains(e.currentTarget);

      // Si le multi-touch n'est pas sur le conteneur, ne pas gérer le zoom
      if (!isMultiTouchOverContainer) {
        return;
      }

      // Pinch zoom (code précédent reste identique)
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY
      );

      const zoomFactor = currentDistance / e.currentTarget.initialDistance;
      const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));

      // Calculate center point of pinch
      const centerX = (touch1.pageX + touch2.pageX) / 2;
      const centerY = (touch1.pageY + touch2.pageY) / 2;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (centerX - rect.left) / zoom;
      const mouseY = (centerY - rect.top) / zoom;

      setOffset((prevOffset) => ({
        x: prevOffset.x - mouseX * (newZoom - zoom),
        y: prevOffset.y - mouseY * (newZoom - zoom),
      }));

      setZoom(newZoom);
      e.currentTarget.initialDistance = currentDistance;
    } else if (e.touches.length === 1 && isDragging) {
      // Panning
      const touch = e.touches[0];
      const dx = (touch.clientX - startPos.x) / zoom;
      const dy = (touch.clientY - startPos.y) / zoom;

      setOffset((prevOffset) => ({
        x: prevOffset.x + dx,
        y: prevOffset.y + dy,
      }));

      setStartPos({
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  const handleReservationComplete = async () => {
    // Mise à jour de l'interface après réservation réussie
    setUpdateStatus("success");

    // Rechargement des données du parking pour refléter les changements
    await loadParkingData();

    setTimeout(() => setUpdateStatus(null), 2000);
  };

  // Fonction pour fermer le popup
  const handleCloseReservationPopup = () => {
    setIsReservationPopupOpen(false);
    setSelectedSpotId(null);
  };

  // Fonction pour charger les données du parking
  const loadParkingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/parkings/parkings/${parkingId}`
      );
      const parkingData = response.data;

      const formattedSpots = parkingData.spots.map((spot) => ({
        id: spot.id,
        position: { left: spot.x, top: spot.y },
        rotation: spot.rotation,
        size: { width: spot.width, height: spot.height },
        isOccupied: spot.status === "occupied",
        isReserved: spot.status === "reserved",
      }));

      const formattedStreets =
        parkingData.layout?.streets?.map((street) => ({
          id: street.id,
          position: { left: street.x, top: street.y },
          rotation: street.rotation,
          width: street.width,
          length: street.length,
          hasEntrance: street.hasEntrance,
          hasExit: street.hasExit,
        })) || [];

      const formattedArrows =
        parkingData.layout?.arrows?.map((arrow) => ({
          id: arrow.id,
          position: {
            left: arrow.x,
            top: arrow.y,
          },
          rotation: arrow.rotation,
          size: {
            width: arrow.width || 40,
            height: arrow.length || 80, // Ensure you're using the correct property name
          },
          color: arrow.color || "#F5F5F5",
        })) || [];
      // Add this after setting the formattedArrows in loadParkingData
      console.log("Arrow data from API:", parkingData.layout?.arrows);
      console.log("Formatted Arrows:", formattedArrows);

      setParkingSpots(formattedSpots);
      setStreets(formattedStreets);
      setArrows(formattedArrows);

      // Calculate parking dimensions
      const dimensions = calculateParkingDimensions(
        formattedSpots,
        formattedStreets,
        formattedArrows
      );
      setParkingDimensions(dimensions);

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

  const renderArrow = (arrow) => {
    const arrowWidth = arrow.size?.width || 40;
    const arrowHeight = arrow.size?.height || 80;
    const arrowColor = arrow.color || "#F5F5F5";

    return (
      <div
        key={arrow.id}
        style={{
          position: "absolute",
          left: arrow.position.left,
          top: arrow.position.top,
          width: `${arrowWidth}px`,
          height: `${arrowHeight}px`,
          transform: `rotate(${arrow.rotation}deg)`,
          transformOrigin: "center center", // This is correct
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <svg
          width={arrowWidth}
          height={arrowHeight}
          viewBox={`0 0 ${arrowWidth} ${arrowHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Improved arrow path with better positioning */}
          <path
            d={`M ${arrowWidth * 0.1} ${arrowHeight / 2} 
                  L ${arrowWidth * 0.9} ${arrowHeight / 2} 
                  M ${arrowWidth * 0.7} ${arrowHeight * 0.3} 
                  L ${arrowWidth * 0.9} ${arrowHeight / 2} 
                  L ${arrowWidth * 0.7} ${arrowHeight * 0.7}`}
            stroke={arrowColor}
            strokeWidth={arrowWidth * 0.1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  // Méthode pour calculer la vue initiale
  const calculateInitialView = () => {
    if (!containerRef.current || parkingSpots.length === 0) return;

    const containerWidth = 800;
    const containerHeight = 600;

    // Utiliser les dimensions précalculées du parking
    const {
      width: parkingWidth,
      height: parkingHeight,
      boundingBox,
    } = parkingDimensions;

    // Calculer le zoom optimal
    const zoomX = containerWidth / parkingWidth;
    const zoomY = containerHeight / parkingHeight;
    const initialZoom = Math.min(zoomX, zoomY) * 0.9; // 90% pour une marge

    // Calculer le décalage exact pour centrer
    const centeringOffsetX =
      (containerWidth / initialZoom - parkingWidth) / 2 - boundingBox.minX;
    const centeringOffsetY =
      (containerHeight / initialZoom - parkingHeight) / 2 - boundingBox.minY;

    setZoom(initialZoom);
    setOffset({
      x: centeringOffsetX,
      y: centeringOffsetY,
    });
  };

  // Fonction pour mettre à jour l'état d'occupation d'une place
  /*const toggleOccupancy = async (id) => {
    const currentSpot = parkingSpots.find((spot) => spot.id === id);

    if (currentSpot.isOccupied || currentSpot.isReserved) {
      return;
    }
    const updatedSpots = parkingSpots.map((spot) => {
      if (spot.id === id) {
        return { ...spot, isReserved: true, isOccupied: false };
      }
      return spot;
    });

    setParkingSpots(updatedSpots);

    const availableCount = updatedSpots.filter(
      (spot) => !spot.isOccupied && !spot.isReserved
    ).length;
    setParkingInfo({
      ...parkingInfo,
      availableSpots: availableCount,
    });

    const spotData = {
      status: "reserved",
    };

    try {
      setUpdateStatus("updating");
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.patch(
        `http://localhost:3001/parkings/${parkingId}/spots/${id}`,
        spotData,
        config
      );

      setUpdateStatus("success");
      setTimeout(() => setUpdateStatus(null), 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la place:", error);
      setUpdateStatus("error");

      setParkingSpots(parkingSpots);
      setParkingInfo({
        ...parkingInfo,
        availableSpots: parkingSpots.filter(
          (spot) => !spot.isOccupied && !spot.isReserved
        ).length,
      });

      setTimeout(() => setUpdateStatus(null), 3000);
    }
  };*/

  const toggleOccupancy = (id) => {
    const currentSpot = parkingSpots.find((spot) => spot.id === id);

    // Si la place est déjà occupée ou réservée, ne rien faire
    if (currentSpot.isOccupied || currentSpot.isReserved) {
      return;
    }

    // Au lieu de changer directement le statut, ouvrir le popup
    setSelectedSpotId(id);
    setIsReservationPopupOpen(true);
  };

  const renderParkingContainer = () => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        border: "8px solid #aaa",
        borderRadius: "10px",
        pointerEvents: "none",
        boxSizing: "border-box",
        zIndex: -1,
      }}
    >
      {/* Légende du parking */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px",
          borderRadius: "5px",
          fontSize: "14px",
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
          {parkingInfo.name} - {parkingInfo.availableSpots}/
          {parkingInfo.totalSpots} places disponibles
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#2ecc71",
              marginRight: "5px",
              borderRadius: "2px",
            }}
          ></div>
          <span>Disponible</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#f39c12",
              marginRight: "5px",
              borderRadius: "2px",
            }}
          ></div>
          <span>Réservé</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#e74c3c",
              marginRight: "5px",
              borderRadius: "2px",
            }}
          ></div>
          <span>Occupé</span>
        </div>
      </div>

      {/* Panneau de parking */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "40px",
          height: "50px",
          backgroundColor: "#3498db",
          borderRadius: "3px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid white",
          zIndex: 10,
        }}
      >
        <span style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>
          P
        </span>
      </div>
    </div>
  );

  // Fonction pour dessiner une place de parking
  const renderParkingSpot = (spot) => {
    const spotWidth = spot.size?.width || 60;
    const spotHeight = spot.size?.height || 30;

    // Déterminer la couleur en fonction du statut
    let fillColor = "#2ecc71"; // Vert pour disponible
    let spotText = "P";
    let spotOpacity = 0.7;
    let tooltipText = "Disponible";

    if (spot.isOccupied) {
      fillColor = "#e74c3c"; // Rouge pour occupé
      spotText = "X";
      tooltipText = "Occupée";
    } else if (spot.isReserved) {
      fillColor = "#f39c12"; // Orange pour réservé
      spotText = "R";
      tooltipText = "Réservée";
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
        title={`Place ${spot.id} - ${tooltipText}`}
      >
        <svg
          width={spotWidth}
          height={spotHeight}
          viewBox={`0 0 ${spotWidth} ${spotHeight}`}
        >
          {/* Fond de la place de parking */}
          <rect
            x="2"
            y="2"
            width={spotWidth - 4}
            height={spotHeight - 4}
            rx="2"
            stroke="#fff"
            strokeWidth="2"
            fill={fillColor}
            fillOpacity={spotOpacity}
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

          {/* Marquage au sol */}
          <rect
            x={spotWidth * 0.1}
            y={spotHeight * 0.1}
            width={spotWidth * 0.8}
            height={spotHeight * 0.8}
            rx="1"
            stroke="#fff"
            strokeWidth="1"
            strokeDasharray="3,3"
            fill="none"
          />

          {/* Texte indicateur */}
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

          {/* Ajouter une voiture stylisée pour les places occupées */}
          {spot.isOccupied && (
            <g
              transform={`translate(${spotWidth / 2 - 12}, ${
                spotHeight / 2 - 6
              })`}
            >
              <rect x="2" y="3" width="20" height="10" rx="2" fill="#333" />
              <rect x="5" y="0" width="14" height="6" rx="1" fill="#555" />
              <circle cx="6" cy="13" r="2" fill="#222" />
              <circle cx="18" cy="13" r="2" fill="#222" />
            </g>
          )}
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
        {/* Entrée avec barrière */}
        {street.hasEntrance && (
          <div
            style={{
              position: "absolute",
              top: "5px",
              left: "0",
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {/* Badge Entrée */}
            <div
              style={{
                width: "26px",
                height: "26px",
                backgroundColor: "#3498db",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "5px",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}
              >
                E
              </span>
            </div>

            {/* Barrière d'entrée */}
            <div
              style={{
                position: "relative",
                width: "60%",
                height: "8px",
                backgroundColor: "#f1c40f",
                marginLeft: "10px",
                borderRadius: "4px",
                transform: "rotate(0deg)",
                transformOrigin: "left center",
                transition: "transform 1.5s ease",
                // Animation de la barrière
                animation: "barrierEntrance 8s infinite",
              }}
            >
              <style>
                {`
                  @keyframes barrierEntrance {
                    0%, 50%, 100% { transform: rotate(0deg); }
                    12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-90deg); }
                  }
                `}
              </style>
              {/* Rayures sur la barrière */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "repeating-linear-gradient(45deg, #f1c40f, #f1c40f 5px, #e74c3c 5px, #e74c3c 10px)",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}

        {/* Sortie avec barrière */}
        {street.hasExit && (
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              right: "0",
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {/* Barrière de sortie */}
            <div
              style={{
                position: "relative",
                width: "60%",
                height: "8px",
                backgroundColor: "#f1c40f",
                marginRight: "10px",
                borderRadius: "4px",
                transform: "rotate(0deg)",
                transformOrigin: "right center",
                transition: "transform 1.5s ease",
                // Animation de la barrière avec décalage
                animation: "barrierExit 8s infinite",
              }}
            >
              <style>
                {`
                  @keyframes barrierExit {
                    0%, 50%, 100% { transform: rotate(0deg); }
                    25%, 75% { transform: rotate(90deg); }
                  }
                `}
              </style>
              {/* Rayures sur la barrière */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "repeating-linear-gradient(45deg, #f1c40f, #f1c40f 5px, #e74c3c 5px, #e74c3c 10px)",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Badge Sortie */}
            <div
              style={{
                width: "26px",
                height: "26px",
                backgroundColor: "#e74c3c",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5px",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}
              >
                S
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Chargement du parking...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center h-screen w-screen bg-gray-100 p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Notification de mise à jour */}
      {updateStatus && (
        <div
          className={`absolute top-4 p-2 rounded-md text-center transition-all ${
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

      {/* Zone de visualisation du parking */}
      <div
        ref={containerRef}
        className="bg-gray-800 rounded-lg overflow-hidden relative shadow-xl"
        style={{
          width: "800px",
          height: "600px",
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsMouseOverVisualization(true)}
        onMouseLeave={() => setIsMouseOverVisualization(false)}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#3a3a3a",
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            zIndex: -2,
          }}
        />
        {renderParkingContainer()}
        <div
          style={{
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: "top left",
            position: "absolute",
          }}
        >
          {streets.map(renderStreet)}
          {arrows.map(renderArrow)}
          {parkingSpots.map(renderParkingSpot)}
        </div>

        {/* Contrôles de zoom */}
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "5px",
            padding: "5px",
            zIndex: 5,
          }}
        >
          <button
            onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "3px",
              margin: "2px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            +
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev / 1.2))}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "3px",
              margin: "2px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            -
          </button>
          <button
            onClick={calculateInitialView}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "3px",
              margin: "2px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            R
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingLiveView;
