import { useEffect, useMemo, useRef, Suspense, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Preload, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';

const STATION_GLB_URL = `${import.meta.env.BASE_URL}models/space_station_3.glb`;
const STATION_HDR_URL =
  'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/dikhololo_night_1k.hdr';

type CameraPose = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

function getPoseForSlide(slideIndex: number): CameraPose {
  // -1 = showcase 3D. Les autres indices suivent l'ordre des slides de App.
  switch (slideIndex) {
    case -1:
      return { position: [0, 5, 20], lookAt: [0, 0, 0] };
    case 0: // HERO
      return { position: [0, 4, 16], lookAt: [0, 0, 0] };
    case 1: // AGENTS (immersion plus proche “dans les fragments”)
      return { position: [2.5, 1.6, 8.5], lookAt: [0, 0.2, 0] };
    case 2: // SERVICES
      return { position: [6, 2.5, 14], lookAt: [0, 0, 0] };
    case 3: // FORMATIONS
      return { position: [-6, 3, 13], lookAt: [0, 0, 0] };
    case 4: // NEWSLETTER
      return { position: [-2.5, 4.5, 12], lookAt: [0, 0, 0] };
    case 5: // CONTACT
      return { position: [0, 2.2, 10.5], lookAt: [0, 0.2, 0] };
    case 6: // PLAYGROUND
      return { position: [0, 6, 18], lookAt: [0, 0, 0] };
    default:
      return { position: [0, 5, 15], lookAt: [0, 0, 0] };
  }
}

function SpaceStationModel({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF(STATION_GLB_URL, true);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).metalness = 0.95;
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.15;
            (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 2;
            (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x0a0a1a);
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
          }
        }
      });

      onReady?.();
    }
  }, [scene, onReady]);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={2}
      position={[0, 0, 0]}
    />
  );
}

function CameraRig({ slideIndex }: { slideIndex: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const position = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    const pose = getPoseForSlide(slideIndex);
    targetPos.set(pose.position[0], pose.position[1], pose.position[2]);
    targetLook.set(pose.lookAt[0], pose.lookAt[1], pose.lookAt[2]);

    position.copy(cam.position);
    position.lerp(targetPos, 0.06);
    cam.position.copy(position);

    lookAt.copy(targetLook);
    cam.lookAt(lookAt);
    cam.updateProjectionMatrix();
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 5, 15]} fov={60} />;
}

function OrbitClock({ orbitRef }: { orbitRef?: MutableRefObject<{ t: number }> }) {
  useFrame((state) => {
    if (orbitRef) orbitRef.current.t = state.clock.getElapsedTime();
  });
  return null;
}

function Scene({
  slideIndex,
  orbitRef,
  onStationReady,
}: {
  slideIndex: number;
  orbitRef?: MutableRefObject<{ t: number }>;
  onStationReady?: () => void;
}) {
  const [stationReady, setStationReady] = useState(false);
  const notifiedReadyRef = useRef(false);

  useEffect(() => {
    THREE.Cache.enabled = true;
  }, []);

  return (
    <>
      <OrbitClock orbitRef={orbitRef} />
      <CameraRig slideIndex={slideIndex} />
      
      <ambientLight intensity={1.15} />
      <directionalLight position={[10, 10, 5]} intensity={2.8} color="#88ccff" />
      <directionalLight position={[-10, -10, -5]} intensity={1.7} color="#aa88ff" />
      <pointLight position={[0, 10, 0]} intensity={2.35} color="#ff88ff" distance={40} decay={2} />
      <pointLight position={[5, 5, 10]} intensity={1.75} color="#00ffff" distance={28} decay={2} />

      {stationReady && <Particles />}
      
      <Suspense fallback={null}>
        <SpaceStationModel
          onReady={() => {
            setStationReady(true);
            if (!notifiedReadyRef.current) {
              notifiedReadyRef.current = true;
              onStationReady?.();
            }
          }}
        />
        <Environment files={STATION_HDR_URL} />
        <Preload all />
      </Suspense>

      <fog attach="fog" args={['#000000', 18, 70]} />
    </>
  );
}

export default function SpaceStationScene({
  slideIndex = -1,
  orbitRef,
  frameloop = 'always',
  onStationReady,
}: {
  slideIndex?: number;
  orbitRef?: MutableRefObject<{ t: number }>;
  frameloop?: 'always' | 'demand' | 'never';
  onStationReady?: () => void;
}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        className="pointer-events-none"
        frameloop={frameloop}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 2.35,
        }}
        dpr={isMobile ? [1, 1] : [1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <Scene slideIndex={slideIndex} orbitRef={orbitRef} onStationReady={onStationReady} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/8 via-transparent to-black opacity-28" />
        <div className="absolute inset-0 bg-gradient-radial from-cyan-600/6 via-transparent to-transparent opacity-22" />
      </div>
    </div>
  );
}
