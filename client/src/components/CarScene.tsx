import { OrbitControls, TransformControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ConeGeometry, CylinderGeometry, MeshBasicMaterial } from "three";

const CarModel = () => {
  const { nodes, materials } = useGLTF("/models/scene.gltf");
  console.log(nodes, materials, "nodes, materials");
  return <primitive object={nodes.Sketchfab_Scene} material={materials.Standard00FF80} />;
};
const SensorField = () => {
  const sensorGeometry = new CylinderGeometry(5, 10, 20, 32);
  const sensorMaterial = new MeshBasicMaterial({ color: 0x00ffff, opacity: 0.5, transparent: true });
  return (
    <mesh
      geometry={sensorGeometry}
      material={sensorMaterial}
      position={[0, 0, 10]}
      rotation={[-Math.PI / 2, 0, 0]}
    ></mesh>
  );
};
const CarScene = () => {
  return (
    <Canvas camera={{ position: [30, 30, 60], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <group position={[0, -1, 0]}>
        <CarModel />
        <SensorField />
      </group>
      <gridHelper args={[300, 80, 0x888888, 0x888888]} position={[0, 0, 0]} />
      <axesHelper args={[1000]} />
      <OrbitControls />
    </Canvas>
  );
};

export default CarScene;
