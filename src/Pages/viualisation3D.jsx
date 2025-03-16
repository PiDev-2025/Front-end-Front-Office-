import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ParkingSpot from "./ParkingSpot";
import Street from "./Street";
import ParkingArea from "./ParkingArea";

const ParkingPlan = () => {
  const gridSize = 50; // Match the grid size in ParkingArea
  
  // État pour les places de parking - initialisé avec 1 seule place
  const [parkingSpots, setParkingSpots] = useState([
    {
      id: "parking-spot-0",
      position: { left: gridSize * 3, top: gridSize * 3 },
      rotation: 0,
      size: { width: 60, height: 120 },
      isOccupied: false
    }
  ]);
  
  // État pour les rues - initialisé avec 1 seule rue
  const [streets, setStreets] = useState([
    {
      id: "street-1",
      position: { left: gridSize * 5, top: gridSize * 5 },
      rotation: 0,
      width: 80,
      length: 300,
      hasEntrance: false,
      hasExit: false
    }
  ]);
  
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
    setParkingSpots(parkingSpots.filter(spot => spot.id !== id));
  };
  
  // Ajoutez une nouvelle place de parking
  const addNewParkingSpot = () => {
    const newId = `parking-spot-${parkingSpots.length}`;
    const newSpot = {
      id: newId,
      position: { left: gridSize * 2, top: gridSize * 2 },
      rotation: 0,
      size: { width: 60, height: 120 },
      isOccupied: false
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
        street.id === id ? { ...street, hasEntrance: !street.hasEntrance } : street
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
      hasExit: false
    };
    
    setStreets([...streets, newStreet]);
  };
  
  // Supprimer une rue
  const removeStreet = (id) => {
    setStreets(streets.filter(street => street.id !== id));
  };

  return (
    <div style={{ padding: "20px", marginLeft :"30px", marginTop:"120px" }}>
      <h1>Plan de Parking Interactif</h1>
      
      <div style={{ 
  
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%"
      }}>
        {/* Colonne de gauche pour les boutons - largeur augmentée */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "10px", 
          width: "350px", 
          marginRight: "50px"
          
        }}>
          <button
            onClick={addNewStreet}
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Ajouter une nouvelle rue
          </button>
          
          <button
            onClick={addNewParkingSpot}
            style={{
              padding: "10px 15px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Ajouter une place de parking
          </button>
          
          <div style={{ marginTop: "20px", backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "4px" }}>
            <p>Nombre de places: {parkingSpots.length}</p>
            <p>Nombre de rues: {streets.length}</p>
            <p>Portes d'entrée: {streets.filter(s => s.hasEntrance).length}</p>
            <p>Portes de sortie: {streets.filter(s => s.hasExit).length}</p>
          </div>
          
        </div>
        
        {/* Colonne de droite pour le ParkingArea - largeur ajustée */}
        <div style={{ 
          width: "calc(100% - 330px)",
          maxWidth: "1600px"
        }}>
          <DndProvider backend={HTML5Backend}>
            <ParkingArea
              onDropParkingSpot={updateParkingSpotPosition}
              onDropStreet={updateStreetPosition}
              style={{ 
                width: "100%", 
                height: "800px", 
                backgroundColor: "#222",
                border: "2px solid #444"
              }}
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