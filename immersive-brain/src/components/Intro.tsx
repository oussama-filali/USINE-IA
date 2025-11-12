import React, { useState, useEffect } from 'react';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show text immediately for faster experience
    setTextVisible(true);
    
    // Faster loading progress (reduced from 40ms to 25ms, increased increment from 2 to 3)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3; // Faster loading
      });
    }, 25); // Faster interval

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Reduced delay for faster transition
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 800); // Faster fade out
      }, 300); // Reduced from 500ms
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Center content - Épuré et minimaliste */}
      <div className="relative z-10 text-center px-4">
        {/* Title - Style épuré */}
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.3em] mb-4 md:mb-6 transition-all duration-700 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            textShadow: '0 0 20px rgba(255,255,255,0.2)'
          }}
        >
          USINE-IA
        </h1>

        {/* Loading bar - Minimaliste */}
        <div
          className={`w-48 sm:w-56 md:w-64 lg:w-80 mx-auto transition-all duration-700 delay-200 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="h-[1px] bg-white/10 rounded-full overflow-hidden mb-3 relative">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress percentage - Discret */}
          <div className="text-[10px] sm:text-xs tracking-[0.3em] text-white/40 font-light">
            {progress}%
          </div>
        </div>

        {/* Loading dots - Minimalistes */}
        <div className="mt-8 md:mt-10 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 bg-white/40 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
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
