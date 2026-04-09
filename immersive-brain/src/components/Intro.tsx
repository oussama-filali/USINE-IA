import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import SpaceBoiLoader from './SpaceBoiLoader';

interface IntroProps {
  onComplete: () => void;
  onPreloadStart?: () => void;
}

const STATION_GLB_URL = `${import.meta.env.BASE_URL}models/space_station_3.glb`;
const SPACEBOI_GLB_URL = `${import.meta.env.BASE_URL}models/space_boi.glb`;
const STATION_HDR_URL =
  'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/dikhololo_night_1k.hdr';

function PreloadStationAssets() {
  // Ensures the station + HDR are fully in cache before we leave the intro.
  // This prevents any visible fallback loader when the main scene appears.
  useGLTF(STATION_GLB_URL, true);
  useLoader(RGBELoader, STATION_HDR_URL);
  return null;
}

function SpaceBoiReadySignal({ onReady }: { onReady: () => void }) {
  // Suspends until SpaceBoi is ready, then signals.
  useGLTF(SPACEBOI_GLB_URL);
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export default function Intro({ onComplete, onPreloadStart }: IntroProps) {
  const { progress: loaderProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [preloadEnabled, setPreloadEnabled] = useState(false);
  const [spaceBoiReady, setSpaceBoiReady] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const completedRef = useRef(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

  // Important: we do NOT wait for station/HDR (very heavy). We only wait for SpaceBoi.
  const canComplete = spaceBoiReady;

  // Ne pas afficher 100% tant qu'on n'est pas prêt à quitter l'intro.
  // Ça évite l'impression de "100%" qui reste figé longtemps.
  const displayTarget = useMemo(() => {
    if (spaceBoiReady) return 100;
    // Keep it moving but never show 100 early.
    return Math.min(92, Math.max(6, Math.min(99, displayProgress)));
  }, [displayProgress, spaceBoiReady]);

  useEffect(() => {
    setTextVisible(true);
  }, []);

  // Démarre le preload de la station juste après le 1er rendu (SpaceBoi déjà visible).
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setPreloadEnabled(true);
      onPreloadStart?.();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [onPreloadStart]);

  // Smooth displayed progress towards real loader progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const target = displayTarget;
        if (prev >= target) return prev;
        return Math.min(target, prev + 2);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [displayTarget]);

  useEffect(() => {
    if (completedRef.current) return;

    // Laisse le temps de voir l'animation (même si tout est déjà en cache)
    const minVisibleMs = 900;
    const elapsed = Date.now() - startTimeRef.current;
    const ready = canComplete;
    if (!ready || elapsed < minVisibleMs) return;

    const t = setTimeout(() => complete(), 120);
    return () => clearTimeout(t);
  }, [canComplete]);

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
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{ antialias: !isMobile, alpha: false, powerPreference: isMobile ? 'low-power' : 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 1);
            gl.toneMappingExposure = 1.3;
          }}
        >
          <ambientLight intensity={isMobile ? 1.2 : 2} />
          <directionalLight position={[5, 5, 5]} intensity={isMobile ? 1.6 : 2.5} />
          <directionalLight position={[-5, 3, 3]} intensity={isMobile ? 1.0 : 1.5} />
          <hemisphereLight intensity={isMobile ? 0.7 : 1} />

          <Suspense fallback={null}>
            <SpaceBoiLoader />
            <SpaceBoiReadySignal onReady={() => setSpaceBoiReady(true)} />
          </Suspense>
          <Suspense fallback={null}>{preloadEnabled && <PreloadStationAssets />}</Suspense>

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
