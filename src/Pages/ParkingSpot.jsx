import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const ParkingSpot = ({ id, position, rotation, size, isOccupied, updatePosition, updateRotation, toggleOccupancy, onRemove }) => {
  const [showControls, setShowControls] = useState(false);
  
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
    const newRotation = rotation + (clockwise ? degreeStep : -degreeStep) * (Math.PI / 180);
    updateRotation(id, newRotation);
  };
  
  const spotWidth = size?.width || 60;
  const spotHeight = size?.height || 30;
  
  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        display: "flex",
        alignItems: "center",
        gap: "5px",
        zIndex: isDragging ? 1000 : 1,
        cursor: "move",
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
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