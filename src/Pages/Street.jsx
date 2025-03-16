import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const Street = ({ id, position, rotation, width, length, updatePosition, updateRotation, updateDimensions, onRemove, hasEntrance, hasExit, toggleEntrance, toggleExit }) => {
  const [showControls, setShowControls] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);
  const streetRef = useRef(null);

  // Utilisation simple de useDrag comme dans ParkingSpot
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STREET,
    item: {
      id,
      type: ItemTypes.STREET,
      left: position.left,
      top: position.top,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Appliquer la référence à l'élément
  drag(streetRef);

  const rotate = (clockwise) => {
    const degreeStep = 15;
    const newRotation = rotation + (clockwise ? degreeStep : -degreeStep) * (Math.PI / 180);
    updateRotation(id, newRotation);
  };

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    setResizing(direction);
    setResizeStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = (e) => {
    if (!resizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    let newWidth = width;
    let newLength = length;

    if (resizing === "width") {
      newWidth = Math.max(50, width + deltaX);
    } else if (resizing === "length") {
      newLength = Math.max(100, length + deltaY);
    }

    updateDimensions(id, newWidth, newLength);
    setResizeStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeEnd = () => {
    setResizing(null);
  };

  // Fonction pour déplacer la rue avec les touches du clavier
  const handleKeyDown = (e) => {
    if (!isSelected) return;
    
    const step = 10; // Pas de déplacement en pixels
    const { left, top } = position;
    
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        updatePosition(id, { left, top: top - step });
        break;
      case "ArrowDown":
        e.preventDefault();
        updatePosition(id, { left, top: top + step });
        break;
      case "ArrowLeft":
        e.preventDefault();
        updatePosition(id, { left: left - step, top });
        break;
      case "ArrowRight":
        e.preventDefault();
        updatePosition(id, { left: left + step, top });
        break;
      case "r":
        e.preventDefault();
        rotate(true); // Rotation dans le sens horaire
        break;
      case "R":
        e.preventDefault();
        rotate(false); // Rotation dans le sens anti-horaire
        break;
      case "Delete":
      case "Backspace":
        e.preventDefault();
        onRemove(id);
        break;
      default:
        break;
    }
  };

  // Gestionnaire de clic pour sélectionner la rue
  const handleClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    setShowControls(true);
  };

  // Gestionnaire de focus pour l'élément de rue
  const handleFocus = () => {
    setIsSelected(true);
    setShowControls(true);
  };

  // Gestionnaire de perte de focus pour l'élément de rue
  const handleBlur = (e) => {
    // Vérifier si le focus est passé à un élément enfant
    if (streetRef.current && streetRef.current.contains(e.relatedTarget)) {
      return;
    }
    setIsSelected(false);
    setShowControls(false);
  };

  // Ajouter les écouteurs d'événements pour le clavier
  useEffect(() => {
    if (isSelected) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isSelected, position]);

  // Gérer les événements de redimensionnement
  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [resizing]);

  return (
    <div
      ref={streetRef}
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        zIndex: isSelected ? 1000 : 0,
        userSelect: "none",
        transformOrigin: "center center",
        outline: "none", // Force à ne jamais avoir de outline
        border: "none"   // Force à ne jamais avoir de bordure
      }}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isSelected && !resizing && setShowControls(false)}
      data-handler="true"
      tabIndex="0" // Permet à l'élément de recevoir le focus
    >

      {/* Le contenu principal de la rue */}
      <div
        style={{
          width: `${width}px`,
          height: `${length}px`,
          transform: `rotate(${rotation}rad)`,
          position: "relative",
          outline: "none", // Force à ne jamais avoir de outline
          border: "none"   // Force à ne jamais avoir de bordure
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${length}`}
          style={{ 
            pointerEvents: "none",
            outline: "none", // Force à ne jamais avoir de outline
            border: "none"   // Force à ne jamais avoir de bordure
          }}
        >
          <rect
            x="0"
            y="0"
            width={width}
            height={length}
            fill="#555"
            stroke="none" // Supprime le contour du rectangle
          />
          <line
            x1={width / 2}
            y1="0"
            x2={width / 2}
            y2={length}
            stroke="#fff"
            strokeWidth="2"
            strokeDasharray="10,10"
          />
          
          {/* Porte d'entrée en haut */}
          {hasEntrance && (
            <g>
              <rect
                x={width / 2 - 15}
                y="0"
                width="30"
                height="20"
                fill="#4CAF50"
                stroke="#FFF"
                strokeWidth="2"
              />
              <polygon
                points={`${width / 2},5 ${width / 2 - 10},15 ${width / 2 + 10},15`}
                fill="#FFF"
              />
              <text
                x={width / 2}
                y="35"
                textAnchor="middle"
                fill="#FFF"
                fontSize="12"
                fontWeight="bold"
              >
                ENTRÉE
              </text>
            </g>
          )}
          
          {/* Porte de sortie en bas */}
          {hasExit && (
            <g>
              <rect
                x={width / 2 - 15}
                y={length - 20}
                width="30"
                height="20"
                fill="#F44336"
                stroke="#FFF"
                strokeWidth="2"
              />
              <polygon
                points={`${width / 2},${length - 5} ${width / 2 - 10},${length - 15} ${width / 2 + 10},${length - 15}`}
                fill="#FFF"
              />
              <text
                x={width / 2}
                y={length - 30}
                textAnchor="middle"
                fill="#FFF"
                fontSize="12"
                fontWeight="bold"
              >
                SORTIE
              </text>
            </g>
          )}
        </svg>

        {/* Poignées de redimensionnement visibles uniquement avec les contrôles */}
        {showControls && (
          <>
            <div
              style={{
                position: "absolute",
                right: "-10px",
                top: "50%",
                width: "20px",
                height: "20px",
                backgroundColor: "#fff",
                border: "1px solid #000",
                borderRadius: "50%",
                transform: "translateY(-50%)",
                cursor: "ew-resize",
                zIndex: 100,
              }}
              onMouseDown={(e) => handleResizeStart(e, "width")}
            />

            <div
              style={{
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                width: "20px",
                height: "20px",
                backgroundColor: "#fff",
                border: "1px solid #000",
                borderRadius: "50%",
                transform: "translateX(-50%)",
                cursor: "ns-resize",
                zIndex: 100,
              }}
              onMouseDown={(e) => handleResizeStart(e, "length")}
            />
          </>
        )}
      </div>

      {/* Boutons de contrôle */}
      {showControls && (
        <div style={{
          position: "absolute",
          top: `-40px`,
          left: `${width/2 - 120}px`,
          display: "flex",
          gap: "10px",
          zIndex: 1001,
          transform: `rotate(${rotation}rad)`,
          width: "240px",
          justifyContent: "center"
        }}>
          {/* Bouton de suppression */}
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#ff6b6b",
              color: "white",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
          >
            ✕
          </button>
          
          {/* Bouton de rotation gauche */}
          <button
            style={buttonStyle}
            onClick={(e) => {
              e.stopPropagation();
              rotate(false);
            }}
          >
            ↺
          </button>
          
          {/* Bouton de rotation droite */}
          <button
            style={buttonStyle}
            onClick={(e) => {
              e.stopPropagation();
              rotate(true);
            }}
          >
            ↻
          </button>
          
          {/* Bouton pour ajouter/supprimer une porte d'entrée */}
          <button
            style={{
              ...buttonStyle,
              backgroundColor: hasEntrance ? "#4CAF50" : "#ddd",
              color: hasEntrance ? "white" : "black",
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleEntrance(id);
            }}
          >
            E
          </button>
          
          {/* Bouton pour ajouter/supprimer une porte de sortie */}
          <button
            style={{
              ...buttonStyle,
              backgroundColor: hasExit ? "#F44336" : "#ddd",
              color: hasExit ? "white" : "black",
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExit(id);
            }}
          >
            S
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  cursor: "pointer",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  fontWeight: "bold",
};

export default Street;