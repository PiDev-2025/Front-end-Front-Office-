import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as THREE from "three";

const ItemTypes = {
  CAR: "car",
};

// Composant de voiture 3D
const Car3D = ({ id, position, rotation, color, updatePosition, updateRotation }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const carRef = useRef(null);
  const rotationStartRef = useRef(null);
  const containerRef = useRef(null);

  // Initialisation de la scène Three.js
  useEffect(() => {
    if (!mountRef.current) return;

    // Création de la scène
    const scene = new THREE.Scene();
    
    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    
    // Création du renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(120, 120);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Création d'une voiture simple
    const carGroup = new THREE.Group();
    
    // Carrosserie
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: color || 0x3366ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carGroup.add(body);
    
    // Toit
    const roofGeometry = new THREE.BoxGeometry(1, 0.4, 0.8);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(color || 0x3366ff).multiplyScalar(0.8) });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.45;
    roof.position.x = -0.2;
    carGroup.add(roof);
    
    // Roues
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.set(0.7, -0.3, 0.5);
    wheel1.rotation.z = Math.PI / 2;
    carGroup.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.position.set(0.7, -0.3, -0.5);
    wheel2.rotation.z = Math.PI / 2;
    carGroup.add(wheel2);
    
    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.position.set(-0.7, -0.3, 0.5);
    wheel3.rotation.z = Math.PI / 2;
    carGroup.add(wheel3);
    
    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.position.set(-0.7, -0.3, -0.5);
    wheel4.rotation.z = Math.PI / 2;
    carGroup.add(wheel4);
    
    // Ajout d'éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Ajout de la voiture à la scène
    scene.add(carGroup);
    carRef.current = carGroup;
    
    // Appliquer la rotation initiale
    carGroup.rotation.y = rotation;
    
    // Animation
    const animate = () => {
      if (!mountRef.current) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    
    // Nettoyage
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [color]);
  
  // Mettre à jour la rotation du modèle 3D
  useEffect(() => {
    if (carRef.current) {
      carRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  // Gestion des événements pour la rotation
  const handleRotateStart = (e) => {
    e.stopPropagation();
    rotationStartRef.current = {
      x: e.clientX,
      rotation: rotation
    };
    
    document.addEventListener('mousemove', handleRotateMove);
    document.addEventListener('mouseup', handleRotateEnd);
  };
  
  const handleRotateMove = (e) => {
    if (rotationStartRef.current) {
      const delta = (e.clientX - rotationStartRef.current.x) * 0.01;
      updateRotation(id, rotationStartRef.current.rotation + delta);
    }
  };
  
  const handleRotateEnd = () => {
    rotationStartRef.current = null;
    document.removeEventListener('mousemove', handleRotateMove);
    document.removeEventListener('mouseup', handleRotateEnd);
  };
  
  // Configurer le drag-and-drop
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CAR,
    item: () => ({ id, type: ItemTypes.CAR }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(containerRef);

  // Fonction pour gérer le déplacement manuel
  const handleMove = (dx, dy) => {
    updatePosition(id, {
      left: position.left + dx,
      top: position.top + dy
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "120px",
        height: "150px",
        position: "absolute",
        left: position.left,
        top: position.top,
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        zIndex: isDragging ? 1000 : 1,
        userSelect: "none",
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: "120px",
          height: "120px",
          cursor: "grab",
        }}
        onMouseDown={handleRotateStart}
        onTouchStart={(e) => e.stopPropagation()}
      />
      <div style={{ color: "#333", fontWeight: "bold", marginTop: "5px" }}>
        Voiture {id}
      </div>
      
      {/* Contrôles de déplacement */}
      <div style={{ 
        display: "flex", 
        marginTop: "5px", 
        justifyContent: "center",
        position: "absolute",
        bottom: "-45px", 
        width: "100%" 
      }}>
        <button 
          style={{
            cursor: "pointer",
            margin: "0 5px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={(e) => {
            e.stopPropagation();
            updateRotation(id, rotation - 0.5);
          }}
        >
          ↺
        </button>
        <button 
          style={{
            cursor: "pointer",
            margin: "0 5px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={(e) => {
            e.stopPropagation();
            updateRotation(id, rotation + 0.5);
          }}
        >
          ↻
        </button>
      </div>
    </div>
  );
};

/*const ParkingArea = ({ children, onDrop }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CAR,
    drop: (item, monitor) => {
      const delta = monitor.getClientOffset();
      const dropRect = document.getElementById('parking-area').getBoundingClientRect();
      const x = delta.x - dropRect.left;
      const y = delta.y - dropRect.top;
      onDrop(item.id, { left: x - 60, top: y - 75 });
      return undefined;
    },
  });

  return (
    <div
      id="parking-area"
      ref={drop}
      style={{
        width: "100%",
        height: "600px",
        padding: "20px",
        border: "2px solid #ccc",
        borderRadius: "12px",
        position: "relative",
        backgroundColor: "#f0f0f0",
        backgroundImage: "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {children}
    </div>
  );
};*/


const ParkingArea = ({ children, onDrop }) => {
  const mountRef = useRef(null); // Référence pour le conteneur du renderer
  const sceneRef = useRef(null); // Référence pour la scène Three.js
  const rendererRef = useRef(null); // Référence pour le renderer
  const cameraRef = useRef(null); // Référence pour la caméra
  const streetRef = useRef(null); // Référence pour la rue (plan)
  const [streetRotation, setStreetRotation] = useState(0); // État pour la rotation de la rue

  // Initialisation de la scène Three.js
  useEffect(() => {
    if (!mountRef.current) return;

    // Création de la scène
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10); // Position de la caméra
    camera.lookAt(0, 0, 0); // Point de vue de la caméra
    cameraRef.current = camera;

    // Création du renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 600); // Taille du renderer
    renderer.setClearColor(0xf0f0f0); // Couleur de fond
    mountRef.current.appendChild(renderer.domElement); // Ajouter le renderer au DOM
    rendererRef.current = renderer;

    // Création de la rue (un plan)
    const streetGeometry = new THREE.PlaneGeometry(20, 20); // Taille de la rue
    const streetMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333, // Couleur de la rue
      side: THREE.DoubleSide, // Rendre la rue visible des deux côtés
    });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.rotation.x = Math.PI / 2; // Rotation pour que la rue soit à plat
    street.position.y = 0; // Positionner la rue au niveau du sol
    streetRef.current = street; // Référence pour la rue
    scene.add(street);

    // Ajout d'éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lumière ambiante
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Lumière directionnelle
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation de la scène
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Nettoyage
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose(); // Nettoyer le renderer
        if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement); // Retirer le renderer du DOM
        }
      }
    };
  }, []);

  // Mettre à jour la rotation de la rue
  useEffect(() => {
    if (streetRef.current) {
      streetRef.current.rotation.y = streetRotation;
    }
  }, [streetRotation]);

  // Gestion du drop (identique à la version précédente)
  const [, drop] = useDrop({
    accept: ItemTypes.CAR,
    drop: (item, monitor) => {
      const delta = monitor.getClientOffset();
      const dropRect = document.getElementById('parking-area').getBoundingClientRect();
      const x = delta.x - dropRect.left;
      const y = delta.y - dropRect.top;
      onDrop(item.id, { left: x - 60, top: y - 75 });
      return undefined;
    },
  });

  return (
    <div
      id="parking-area"
      ref={drop}
      style={{
        width: "100%",
        height: "600px",
        position: "relative",
        overflow: "hidden", // Cacher le débordement du renderer
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {children}

      {/* Contrôles pour la rotation de la rue */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 1000 }}>
        <button
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
          }}
          onClick={() => setStreetRotation((prev) => prev - Math.PI / 4)} // Rotation à gauche
        >
          ↺
        </button>
        <button
          style={{
            padding: "10px",
            fontSize: "16px",
          }}
          onClick={() => setStreetRotation((prev) => prev + Math.PI / 4)} // Rotation à droite
        >
          ↻
        </button>
      </div>
    </div>
  );
};


