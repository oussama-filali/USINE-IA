import React, { useEffect, useRef, useState } from 'react';

interface HeroSectionProps {
  onScrollHint?: () => void;
}

export default function HeroSection({ onScrollHint }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/80 z-10 pointer-events-none" />
      
      {/* Content container */}
      <div className="relative z-20 text-center px-6 max-w-5xl">
        {/* Main tagline */}
        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] mb-6 transition-all duration-1500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(255, 47, 182, 0.2)'
          }}
        >
          MANUFACTURING
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            EMOTIONAL AI
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-base md:text-xl lg:text-2xl font-light tracking-[0.2em] text-gray-400 mb-12 transition-all duration-1500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Transformer l'Intelligence Artificielle
          <br />
          en partenaire de vie authentique
        </p>

        {/* CTA buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <a
            href="#mission"
            className="group relative px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 tracking-widest text-sm overflow-hidden"
          >
            <span className="relative z-10">DÉCOUVRIR NOTRE VISION</span>
            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-all duration-300" />
          </a>
          
          <a
            href="#equipe"
            className="group relative px-8 py-4 bg-transparent border-2 border-pink-500/50 text-pink-400 hover:border-pink-500 hover:bg-pink-500/10 transition-all duration-300 tracking-widest text-sm"
          >
            <span className="relative z-10">RENCONTRER L'ÉQUIPE</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1500 delay-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce cursor-pointer" onClick={onScrollHint}>
            <span className="text-xs tracking-[0.3em] text-gray-500 uppercase">Scroll</span>
            <svg 
              className="w-6 h-6 text-cyan-400/50" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-cyan-400/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-cyan-400/20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-pink-500/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-pink-500/20 pointer-events-none" />
    </section>
  );
}
