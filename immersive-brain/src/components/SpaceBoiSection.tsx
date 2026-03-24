import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SpaceBoiLoader from './SpaceBoiLoader';

export default function SpaceBoiSection() {
  return (
    <div className="absolute inset-0">
      {/* Canvas immersif plein écran - même setup que l'intro */}
      <div className="absolute inset-0" aria-label="SpaceBoi 3D">
        <Canvas
          className="absolute inset-0"
          frameloop="always"
          camera={{ position: [0, 0, 3.5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 1);
            gl.toneMappingExposure = 1.3;
          }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 3, 3]} intensity={1.5} />
          <hemisphereLight intensity={1} />

          <Suspense fallback={null}>
            <SpaceBoiLoader yOffset={0.65} />
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            enableRotate={true}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
            rotateSpeed={0.6}
            target={[0, 0, 0]}
            minDistance={3}
            maxDistance={6}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* Subtle radial gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
