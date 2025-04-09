import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./Editeur/ItemType";

const ParkingSpot = ({
  id,
  position,
  rotation,
  size,
  isOccupied,
  updatePosition,
  updateRotation,
  toggleOccupancy,
  onRemove,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // Nouvel état pour afficher le message
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PARKING_SPOT,
    item: {
      id,
      type: ItemTypes.PARKING_SPOT,
      left: position.left,
      top: position.top,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const rotate = (clockwise) => {
    const degreeStep = 10;
    const newRotation =
      rotation + (clockwise ? degreeStep : -degreeStep) * (Math.PI / 180);
    updateRotation(id, newRotation);
  };

  const spotWidth = size?.width || 60;
  const spotHeight = size?.height || 30;

  // Gère les touches fléchées uniquement si le spot est sélectionné
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSelected) return;

      const step = 5;
      let newLeft = position.left;
      let newTop = position.top;

      switch (e.key) {
        case "ArrowUp":
          newTop -= step;
          break;
        case "ArrowDown":
          newTop += step;
          break;
        case "ArrowLeft":
          newLeft -= step;
          break;
        case "ArrowRight":
          newLeft += step;
          break;
        default:
          return;
      }

      updatePosition(id, { left: newLeft, top: newTop });
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, position, id, updatePosition]);

  // Gère le désélection automatique en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsSelected(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={(node) => {
        drag(node);
        ref.current = node;
      }}
      tabIndex={0}
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        display: "flex",
        alignItems: "center",
        gap: "5px",
        zIndex: isDragging ? 1000 : 1,
        cursor: "move",
        outline: isSelected ? "2px solid" : "none",
      }}
      onMouseEnter={() => {
        setShowControls(true);
        setShowMessage(true); // Affiche le message lorsque le curseur entre
      }}
      onMouseLeave={() => {
        setShowControls(false);
        setShowMessage(false); // Masque le message lorsque le curseur quitte
      }}
      onDoubleClick={() => {
        ref.current?.focus();
        setIsSelected(true);
      }}
    >
      {/* Affiche le message "Double click to select" si le curseur est dessus */}
      {showMessage && (
        <div
          style={{
            position: "absolute",
            top: `${spotHeight + 10}px`, // Placer le message juste en dessous du parking spot
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            opacity: showMessage ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          Double click to select
        </div>
      )}

      {showControls && (
        <button
          style={buttonStyle}
          onClick={(e) => {
            e.stopPropagation();
            rotate(false);
          }}
        >
          ↺
        </button>
      )}

      <div
        style={{
          width: `${spotWidth}px`,
          height: `${spotHeight}px`,
          userSelect: "none",
          opacity: isDragging ? 0.5 : 1,
          transform: `rotate(${rotation}rad)`,
          transformOrigin: "center center",
        }}
        onClick={() => toggleOccupancy(id)}
      >
        <svg
          width={spotWidth}
          height={spotHeight}
          viewBox={`0 0 ${spotWidth} ${spotHeight}`}
          style={{ pointerEvents: "none" }}
        >
          <rect
            x="2"
            y="2"
            width={spotWidth - 4}
            height={spotHeight - 4}
            rx="2"
            stroke="#fff"
            strokeWidth="2"
            strokeDasharray="5,3"
            fill={isOccupied ? "#e74c3c" : "#444"}
            fillOpacity={isOccupied ? "0.7" : "0.3"}
          />
          <text
            x={spotWidth / 2}
            y={spotHeight / 2}
            fontSize="14"
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {isOccupied ? "X" : "P"}
          </text>
        </svg>
      </div>

      {showControls && (
        <>
          <button
            style={buttonStyle}
            onClick={(e) => {
              e.stopPropagation();
              rotate(true);
            }}
          >
            ↻
          </button>

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
        </>
      )}
    </div>
  );
};

const buttonStyle = {
  cursor: "pointer",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "auto",
  fontSize: "12px",
  zIndex: 10,
};

export default ParkingSpot;