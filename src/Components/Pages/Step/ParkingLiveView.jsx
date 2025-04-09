import React, { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ParkingPlan2D = ({ parkingId: propParkingId, onSpotSelected }) => {
  const { id: urlParkingId } = useParams(); // Si utilisation de React Router
  const parkingId = propParkingId || urlParkingId;
  const navigate = useNavigate();
  const gridSize = 50;
  const [arrows, setArrows] = useState([]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const parkingAreaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parkingInfo, setParkingInfo] = useState({
    name: "Parking",
    totalSpots: 0,
    availableSpots: 0,
  });

  // État pour les places de parking
  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState("");
  const [highlightedSpot, setHighlightedSpot] = useState(null);
  // État pour les rues
  const [streets, setStreets] = useState([]);

  // État pour l'image du logo
  const [showLogo, setShowLogo] = useState(true);

  // Initialiser les places de parking par défaut
  useEffect(() => {
    if (!parkingId) {
      setLoading(false);
    }
  }, []);

  // Chargement du parking existant si parkingId est fourni
  useEffect(() => {
    if (parkingId) {
      loadParkingData();
    }
  }, [parkingId]);

  // Fonction pour charger les données du parking existant
  const loadParkingData = async () => {
    try {
      setLoading(true);
      console.log("Chargement des données du parking:", parkingId);

      const response = await axios.get(
        `http://localhost:3001/parkings/parkings/${parkingId}`
      );
      const parkingData = response.data;

      if (parkingData.layout?.viewSettings) {
        const {
          scale: dbScale,
          offsetX,
          offsetY,
        } = parkingData.layout.viewSettings;
        if (dbScale) setScale(dbScale - 0.15);
        if (offsetX !== undefined && offsetY !== undefined) {
          setOffset({ x: offsetX, y: offsetY });
        }
        console.log("Loaded view settings:", {
          scale: dbScale,
          offset: { x: offsetX, y: offsetY },
        });
      } else {
        console.log("No view settings found, using defaults");
      }
      // Formatage des places de parking avec support pour les places réservées
      const formattedSpots = parkingData.spots.map((spot) => ({
        id: spot.id,
        position: { left: spot.x, top: spot.y },
        rotation: spot.rotation || 0,
        size: { width: spot.width || 60, height: spot.height || 120 },
        isOccupied: spot.status === "occupied",
        isReserved: spot.status === "reserved",
      }));
      setParkingSpots(formattedSpots);

      // Formatage des rues
      if (
        parkingData.layout?.streets &&
        parkingData.layout.streets.length > 0
      ) {
        const formattedStreets = parkingData.layout.streets.map((street) => ({
          id: street.id,
          position: { left: street.x, top: street.y },
          rotation: street.rotation || 0,
          width: street.width || 80,
          length: street.length || 300,
          hasEntrance: street.hasEntrance || false,
          hasExit: street.hasExit || false,
          isDashed: true,
        }));
        setStreets(formattedStreets);
      } else {
        console.log("Aucune rue trouvée dans les données du parking");
        setStreets([]);
      }

      // Formatage des flèches corrigé pour correspondre à l'ancien code
      if (parkingData.layout?.arrows && parkingData.layout.arrows.length > 0) {
        const formattedArrows = parkingData.layout.arrows.map((arrow) => ({
          id: arrow.id,
          position: { left: arrow.x, top: arrow.y },
          rotation: arrow.rotation || 0,
          size: {
            width: arrow.width || 20,
            height: arrow.length || 60,
          },
          color: arrow.color || "#FFFFFF",
        }));
        console.log("Arrow data from API:", parkingData.layout.arrows);
        console.log("Formatted Arrows:", formattedArrows);
        setArrows(formattedArrows);
      } else {
        console.log("Aucune flèche trouvée dans les données du parking");
        setArrows([]);
      }

      // Ajouter les informations du parking
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
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, 3));
  };
  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.2, 0.3));
  };
  // Toggle logo visibility
  const toggleLogo = () => {
    setShowLogo(!showLogo);
  };
  // Reset zoom and pan
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };
  const handleDrop = (e) => {
    const itemType = e.dataTransfer.getData("itemType");
    const rect = e.currentTarget.getBoundingClientRect();
    const left = (e.clientX - rect.left) / scale - offset.x;
    const top = (e.clientY - rect.top) / scale - offset.y;
    // Aligner sur la grille
    const gridAlignedLeft = Math.round(left / gridSize) * gridSize;
    const gridAlignedTop = Math.round(top / gridSize) * gridSize;
    if (itemType === "street") {
      // Ajouter une nouvelle rue à la position de drop
      const id = `street-${streets.length + 1}`;
      const newStreet = {
        id,
        position: { left: gridAlignedLeft, top: gridAlignedTop },
        rotation: 0,
        width: 80,
        length: 300,
        hasEntrance: false,
        hasExit: false,
        isDashed: true,
      };
      setStreets([...streets, newStreet]);
    } else if (itemType === "parkingSpot") {
      // Ajouter une nouvelle place à la position de drop
      const newId = `parking-spot-${parkingSpots.length}`;
      const newSpot = {
        id: newId,
        position: { left: gridAlignedLeft, top: gridAlignedTop },
        rotation: 0,
        size: { width: 60, height: 120 },
        isOccupied: false,
        isReserved: false,
      };
      setParkingSpots([...parkingSpots, newSpot]);
    } else if (itemType === "arrow") {
      // Ajouter une nouvelle flèche à la position de drop
      const id = `arrow-${arrows.length + 1}`;
      const newArrow = {
        id,
        position: { left: gridAlignedLeft, top: gridAlignedTop },
        rotation: 0,
        size: { width: 20, height: 60 },
        color: "#FFFFFF",
      };
      setArrows([...arrows, newArrow]);
    }
  };
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;
      setOffset((prev) => ({
        x: prev.x + dx / scale,
        y: prev.y + dy / scale,
      }));
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault(); // Nécessaire pour permettre le drop
  };

  // Dessine une grille de fond pour meilleure visualisation
  const renderGrid = () => {
    const gridLines = [];
    const gridCount = 30; // Nombre de lignes dans chaque direction

    for (let i = 0; i <= gridCount; i++) {
      // Lignes horizontales
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * gridSize}
          x2={gridCount * gridSize}
          y2={i * gridSize}
          stroke="#333"
          strokeWidth={0.5}
        />
      );

      // Lignes verticales
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={i * gridSize}
          y1={0}
          x2={i * gridSize}
          y2={gridCount * gridSize}
          stroke="#333"
          strokeWidth={0.5}
        />
      );
    }

    return (
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {gridLines}
      </svg>
    );
  };

  const locateParkingSpot = () => {
    // Si l'entrée est vide, annuler la mise en surbrillance
    if (!selectedSpotId.trim()) {
      setHighlightedSpot(null);
      return;
    }

    // Format de recherche complet (ex: "parking-spot-42")
    const fullId = selectedSpotId.startsWith("parking-spot-")
      ? selectedSpotId
      : `parking-spot-${selectedSpotId}`;

    // Vérifier si la place existe
    const spotExists = parkingSpots.some((spot) => spot.id === fullId);

    if (spotExists) {
      setHighlightedSpot(fullId);

      // Trouver la place pour ajuster la vue si nécessaire
      const targetSpot = parkingSpots.find((spot) => spot.id === fullId);
      if (targetSpot) {
        // Centrer la vue sur la place sélectionnée
        setOffset({
          x: -targetSpot.position.left + 400 / scale - 30,
          y: -targetSpot.position.top + 200 / scale - 60,
        });
      }
    } else {
      alert(`La place de parking ${selectedSpotId} n'existe pas.`);
      setHighlightedSpot(null);
    }
  };

  // Rendu personnalisé pour les places de parking avec support pour places réservées
  const ParkingSpotRender = ({
    id,
    position,
    rotation,
    size,
    isOccupied,
    isReserved,
  }) => {
    // Extraire le numéro de la place depuis l'ID
    const spotNumber = id.replace("parking-spot-", "");

    // Déterminer si cette place est en surbrillance
    const isHighlighted = highlightedSpot === id;

    // Déterminer le style en fonction du statut
    let bgColor, borderStyle, statusText;

    if (isHighlighted) {
      // Style pour la place mise en surbrillance
      bgColor = "#3498db"; // Bleu vif
      borderStyle = "3px solid #2980b9";
      statusText = "Sélectionnée";
    } else if (isOccupied) {
      bgColor = "#e74c3c"; // Rouge pour occupé
      borderStyle = "2px solid #c0392b";
      statusText = "Occupée";
    } else if (isReserved) {
      bgColor = "#f39c12"; // Orange pour réservé
      borderStyle = "2px solid #d35400";
      statusText = "Réservée";
    } else {
      bgColor = "transparent";
      borderStyle = "2px dashed rgba(255, 255, 255, 0.7)";
      statusText = "Libre";
    }

    return (
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          width: size.width,
          height: size.height,
          transform: `rotate(${rotation}deg)`,
          backgroundColor: bgColor,
          border: borderStyle,
          borderRadius: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: isHighlighted || isOccupied || isReserved ? "white" : "#8cf",
          fontWeight: "bold",
          boxShadow: isHighlighted
            ? "0 0 15px 5px rgba(52,152,219,0.7)"
            : isOccupied || isReserved
            ? "0 2px 5px rgba(0,0,0,0.2)"
            : "none",
          transition: "all 0.3s ease",
          zIndex: isHighlighted ? 10 : 1,
        }}
        title={`Place ${spotNumber} - ${statusText}`}
      >
        <span
          style={{
            fontSize: "14px",
            backgroundColor: isHighlighted
              ? "rgba(0, 0, 0, 0.3)"
              : isOccupied || isReserved
              ? "transparent"
              : "rgba(0, 0, 0, 0.5)",
            padding: "2px 5px",
            borderRadius: "3px",
          }}
        >
          {spotNumber}
        </span>
      </div>
    );
  };

  // In ParkingPlan2D
  const goToReservationDetails = () => {
    if (!highlightedSpot) {
      alert("Veuillez sélectionner une place de parking d'abord.");
      return;
    }
    onSpotSelected(highlightedSpot); // Utilisez directement onSpotSelected
  };
  // Rendu personnalisé pour les rues - Amélioré pour mieux correspondre à l'ancien code
  const StreetRender = (street) => {
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
  // Rendu des flèches directionnelles - Corrigé pour utiliser correctement les dimensions
  const ArrowRender = ({ id, position, rotation, size, color }) => {
    const arrowWidth = size.width || 20;
    const arrowHeight = size.height || 60;
    const arrowColor = color || "#FFFFFF";
    return (
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          width: arrowHeight,
          height: arrowWidth,
          transform: `rotate(${rotation}deg)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transformOrigin: "center center",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <svg
          width={arrowHeight}
          height={arrowWidth}
          viewBox={`0 0 ${arrowHeight} ${arrowWidth}`}
        >
          <rect
            x="0"
            y={arrowWidth / 2 - 1.5}
            width={arrowHeight - 10}
            height="3"
            fill={arrowColor}
          />
          <polygon
            points={`${arrowHeight - 10},${arrowWidth / 2 - 8} ${arrowHeight},${
              arrowWidth / 2
            } ${arrowHeight - 10},${arrowWidth / 2 + 8}`}
            fill={arrowColor}
          />
        </svg>
      </div>
    );
  };
  const ParkingLogo = () => {
    return (
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          zIndex: 10,
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          transformOrigin: "top left",
          opacity: 0.85,
          transition: "opacity 0.3s ease",
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
      >
        <img
          src="https://res.cloudinary.com/dpcyppzpw/image/upload/v1743138127/Parking_Sign_Flat_Style_laycjb.jpg"
          alt="Parking Logo"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "4px",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  // Afficher un indicateur de chargement pendant le chargement des données
  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          fontSize: "18px",
          color: "#2c3e50",
        }}
      >
        Chargement du plan de parking...
      </div>
    );
  }

  // Afficher un message d'erreur si le chargement a échoué
  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          fontSize: "18px",
          color: "#e74c3c",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className="parking-plan-container"
      style={{
        padding: "20px",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centre horizontalement tous les éléments
        width: "100%",
      }}
    >
      <div
        className="parking-spot-locator"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
          width: "800px",
          maxWidth: "100%",
        }}
      >
        <label
          htmlFor="spotLocator"
          style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#2c3e50",
          }}
        >
          Numéro de place:
        </label>
        <input
          id="spotLocator"
          type="text"
          value={selectedSpotId}
          onChange={(e) => setSelectedSpotId(e.target.value)}
          placeholder="ex: 42"
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #bdc3c7",
            width: "100px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={locateParkingSpot}
          style={{
            padding: "8px 15px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Localiser
        </button>
        <button
          onClick={goToReservationDetails}
          disabled={!highlightedSpot}
          style={{
            padding: "8px 15px",
            backgroundColor: highlightedSpot ? "#2ecc71" : "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: highlightedSpot ? "pointer" : "not-allowed",
            opacity: highlightedSpot ? 1 : 0.7,
          }}
        >
          Go to Reservation Details
        </button>
      </div>
      <div
        className="parking-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          width: "800px", // Même largeur que le plan
          maxWidth: "100%", // Responsive
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#2c3e50", fontWeight: "bold" }}>
            {parkingInfo.name}
          </h1>
          <div style={{ marginTop: "8px", color: "#7f8c8d" }}>
            <span style={{ marginRight: "15px" }}>
              <strong>Total:</strong> {parkingInfo.totalSpots} places
            </span>
            <span>
              <strong>Disponibles:</strong> {parkingInfo.availableSpots} places
            </span>
          </div>
        </div>
        <div
          className="parking-controls"
          style={{ display: "flex", gap: "10px" }}
        >
          <button
            onClick={zoomOut}
            style={{
              padding: "8px 12px",
              backgroundColor: "#34495e",
              color: "white",
              border: "none",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔍</span>
            <span style={{ fontSize: "18px" }}>−</span>
          </button>
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#ecf0f1",
              color: "#2c3e50",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={zoomIn}
            style={{
              padding: "8px 12px",
              backgroundColor: "#34495e",
              color: "white",
              border: "none",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔍</span>
            <span style={{ fontSize: "18px" }}>+</span>
          </button>
          <button
            onClick={resetView}
            style={{
              padding: "8px 12px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔄</span>
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div
          ref={parkingAreaRef}
          style={{
            width: "800px",
            height: "400px",
            backgroundColor: "#1c1c24",
            border: "1px solid #16213e",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            margin: "0 auto", // Centre le plan
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div
            style={{
              transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
              transformOrigin: "top left",
              transition: isDragging ? "none" : "transform 0.1s ease",
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          >
            {renderGrid()}
            {/* Rendu des rues */}
            {streets.map((street) => (
              <StreetRender
                key={street.id}
                id={street.id}
                position={street.position}
                rotation={street.rotation}
                width={street.width}
                length={street.length}
                hasEntrance={street.hasEntrance}
                hasExit={street.hasExit}
                isDashed={street.isDashed}
              />
            ))}
            {/* Rendu des flèches - Corrigé */}
            {arrows.map((arrow) => (
              <ArrowRender
                key={arrow.id}
                id={arrow.id}
                position={arrow.position}
                rotation={arrow.rotation}
                size={arrow.size}
                color={arrow.color}
              />
            ))}

            {/* Rendu des places de parking avec support pour places réservées */}
            {parkingSpots.map((spot) => (
              <ParkingSpotRender
                key={spot.id}
                id={spot.id}
                position={spot.position}
                rotation={spot.rotation}
                size={spot.size}
                isOccupied={spot.isOccupied}
                isReserved={spot.isReserved}
              />
            ))}
          </div>
          {showLogo && <ParkingLogo />}

          {/* Indicateur de coordonnées */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            Échelle: {scale.toFixed(2)}x | Pos: {Math.round(offset.x)},{" "}
            {Math.round(offset.y)}
          </div>
        </div>
      </DndProvider>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "25px",
              height: "20px",
              border: "2px dashed rgba(100, 100, 100, 1)",
              borderRadius: "2px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#8cf",
                textAlign: "center",
                display: "block",
              }}
            >
              P
            </span>
          </div>
          <span>Place libre</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#e74c3c",
              borderRadius: "2px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "white",
                textAlign: "center",
                display: "block",
              }}
            >
              X
            </span>
          </div>
          <span>Place occupée</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#f39c12",
              borderRadius: "2px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "white",
                textAlign: "center",
                display: "block",
              }}
            >
              R
            </span>
          </div>
          <span>Place réservée</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#3a3a3a",
              borderRadius: "2px",
            }}
          ></div>
          <span>Rue</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#3498db",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
              color: "white",
              borderRadius: "50%",
            }}
          >
            E
          </div>
          <span>Entrée</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#e74c3c",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
              color: "white",
              borderRadius: "50%",
            }}
          >
            S
          </div>
          <span>Sortie</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingPlan2D;
