import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { AgentProject } from './types';

function MiniGltf({
  url,
  rotation,
  scale = 1,
}: {
  url: string;
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(url, true);
  const { invalidate } = useThree();

  const object = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const center = box.getCenter(new THREE.Vector3());
    s.position.sub(center);
    return s;
  }, [scene]);

  useEffect(() => {
    let frames = 0;
    let raf: number | null = null;
    const tick = () => {
      invalidate();
      frames += 1;
      if (frames < 10) raf = window.requestAnimationFrame(tick);
    };
    tick();
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [invalidate, object]);

  return (
    <Bounds fit clip observe margin={1.25}>
      <Center>
        <primitive object={object} rotation={rotation as any} scale={scale} />
      </Center>
    </Bounds>
  );
}

function OrbitingGltf({
  url,
  rotation,
  scale = 1,
}: {
  url: string;
  rotation?: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url, true);

  const { object, fitScale } = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    s.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const autoFit = maxDim > 0 ? 1.55 / maxDim : 1;
    return { object: s, fitScale: autoFit };
  }, [scene]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    g.rotation.y = t * 0.55;
    g.rotation.x = 0.08 + Math.sin(t * 0.35) * 0.06;
    g.position.x = Math.cos(t * 0.55) * 0.035;
    g.position.z = Math.sin(t * 0.55) * 0.035;
    g.position.y = Math.sin(t * 0.8) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={object} rotation={rotation as any} scale={scale * fitScale} />
      </Center>
    </group>
  );
}

export function MiniModelPreview({
  project,
  enabled,
}: {
  project: AgentProject;
  enabled: boolean;
}) {
  if (!enabled || !project.modelUrl) {
    return <div className="text-2xl opacity-90 select-none">{project.icon}</div>;
  }

  return (
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-white/10 bg-white/5 overflow-hidden pointer-events-none">
      <Canvas
        className="pointer-events-none"
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        frameloop="demand"
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 3.2], fov: 34 }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[2, 2, 3]} intensity={1.1} />
        <Suspense fallback={null}>
          <MiniGltf url={project.modelUrl} rotation={project.modelRotation} scale={project.modelScale ?? 1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function ModalModelPreview({ project }: { project: AgentProject }) {
  if (!project.modelUrl) return null;

  return (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl border border-white/10 bg-white/5 overflow-hidden pointer-events-none">
      <Canvas
        className="pointer-events-none"
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        frameloop="always"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 2.8], fov: 35 }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[2, 2, 3]} intensity={1.25} />
        <directionalLight position={[-2, 1, -2]} intensity={0.6} />
        <Suspense fallback={null}>
          <OrbitingGltf url={project.modelUrl} rotation={project.modelRotation} scale={project.modelScale ?? 1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
