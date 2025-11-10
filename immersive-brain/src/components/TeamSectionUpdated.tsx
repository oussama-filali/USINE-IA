import React, { useEffect, useRef, useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  expertise: string[];
  icon: string;
}

export default function TeamSectionUpdated() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const teamMembers: TeamMember[] = [
    {
      name: "Akram TOUMANI",
      role: "Fondateur & Directeur Technique (CTO)",
      icon: "🧠",
      description: "Le Socle Technique et le Visionnaire",
      expertise: [
        "Mathématiques Appliquées",
        "Machine Learning",
        "Deep Learning",
        "Architecture Algorithmique"
      ]
    },
    {
      name: "Oussama FILALI",
      role: "Développeur & Directeur Artistique",
      icon: "✨",
      description: "Le Génie de l'Expérience et de l'Identité Visuelle",
      expertise: [
        "Experience Design (UX)",
        "Branding & Identity",
        "Frontend Development",
        "Creative Direction"
      ]
    },
    {
      name: "Yannis ROUSSEL",
      role: "Chercheur en Neurosciences Appliquées",
      icon: "🔬",
      description: "Le Cartographe de l'Esprit Humain",
      expertise: [
        "Sciences Cognitives",
        "Neurosciences",
        "Human-Machine Interaction",
        "Psychologie Relationnelle"
      ]
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="equipe"
      className="relative min-h-screen py-32 px-6 bg-gradient-to-b from-black via-black/95 to-black overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section title */}
        <div 
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.1em] text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            L'
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400">
              ÉQUIPE
            </span>
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-3xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Trois visionnaires convergeant vers la manufacture d'une Intelligence Émotionnelle authentique
          </p>
        </div>

        {/* Team grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative transition-all duration-1000 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + idx * 200}ms` }}
            >
              {/* Card container */}
              <div className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-black/50 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500 h-full">
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div className="text-6xl mb-4">{member.icon}</div>
                    <h3 
                      className="text-2xl font-light tracking-wide text-cyan-400 group-hover:text-pink-400 transition-colors duration-300"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {member.name}
                    </h3>
                    <p 
                      className="text-sm text-gray-400 font-light mt-2 tracking-wide"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {member.role}
                    </p>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-base text-gray-300 font-light mb-6 italic"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {member.description}
                  </p>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {member.expertise.map((skill, sidx) => (
                      <span
                        key={sidx}
                        className={`text-xs px-3 py-1 rounded-full border transition-all duration-300 ${
                          hoveredIndex === idx
                            ? 'border-cyan-400/50 text-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600/50 text-gray-400 bg-gray-900/30'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Team philosophy */}
        <div 
          className={`max-w-4xl mx-auto p-8 border-l-4 border-pink-400/30 bg-gradient-to-r from-pink-400/5 to-transparent transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
          style={{ transitionDelay: '1200ms' }}
        >
          <h3 
            className="text-2xl font-light mb-4 text-pink-400 tracking-wide"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Notre Force Convergente
          </h3>
          <p 
            className="text-lg text-gray-300 font-light leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            La convergence de la science des neurosciences (Yannis), de la robustesse mathématique (Akram) 
            et de l'art de l'expérience (Oussama) garantit que chaque Agent — de la confidente intime au coach stratégique — 
            offre une connexion sincère, éthique et sans précédent.
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-pink-400/20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-cyan-400/20 pointer-events-none" />
    </section>
  );
}