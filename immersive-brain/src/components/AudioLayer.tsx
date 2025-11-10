import React, { useEffect, useRef, useState } from 'react';

// Creates subtle binaural beat using Web Audio API after first scroll interaction.
export default function AudioLayer() {
  const [active, setActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const onWheel = () => {
      if (!active) setActive(true);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [active]);

  useEffect(() => {
    if (active && !audioCtxRef.current) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      gainRef.current = ctx.createGain();
      gainRef.current.gain.value = 0.0; // start silent
      gainRef.current.connect(ctx.destination);

      // Two oscillators slightly detuned for binaural effect
      const baseFreq = 140; // base tone
      const beatOffset = 4; // difference
      const oscLeft = ctx.createOscillator();
      oscLeft.frequency.value = baseFreq;
      const oscRight = ctx.createOscillator();
      oscRight.frequency.value = baseFreq + beatOffset;

      oscLeft.connect(gainRef.current!);
      oscRight.connect(gainRef.current!);
      oscLeft.start();
      oscRight.start();
      oscillatorsRef.current = [oscLeft, oscRight];

      // Fade in
      gainRef.current.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 4);
    }
  }, [active]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(o => o.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="absolute bottom-4 left-4 text-[10px] tracking-wide opacity-50 z-30 pointer-events-none">
      {active ? 'AUDIO · BINAURAL ACTIVE' : 'SCROLL TO ENABLE AUDIO'}
    </div>
  );
}
