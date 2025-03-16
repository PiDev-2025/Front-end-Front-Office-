import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const ParkingArea = ({ children, onDropParkingSpot, onDropStreet }) => {
  const [isDraggingScene, setIsDraggingScene] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });

  // Grid size - 50px
  const gridSize = 50;

  // Gestion du drag pour déplacer le plan
  const handleMouseDown = (e) => {
    if (e.button === 0 && !e.target.closest('button') && !e.target.closest('[data-handler]')) {
      setIsDraggingScene(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingScene) {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;

      setViewOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingScene(false);
  };

  // Gestion du drop pour les places de parking et les rues
  const [, drop] = useDrop({
    accept: [ItemTypes.PARKING_SPOT, ItemTypes.STREET],
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();

      const snapToGrid = true;
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);

      if (snapToGrid) {
        left = Math.round(left / gridSize) * gridSize;
        top = Math.round(top / gridSize) * gridSize;
      }

      if (item.type === ItemTypes.PARKING_SPOT) {
        onDropParkingSpot(item.id, { left, top });
      } else if (item.type === ItemTypes.STREET) {
        onDropStreet(item.id, { left, top });
      }

      return undefined;
    },
  });

  return (
    <div
      id="parking-area"
      ref={drop}
      style={{
        width: "95%",
        height: "600px",
        position: "relative",
        overflow: "hidden",
        background: "#333333",
        cursor: isDraggingScene ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Plan de parking transformé */}
      <div style={{
        position: "absolute",
        width: "120%",
        height: "100%",
        transform: `translate(${viewOffset.x}px, ${viewOffset.y}px)`,
        transformOrigin: "center center",
      }}>
        {/* Grille de base */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#555" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {children}
      </div>
    </div>
  );
};

export default ParkingArea;
