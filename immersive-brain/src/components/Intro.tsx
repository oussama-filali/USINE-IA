import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import SpaceBoiLoader from './SpaceBoiLoader';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const { progress: loaderProgress, active } = useProgress();
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const completedRef = useRef(false);

  const complete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFadeOut(true);
    setTimeout(onComplete, 650);
  };

  const displayProgress = useMemo(() => {
    const p = Number.isFinite(loaderProgress) ? loaderProgress : 0;
    return Math.max(0, Math.min(100, Math.round(p)));
  }, [loaderProgress]);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  // Smooth displayed progress towards real loader progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const target = displayProgress;
        if (prev >= target) return prev;
        return Math.min(target, prev + 2);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [displayProgress]);

  useEffect(() => {
    if (completedRef.current) return;

    // Laisse le temps de voir l'animation (même si tout est déjà en cache)
    const minVisibleMs = 3200;
    const elapsed = Date.now() - startTimeRef.current;
    const ready = !active && displayProgress >= 100;
    if (!ready || elapsed < minVisibleMs) return;

    const t = setTimeout(() => complete(), 180);
    return () => clearTimeout(t);
  }, [active, displayProgress]);

  // Fail-safe: ne jamais rester bloqué sur l'intro (réseau, HDR externe, loader browser-specific)
  useEffect(() => {
    if (completedRef.current) return;
    const maxWaitMs = 12000;
    const t = setTimeout(() => complete(), maxWaitMs);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Pendant l'intro: un seul modèle visible (SpaceBoi). La station charge en dessous mais reste invisible. */}
      <div className="absolute inset-0" aria-label="Loader 3D">
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
            <SpaceBoiLoader />
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

      {/* UI de chargement (discret) - uniquement chiffres */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center px-4 transition-all duration-700 ${
          textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="text-[10px] sm:text-xs tracking-[0.45em] text-white/45 font-light select-none">
          {progress}%
        </div>
      </div>

      {/* Subtle radial gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
