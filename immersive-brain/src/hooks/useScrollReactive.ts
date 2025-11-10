import { useEffect, useRef, useState } from 'react';

// Provides a smoothed scroll velocity and cumulative distance normalized.
export function useScrollReactive() {
  const [velocity, setVelocity] = useState(0);
  const [distance, setDistance] = useState(0);
  const lastTime = useRef<number>(performance.now());

  useEffect(() => {
    let raf: number;
    let pendingDelta = 0;

    const onWheel = (e: WheelEvent) => {
      pendingDelta += e.deltaY;
    };

    const loop = () => {
      const now = performance.now();
      const dt = (now - lastTime.current) / 1000;
      lastTime.current = now;
      // Smooth velocity
      const targetVel = pendingDelta * 0.002; // scale factor
      setVelocity(v => v + (targetVel - v) * 0.15);
      setDistance(d => d + velocity * dt);
      pendingDelta *= 0.8; // decay
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(raf);
    };
  }, [velocity]);

  return { velocity, distance };
}