const carColors = [
  0x3366ff, // bleu
  0xff3333, // rouge
  0x33cc33, // vert
  0xffcc00, // jaune
  0x9933ff, // violet
  0xff9900, // orange
  0x00cccc, // turquoise
  0xff66cc  // rose
];

const ParkingPlan3D = () => {
  const [cars, setCars] = useState([
    { id: 1, position: { left: 50, top: 50 }, rotation: 0 },
    { id: 2, position: { left: 200, top: 50 }, rotation: 0 },
    { id: 3, position: { left: 350, top: 50 }, rotation: 0 },
    { id: 4, position: { left: 500, top: 50 }, rotation: 0 },
    { id: 5, position: { left: 650, top: 50 }, rotation: 0 },
    { id: 6, position: { left: 50, top: 200 }, rotation: 0 },
    { id: 7, position: { left: 200, top: 200 }, rotation: 0 },
    { id: 8, position: { left: 350, top: 200 }, rotation: 0 }
  ]);

  const updatePosition = (id, newPosition) => {
    setCars(prevCars => prevCars.map(car => {
      if (car.id === id) {
        return { ...car, position: newPosition };
      }
      return car;
    }));
  };
  
  const updateRotation = (id, newRotation) => {
    setCars(prevCars => prevCars.map(car => {
      if (car.id === id) {
        return { ...car, rotation: newRotation };
      }
      return car;
    }));
  };

  const handleDrop = (id, newPosition) => {
    updatePosition(id, newPosition);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>Plan de Parking 3D - Positionnement et Rotation</h2>
        <p>Faites glisser les voitures où vous voulez et utilisez les boutons pour les faire pivoter</p>
        <div style={{ 
          width: "90%", 
          margin: "0 auto",
          maxWidth: "1000px"
        }}>
          <ParkingArea onDrop={handleDrop}>
            {cars.map((car, index) => (
              <Car3D
                key={car.id}
                id={car.id}
                position={car.position}
                rotation={car.rotation}
                color={carColors[index % carColors.length]}
                updatePosition={updatePosition}
                updateRotation={updateRotation}
              />
            ))}
          </ParkingArea>
        </div>
      </div>
    </DndProvider>
  );
};

export default ParkingPlan3D; 