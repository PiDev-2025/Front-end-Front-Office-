import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from "axios";
import { useParams } from "react-router-dom";

const Visualize3d = ({ parkingId: propParkingId }) => {
  const { id: urlParkingId } = useParams();
  const parkingId = propParkingId || urlParkingId;

  const mountRef = useRef(null);
  const [parkingData, setParkingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch parking data
  useEffect(() => {
    const loadParkingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/parkings/parkings/${parkingId}`
        );
        setParkingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading parking data:", err);
        setError("Failed to load parking data");
        setLoading(false);
      }
    };

    if (parkingId) {
      loadParkingData();
    }
  }, [parkingId]);

  useEffect(() => {
    if (!parkingData || !mountRef.current) return;
  
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
  
    // Configuration
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const layoutWidth = parkingData.layout?.width || 1000;
    const layoutHeight = parkingData.layout?.height || 800;
  
    // Initialize the renderer first
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    
    // Fonction pour calculer le centre réel du parking basé sur les éléments
    function calculateParkingBounds() {
      // Créer un objet pour stocker les limites du parking
      const bounds = {
        minX: Infinity,
        maxX: -Infinity,
        minZ: Infinity,
        maxZ: -Infinity
      };
      
      // Vérifier les rues
      if (parkingData.layout?.streets && parkingData.layout.streets.length > 0) {
        parkingData.layout.streets.forEach(street => {
          const streetY = street.y < 0 ? Math.abs(street.y) : street.y;
          
          // Calculer les coins de la rue en tenant compte de la rotation
          const angleRad = street.rotation;
          const halfWidth = street.width / 2;
          const halfLength = street.length / 2;
          
          const corners = [
            { 
              x: street.x + (Math.cos(angleRad) * halfWidth) + (Math.sin(angleRad) * halfLength),
              z: streetY + (Math.sin(angleRad) * halfWidth) + (Math.cos(angleRad) * halfLength)
            },
            { 
              x: street.x + (Math.cos(angleRad) * halfWidth) - (Math.sin(angleRad) * halfLength),
              z: streetY + (Math.sin(angleRad) * halfWidth) - (Math.cos(angleRad) * halfLength)
            },
            { 
              x: street.x - (Math.cos(angleRad) * halfWidth) + (Math.sin(angleRad) * halfLength),
              z: streetY - (Math.sin(angleRad) * halfWidth) + (Math.cos(angleRad) * halfLength)
            },
            { 
              x: street.x - (Math.cos(angleRad) * halfWidth) - (Math.sin(angleRad) * halfLength),
              z: streetY - (Math.sin(angleRad) * halfWidth) - (Math.cos(angleRad) * halfLength)
            }
          ];
          
          // Mettre à jour les limites
          corners.forEach(corner => {
            bounds.minX = Math.min(bounds.minX, corner.x);
            bounds.maxX = Math.max(bounds.maxX, corner.x);
            bounds.minZ = Math.min(bounds.minZ, corner.z);
            bounds.maxZ = Math.max(bounds.maxZ, corner.z);
          });
        });
      }
      
      // Vérifier les places de parking
      if (parkingData.spots && parkingData.spots.length > 0) {
        parkingData.spots.forEach(spot => {
          const angleRad = spot.rotation;
          const halfWidth = spot.width / 2;
          const halfHeight = spot.height / 2;
          
          const corners = [
            { 
              x: spot.x + (Math.cos(angleRad) * halfWidth) + (Math.sin(angleRad) * halfHeight),
              z: spot.y + (Math.sin(angleRad) * halfWidth) + (Math.cos(angleRad) * halfHeight)
            },
            { 
              x: spot.x + (Math.cos(angleRad) * halfWidth) - (Math.sin(angleRad) * halfHeight),
              z: spot.y + (Math.sin(angleRad) * halfWidth) - (Math.cos(angleRad) * halfHeight)
            },
            { 
              x: spot.x - (Math.cos(angleRad) * halfWidth) + (Math.sin(angleRad) * halfHeight),
              z: spot.y - (Math.sin(angleRad) * halfWidth) + (Math.cos(angleRad) * halfHeight)
            },
            { 
              x: spot.x - (Math.cos(angleRad) * halfWidth) - (Math.sin(angleRad) * halfHeight),
              z: spot.y - (Math.sin(angleRad) * halfWidth) - (Math.cos(angleRad) * halfHeight)
            }
          ];
          
          // Mettre à jour les limites
          corners.forEach(corner => {
            bounds.minX = Math.min(bounds.minX, corner.x);
            bounds.maxX = Math.max(bounds.maxX, corner.x);
            bounds.minZ = Math.min(bounds.minZ, corner.z);
            bounds.maxZ = Math.max(bounds.maxZ, corner.z);
          });
        });
      }
      
      // Si aucun élément n'a été trouvé, utiliser les dimensions du layout
      if (bounds.minX === Infinity) {
        bounds.minX = 0;
        bounds.maxX = layoutWidth;
        bounds.minZ = 0;
        bounds.maxZ = layoutHeight;
      }
      
      // Ajouter une marge
      const margin = 50;
      bounds.minX -= margin;
      bounds.maxX += margin;
      bounds.minZ -= margin;
      bounds.maxZ += margin;
      
      return bounds;
    }
    
    // Calculer les limites réelles du parking
    const parkingBounds = calculateParkingBounds();
    
    // Calculer le centre et la taille du parking
    const parkingCenter = new THREE.Vector3(
      (parkingBounds.minX + parkingBounds.maxX) / 2,
      0,
      (parkingBounds.minZ + parkingBounds.maxZ) / 2
    );
    
    const parkingWidth = parkingBounds.maxX - parkingBounds.minX;
    const parkingDepth = parkingBounds.maxZ - parkingBounds.minZ;
    const parkingSize = Math.max(parkingWidth, parkingDepth);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000);
    
    // Calculer la distance caméra en fonction de la taille du parking et du champ de vision
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = (parkingSize / 2) / Math.tan(fov / 2);
    
    // Positionner la caméra pour voir tout le parking
    camera.position.set(
      parkingCenter.x,
      cameraDistance * 0.8,
      parkingCenter.z + cameraDistance * 0.5
    );
    camera.lookAt(parkingCenter);
    
    // Controls - configuration spéciale pour le glissement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 3000;
    controls.maxPolarAngle = Math.PI / 2; // Limite la rotation pour ne pas passer sous le sol
    
    // Configuration critique pour le glissement
    controls.enablePan = true;
    controls.panSpeed = 1.0;
    controls.screenSpacePanning = true; // Rend le glissement plus intuitif
    
    // Définir la cible au centre du parking
    controls.target.copy(parkingCenter);
    controls.update();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(parkingCenter.x, 300, parkingCenter.z);
    directionalLight.castShadow = true;
    
    // Ajuster la caméra d'ombre pour couvrir tout le parking
    const shadowSize = parkingSize * 1.2;
    directionalLight.shadow.camera.left = -shadowSize / 2;
    directionalLight.shadow.camera.right = shadowSize / 2;
    directionalLight.shadow.camera.top = shadowSize / 2;
    directionalLight.shadow.camera.bottom = -shadowSize / 2;
    scene.add(directionalLight);

    // Ground - créer un sol plus grand que le parking
    const groundSize = parkingSize * 2;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(parkingCenter.x, 0, parkingCenter.z);
    ground.receiveShadow = true;
    scene.add(ground);

    // Add grid lines centered on the parking
    const gridHelper = new THREE.GridHelper(
      groundSize,
      30,
      0x555555,
      0x333333
    );
    gridHelper.position.set(parkingCenter.x, 0.1, parkingCenter.z);
    scene.add(gridHelper);

    // Create streets
    if (parkingData.layout?.streets && parkingData.layout.streets.length > 0) {
      parkingData.layout.streets.forEach((street) => {
        // Transformation des coordonnées négatives en positives pour la visualisation 3D
        const streetY = street.y < 0 ? Math.abs(street.y) : street.y;

        // Convert 2D coordinates to 3D coordinates (x->x, y->z)
        const streetGeometry = new THREE.BoxGeometry(
          street.width,
          5,
          street.length
        );
        const streetMaterial = new THREE.MeshStandardMaterial({
          color: 0x444444,
        });
        const streetMesh = new THREE.Mesh(streetGeometry, streetMaterial);

        // Position at center of the street, convert y coordinate to z in 3D space
        streetMesh.position.set(street.x, 1, streetY);

        // Apply rotation
        streetMesh.rotation.y = street.rotation;
        streetMesh.receiveShadow = true;
        streetMesh.castShadow = true;
        scene.add(streetMesh);

        // Ligne médiane de rue
        const lineGeometry = new THREE.BoxGeometry(2, 1, street.length - 10);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
        lineMesh.position.set(street.x, 2, streetY);
        lineMesh.rotation.y = street.rotation;
        scene.add(lineMesh);

        if (street.hasEntrance) {
          const entranceGeometry = new THREE.CylinderGeometry(10, 10, 5, 32);
          const entranceMaterial = new THREE.MeshBasicMaterial({
            color: 0x3498db,
          });
          const entranceMesh = new THREE.Mesh(
            entranceGeometry,
            entranceMaterial
          );

          // Position at the start of the street using streetY
          const entrancePos = getPositionAtStreetEnd(
            { ...street, y: streetY },
            true
          );
          entranceMesh.position.set(entrancePos.x, 5, entrancePos.z);
          scene.add(entranceMesh);
        }

        // Same for exit markers using streetY
        if (street.hasExit) {
          const exitGeometry = new THREE.CylinderGeometry(10, 10, 5, 32);
          const exitMaterial = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
          const exitMesh = new THREE.Mesh(exitGeometry, exitMaterial);

          // Position at the end of the street using streetY
          const exitPos = getPositionAtStreetEnd(
            { ...street, y: streetY },
            false
          );
          exitMesh.position.set(exitPos.x, 5, exitPos.z);
          scene.add(exitMesh);        
        }
      });
    }

    // Create parking spots
    if (parkingData.spots && parkingData.spots.length > 0) {
      parkingData.spots.forEach((spot) => {
        // Determine color based on status
        let spotColor;
        switch (spot.status) {
          case "available":
            spotColor = 0x2ecc71; // Green
            break;
          case "occupied":
            spotColor = 0xe74c3c; // Red
            break;
          case "reserved":
            spotColor = 0xf39c12; // Orange
            break;
          default:
            spotColor = 0x95a5a6; // Grey
        }

        // Create spot - swap height/width for correct orientation
        // Convert 2D coordinates to 3D coordinates (y -> z)
        const spotGeometry = new THREE.BoxGeometry(spot.width, 3, spot.height);
        const spotMaterial = new THREE.MeshStandardMaterial({
          color: spotColor,
          transparent: true,
          opacity: 0.8,
          roughness: 0.5,
        });
        const spotMesh = new THREE.Mesh(spotGeometry, spotMaterial);

        // Position with correct z-coordinate (from y in 2D)
        spotMesh.position.set(spot.x, 1.5, spot.y);
        spotMesh.rotation.y = spot.rotation;
        spotMesh.receiveShadow = true;
        spotMesh.castShadow = true;

        // Add spot ID to userData for interaction
        spotMesh.userData = {
          id: spot.id,
          status: spot.status,
          type: "parkingSpot",
          originalColor: spotColor
        };

        scene.add(spotMesh);

        // Add spot borders
        const borderGeometry = new THREE.BoxGeometry(
          spot.width + 2,
          1,
          spot.height + 2
        );
        const borderMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
        });
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.set(spot.x, 1, spot.y);
        borderMesh.rotation.y = spot.rotation;
        scene.add(borderMesh);

      });
    } 

    // Highlight on hover and click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject = null;

    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster with the mouse position and camera
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersected objects
      const intersects = raycaster.intersectObjects(scene.children);
      
      // Reset previously hovered object if exists
      if (hoveredObject) {
        if (hoveredObject.userData.originalColor) {
          hoveredObject.material.color.set(hoveredObject.userData.originalColor);
        }
        hoveredObject = null;
      }
      
      // Check if we're hovering over a parking spot
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData && object.userData.type === "parkingSpot") {
          // Highlight the spot
          object.material.color.set(0xffff00); // Yellow highlight
          hoveredObject = object;
        }
      }
    };

    const onClick = () => {
      if (hoveredObject && hoveredObject.userData.type === "parkingSpot") {
        if (hoveredObject.userData.status === "available") {
          console.log(
            `Spot ${hoveredObject.userData.id} clicked for reservation`
          );

          // Here you could implement the API call to reserve the spot
          // Similar to your toggleOccupancy function in ParkingLiveView

          alert(
            `Reservation for spot ${hoveredObject.userData.id} would be processed here`
          );
        } else {
          alert(
            `Spot ${hoveredObject.userData.id} is already ${hoveredObject.userData.status}`
          );
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    // Helper function to get entrance/exit positions
    function getPositionAtStreetEnd(street, isStart) {
      const angleRad = street.rotation;
      const length = street.length;
      const offset = isStart ? -length / 2 + 10 : length / 2 - 10;

      return {
        x: street.x + Math.sin(angleRad) * offset,
        z: street.y + Math.cos(angleRad) * offset,
      };
    }

    // Add axis helper for debugging
    const axisHelper = new THREE.AxesHelper(100);
    axisHelper.position.set(parkingCenter.x, 0, parkingCenter.z);
    scene.add(axisHelper);

    // Debug visualization of the parking bounds
    const debugBounds = false; // Mettre à true pour visualiser les limites
    if (debugBounds) {
      const boundingBoxGeometry = new THREE.BoxGeometry(
        parkingBounds.maxX - parkingBounds.minX,
        10,
        parkingBounds.maxZ - parkingBounds.minZ
      );
      const boundingBoxMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true
      });
      const boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
      boundingBoxMesh.position.set(
        parkingCenter.x,
        5,
        parkingCenter.z
      );
      scene.add(boundingBoxMesh);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Important pour le damping
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [parkingData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading 3D Visualization...</div>
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
    <div className="flex h-screen">
      {/* Left sidebar - 1/3 width */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Parking Information</h2>
        {parkingData && (
          <div>
            <p className="font-semibold">Name: <span className="font-normal">{parkingData.name || 'N/A'}</span></p>
            <p className="font-semibold">Location: <span className="font-normal">{parkingData.location || 'N/A'}</span></p>
            <p className="font-semibold mt-2">Legend:</p>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span>Entrance</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-red-600 mr-2"></div>
              <span>Exit</span>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Navigation Instructions:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Rotate: Left click and drag</li>
                <li>Pan/Glide: <strong>Middle mouse button</strong> ou <strong>right click and drag</strong></li>
                <li>Zoom: Scroll wheel</li>
                <li>Click on an available spot to reserve it</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right visualization area - 2/3 width */}
      <div className="w-2/3 flex flex-col">
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold">3D Parking Visualization</h1>
        </div>

        <div className="flex-1 relative">
          <div ref={mountRef} style={{ width: '100%', height: '90%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Visualize3d;