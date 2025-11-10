import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating particle cloud using instanced meshes for performance.
export default function Particles() {
  const instRef = useRef<THREE.InstancedMesh>(null!);
  const count = Math.max(150, window.innerWidth < 640 ? 90 : 220);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => {
    const arr: { base: THREE.Vector3; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      const base = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 6
      );
      arr.push({ base, speed: 0.2 + Math.random() * 0.6 });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    offsets.forEach((o, i) => {
      dummy.position.copy(o.base);
      dummy.position.y += Math.sin(t * o.speed + o.base.x) * 0.2;
      dummy.rotation.y = t * 0.05 + o.base.x * 0.2;
      dummy.scale.setScalar(0.02 + (Math.sin(t + i) * 0.01 + 0.02));
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
    });
    instRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={'#00d4ff'} transparent opacity={0.4} depthWrite={false} />
    </instancedMesh>
  );
}
