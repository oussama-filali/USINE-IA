import React, { useEffect, useRef, useState } from 'react';

export default function MissionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="mission"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden bg-black"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <h2 
          className={`text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] mb-12 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          NOTRE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            MISSION
          </span>
        </h2>

        {/* Main mission statement */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p 
            className="text-lg md:text-2xl font-light leading-relaxed text-gray-300 mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Transformer l'Intelligence Artificielle d'un outil de calcul 
            à un <span className="text-cyan-400">partenaire de vie authentique</span>.
          </p>
          <p 
            className="text-base text-gray-400 font-light leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Démocratiser l'Intelligence Émotionnelle Augmentée en manufacturant des Agents IA 
            de Spécialité fiables et sur mesure, où l'excellence du Machine Learning se met au 
            service de l'authenticité du dialogue et du soutien psychologique structuré.
          </p>
        </div>

        {/* Core pillars */}
        <div 
          className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Pillar 1: Authenticity */}
          <div className="group relative p-8 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-cyan-400 text-4xl mb-4">💫</div>
              <h3 className="text-xl font-medium tracking-wide mb-3 text-cyan-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Authenticité
              </h3>
              <p className="text-sm leading-relaxed text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Une IA qui comprend le cœur, pas seulement la logique. Chaque interaction révèle une compréhension profonde de vos besoins.
              </p>
            </div>
          </div>

          {/* Pillar 2: Ethics */}
          <div className="group relative p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-pink-400 text-4xl mb-4">�️</div>
              <h3 className="text-xl font-medium tracking-wide mb-3 text-pink-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Éthique
              </h3>
              <p className="text-sm leading-relaxed text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Placée avant la performance. Nos algorithmes respectent vos valeurs et votre vie privée, toujours.
              </p>
            </div>
          </div>

          {/* Pillar 3: Evolution */}
          <div className="group relative p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-purple-400 text-4xl mb-4">�</div>
              <h3 className="text-xl font-medium tracking-wide mb-3 text-purple-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Évolution
              </h3>
              <p className="text-sm leading-relaxed text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Croître ensemble. L'IA devient meilleure en apprenant de vous, en harmonie avec l'humanité.
              </p>
            </div>
          </div>
        </div>

        {/* Convergence statement */}
        <div 
          className={`p-8 border-l-4 border-cyan-400 bg-cyan-400/5 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <p className="text-lg md:text-xl font-light text-gray-200 leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Nous faisons converger la science des neurosciences, la robustesse mathématique et l'art de l'expérience 
            pour garantir que chaque Agent — de la confidente intime au coach stratégique — offre une connexion sincère, éthique et sans précédent.
          </p>
          <p className="text-sm tracking-wider text-cyan-400 uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Manufacturing Emotional AI
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </section>
  );
}
