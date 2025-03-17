import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ParkingSpot from "../ParkingSpot";
import Street from "./Street";
import ParkingArea from "./ParkingArea";
import axios from "axios";
import { useParams } from "react-router-dom";

const ParkingPlan = ({ parkingId: propParkingId }) => {
  const { id: urlParkingId } = useParams(); // If using React Router
  const parkingId = propParkingId || urlParkingId;

  const gridSize = 50;

  // État pour les places de parking
  const [parkingSpots, setParkingSpots] = useState([]);

  // État pour les rues
  const [streets, setStreets] = useState([
    {
      id: "street-1",
      position: { left: gridSize * 5, top: gridSize * 5 },
      rotation: 0,
      width: 80,
      length: 300,
      hasEntrance: false,
      hasExit: false,
    },
  ]);

  // États pour la sauvegarde
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    console.log("ParkingPlan received parkingId:", parkingId);
  }, [parkingId]);

  // Chargement du parking existant si parkingId est fourni
  useEffect(() => {
    if (parkingId) {
      loadParkingData();
    }
  }, [parkingId]);

  // Fonction pour charger les données du parking existant
  const loadParkingData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/parkings/parkings/${parkingId}`
      );
      const parkingData = response.data;

      setParkingSpots(
        parkingData.spots.map((spot) => ({
          id: spot.id,
          position: { left: spot.x, top: spot.y },
          rotation: spot.rotation,
          size: { width: spot.width, height: spot.height },
          isOccupied: spot.status === "occupied",
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
    } catch (error) {
      console.error("Erreur lors du chargement du parking:", error);
    }
  };

  // Fonction pour convertir les données de l'éditeur au format MongoDB
  const convertToMongoDBFormat = () => {
    // Conversion des places de parking
    const spots = parkingSpots.map((spot) => ({
      id: spot.id,
      x: spot.position.left,
      y: spot.position.top,
      width: spot.size.width,
      height: spot.size.height,
      rotation: spot.rotation,
      type: "standard", // Valeur par défaut
      status: spot.isOccupied ? "occupied" : "available",
    }));

    // Conversion des rues pour le layout
    const streetData = streets.map((street) => ({
      id: street.id,
      x: street.position.left,
      y: street.position.top,
      width: street.width,
      length: street.length,
      rotation: street.rotation,
      hasEntrance: street.hasEntrance,
      hasExit: street.hasExit,
    }));

    return {
      spots,
      layout: {
        width: 1000, // Taille par défaut
        height: 800,
        backgroundColor: "#222",
        streets: streetData,
      },
      totalSpots: parkingSpots.length,
      availableSpots: parkingSpots.filter((spot) => !spot.isOccupied).length,
    };
  };

  // Fonction pour sauvegarder le parking
  const saveParkingPlan = async () => {
    if (!parkingId) {
      console.error("ID du parking non fourni");
      setSaveStatus("error");
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const parkingData = convertToMongoDBFormat();
      const response = await axios.patch(
        `http://localhost:3001/parkings/${parkingId}`,
        parkingData
      );
      console.log("Parking sauvegardé:", response.data);
      setSaveStatus("success");

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde du parking:",
        error.response?.data || error.message
      );
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Mettez à jour la position d'une place de parking
  const updateParkingSpotPosition = (id, position) => {
    setParkingSpots(
      parkingSpots.map((spot) =>
        spot.id === id ? { ...spot, position } : spot
      )
    );
  };

  // Mettez à jour la rotation d'une place de parking
  const updateParkingSpotRotation = (id, rotation) => {
    setParkingSpots(
      parkingSpots.map((spot) =>
        spot.id === id ? { ...spot, rotation } : spot
      )
    );
  };

  // Mettez à jour l'état d'occupation
  const toggleOccupancy = (id) => {
    setParkingSpots(
      parkingSpots.map((spot) =>
        spot.id === id ? { ...spot, isOccupied: !spot.isOccupied } : spot
      )
    );
  };

  // Supprimez une place de parking
  const removeParkingSpot = (id) => {
    setParkingSpots(parkingSpots.filter((spot) => spot.id !== id));
  };

  // Ajoutez une nouvelle place de parking
  const addNewParkingSpot = () => {
    const newId = `parking-spot-${parkingSpots.length}`;
    const newSpot = {
      id: newId,
      position: { left: gridSize * 2, top: gridSize * 2 },
      rotation: 0,
      size: { width: 60, height: 120 },
      isOccupied: false,
    };

    setParkingSpots([...parkingSpots, newSpot]);
  };

  // Mettez à jour la position d'une rue
  const updateStreetPosition = (id, position) => {
    setStreets(
      streets.map((street) =>
        street.id === id ? { ...street, position } : street
      )
    );
  };

  // Mettez à jour la rotation d'une rue
  const updateStreetRotation = (id, rotation) => {
    setStreets(
      streets.map((street) =>
        street.id === id ? { ...street, rotation } : street
      )
    );
  };

  // Mettez à jour les dimensions d'une rue
  const updateStreetDimensions = (id, width, length) => {
    setStreets(
      streets.map((street) =>
        street.id === id ? { ...street, width, length } : street
      )
    );
  };

  // Activer/désactiver la porte d'entrée pour une rue
  const toggleEntrance = (id) => {
    setStreets(
      streets.map((street) =>
        street.id === id
          ? { ...street, hasEntrance: !street.hasEntrance }
          : street
      )
    );
  };

  // Activer/désactiver la porte de sortie pour une rue
  const toggleExit = (id) => {
    setStreets(
      streets.map((street) =>
        street.id === id ? { ...street, hasExit: !street.hasExit } : street
      )
    );
  };

  // Ajouter une nouvelle rue
  const addNewStreet = () => {
    const id = `street-${streets.length + 1}`;
    const newStreet = {
      id,
      position: { left: gridSize * 3, top: gridSize * 3 },
      rotation: 0,
      width: 80,
      length: 300,
      hasEntrance: false,
      hasExit: false,
    };

    setStreets([...streets, newStreet]);
  };

  // Supprimer une rue
  const removeStreet = (id) => {
    setStreets(streets.filter((street) => street.id !== id));
  };

  // Gestionnaires pour le drag and drop depuis la sidebar
  const handleDragStart = (e, itemType) => {
    e.dataTransfer.setData("itemType", itemType);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Gestionnaire de drop pour la zone de travail
  const handleDrop = (e) => {
    const itemType = e.dataTransfer.getData("itemType");

    // Calculer la position relative à la zone de drop
    const rect = e.currentTarget.getBoundingClientRect();
    const left = e.clientX - rect.left;
    const top = e.clientY - rect.top;

    if (itemType === "street") {
      addNewStreet();
    } else if (itemType === "parkingSpot") {
      addNewParkingSpot();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Nécessaire pour permettre le drop
  };

  // Composants pour la sidebar
  const streetModel = (
    <div className="bg-gray-200 h-16 rounded-md flex items-center justify-center">
      <div className="bg-gray-400 h-4 w-32 rounded-sm"></div>
    </div>
  );

  const parkingSpotModel = (
    <div className="bg-gray-200 h-16 rounded-md flex items-center justify-center">
      <div className="bg-gray-400 h-10 w-10 rounded-md"></div>
    </div>
  );

  return (
    <div style={{ padding: "20px", marginLeft: "30px", marginTop: "120px" }}>
      <h1>Plan de Parking Interactif</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {/* Sidebar de style Canva */}
        <div
          style={{
            width: "250px",
            backgroundColor: "white",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: "800px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* En-tête de la sidebar */}
          <div
            style={{
              padding: "15px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <h2 style={{ fontSize: "18px", margin: 0 }}>Éléments</h2>
          </div>

          {/* Onglets */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <button
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "2px solid #2196F3",
                color: "#2196F3",
                cursor: "pointer",
              }}
            >
              Modèles
            </button>
          </div>

          {/* Contenu de la sidebar */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
            }}
          >
            {/* Section Rues */}
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "10px",
                  color: "#555",
                }}
              >
                Rues
              </h3>
              <div
                style={{
                  cursor: "move",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "5px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, "street")}
                onDragEnd={handleDragEnd}
                onClick={addNewStreet}
              >
                {streetModel}
                <p
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    marginTop: "5px",
                    color: "#666",
                  }}
                >
                  Rue
                </p>
              </div>
            </div>

            {/* Section Places de parking */}
            <div style={{ marginTop: "25px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "10px",
                  color: "#555",
                }}
              >
                Places de parking
              </h3>

              <div
                style={{
                  cursor: "move",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "5px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, "parkingSpot")}
                onDragEnd={handleDragEnd}
                onClick={addNewParkingSpot}
              >
                {parkingSpotModel}
                <p
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    marginTop: "5px",
                    color: "#666",
                  }}
                >
                  Place standard
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div
              style={{
                marginTop: "30px",
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "4px",
              }}
            >
              <p style={{ margin: "5px 0", fontSize: "13px" }}>
                Nombre de places: {parkingSpots.length}
              </p>
              <p style={{ margin: "5px 0", fontSize: "13px" }}>
                Nombre de rues: {streets.length}
              </p>
              <p style={{ margin: "5px 0", fontSize: "13px" }}>
                Portes d'entrée: {streets.filter((s) => s.hasEntrance).length}
              </p>
              <p style={{ margin: "5px 0", fontSize: "13px" }}>
                Portes de sortie: {streets.filter((s) => s.hasExit).length}
              </p>
            </div>
          </div>

          {/* Bouton de sauvegarde en bas */}
          <div
            style={{
              padding: "15px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <button
              onClick={saveParkingPlan}
              disabled={isSaving}
              style={{
                padding: "10px 15px",
                backgroundColor: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSaving ? "not-allowed" : "pointer",
                width: "100%",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {isSaving ? "Sauvegarde en cours..." : "Enregistrer le plan"}
            </button>

            {saveStatus === "success" && (
              <div
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "10px",
                  fontSize: "13px",
                }}
              >
                Plan de parking enregistré avec succès!
              </div>
            )}

            {saveStatus === "error" && (
              <div
                style={{
                  backgroundColor: "#F44336",
                  color: "white",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "10px",
                  fontSize: "13px",
                }}
              >
                Erreur lors de l'enregistrement du plan.
              </div>
            )}
          </div>
        </div>

        {/* Colonne de droite pour le ParkingArea */}
        <div
          style={{
            width: "calc(100% - 270px)",
            maxWidth: "1600px",
            marginLeft: "20px",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <ParkingArea
              onDropParkingSpot={updateParkingSpotPosition}
              onDropStreet={updateStreetPosition}
              style={{
                width: "100%",
                height: "800px",
                backgroundColor: "#222",
                border: "2px solid #444",
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Rendu des rues */}
              {streets.map((street) => (
                <Street
                  key={street.id}
                  id={street.id}
                  position={street.position}
                  rotation={street.rotation}
                  width={street.width}
                  length={street.length}
                  hasEntrance={street.hasEntrance}
                  hasExit={street.hasExit}
                  updatePosition={updateStreetPosition}
                  updateRotation={updateStreetRotation}
                  updateDimensions={updateStreetDimensions}
                  toggleEntrance={toggleEntrance}
                  toggleExit={toggleExit}
                  onRemove={removeStreet}
                />
              ))}

              {/* Rendu des places de parking */}
              {parkingSpots.map((spot) => (
                <ParkingSpot
                  key={spot.id}
                  id={spot.id}
                  position={spot.position}
                  rotation={spot.rotation}
                  size={spot.size}
                  isOccupied={spot.isOccupied}
                  updatePosition={updateParkingSpotPosition}
                  updateRotation={updateParkingSpotRotation}
                  toggleOccupancy={toggleOccupancy}
                  onRemove={removeParkingSpot}
                />
              ))}
            </ParkingArea>
          </DndProvider>
        </div>
      </div>
    </div>
  );
};

export default ParkingPlan;
