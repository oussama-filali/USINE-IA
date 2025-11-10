import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function SpaceStationModel() {
  const { scene } = useGLTF('/models/space_station_3.glb');
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).metalness = 0.9;
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.2;
            (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.5;
          }
        }
      });
    }
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={2.5}
      position={[0, 0, 0]}
    />
  );
}

function Scene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 3, 8);
  }, [camera]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4444ff" />
      <pointLight position={[0, 10, 0]} intensity={1} color="#ff66ff" distance={30} decay={2} />
      
      <Suspense fallback={null}>
        <SpaceStationModel />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        autoRotate={false}
        rotateSpeed={0.5}
        zoomSpeed={1.2}
      />

      <fog attach="fog" args={['#000000', 15, 40]} />
    </>
  );
}

export default function SpaceStationScene() {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <Scene />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-black opacity-60" />
        <div className="absolute inset-0 bg-gradient-radial from-cyan-600/5 via-transparent to-transparent opacity-40" />
      </div>
    </div>
  );
}

useGLTF.preload('/models/space_station_3.glb');
