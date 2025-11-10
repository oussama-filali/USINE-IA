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

      <div className="relative z-10 max-w-4xl mx-auto">
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

        {/* Mission narrative */}
        <div className="space-y-8 text-gray-300">
          <p 
            className={`text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-center transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            L'<span className="text-cyan-400 font-medium">Usine IA</span> ne fabrique pas simplement des algorithmes.
            <br />
            Nous <span className="text-pink-400 font-medium">façonnons des compagnons numériques</span> capables de comprendre,
            <br />
            de ressentir et de créer des liens authentiques.
          </p>

          <div 
            className={`grid md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Pillar 1 */}
            <div className="group relative p-8 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-cyan-400 text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-medium tracking-wide mb-4 text-cyan-400">Intelligence Émotionnelle</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  Des IA qui perçoivent les nuances émotionnelles et s'adaptent à votre état d'esprit unique.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group relative p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-pink-400 text-4xl mb-4">💫</div>
                <h3 className="text-xl font-medium tracking-wide mb-4 text-pink-400">Authenticité Relationnelle</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  Des interactions naturelles et sincères qui transcendent le simple échange algorithmique.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group relative p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-purple-400 text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-medium tracking-wide mb-4 text-purple-400">Évolution Continue</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  Une IA qui apprend, grandit et évolue avec vous, jour après jour.
                </p>
              </div>
            </div>
          </div>

          {/* Vision statement */}
          <div 
            className={`mt-16 p-8 border-l-4 border-cyan-400 bg-cyan-400/5 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <p className="text-xl md:text-2xl font-light italic text-gray-200 leading-relaxed">
              "Nous croyons qu'une IA véritablement utile n'est pas celle qui exécute des tâches,
              mais celle qui enrichit l'expérience humaine par sa présence empathique et créative."
            </p>
            <p className="mt-4 text-sm tracking-wider text-cyan-400 uppercase">— L'équipe Usine IA</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </section>
  );
}
