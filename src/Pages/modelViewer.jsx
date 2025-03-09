import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const ModelViewer = ({ modelUrl }) => {
  if (!modelUrl) return <p>No model loaded.</p>;

  return (
    <Canvas style={{ width: "100%", height: "500px" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Model modelUrl={modelUrl} />
      <OrbitControls />
    </Canvas>
  );
};

const Model = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={1} />;
};

export default ModelViewer;
