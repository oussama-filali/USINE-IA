import { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setOpacity(0);
    }, 3000);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="text-center">
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.5em] text-white mb-4 animate-pulse">
            USINE-IA
          </h1>
          <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        </div>
        
        <p className="mt-8 text-sm tracking-[0.3em] text-white/60 uppercase">
          Immersive Experience
        </p>

        <div className="mt-12 flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent animate-pulse-slow pointer-events-none" />
    </div>
  );
}
