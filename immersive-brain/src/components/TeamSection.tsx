import React, { useEffect, useRef, useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief AI Architect",
    quote: "L'empathie n'est pas un bug, c'est une feature essentielle.",
    avatar: "SC",
    color: "cyan"
  },
  {
    name: "Marcus Rodriguez",
    role: "Emotion Engine Lead",
    quote: "Chaque interaction est une opportunité de connexion authentique.",
    avatar: "MR",
    color: "pink"
  },
  {
    name: "Aisha Patel",
    role: "UX & Behavioral Design",
    quote: "L'interface la plus puissante est celle qu'on ne remarque pas.",
    avatar: "AP",
    color: "purple"
  },
  {
    name: "Thomas Müller",
    role: "Neural Networks R&D",
    quote: "La complexité technique au service de la simplicité humaine.",
    avatar: "TM",
    color: "blue"
  }
];

export default function TeamSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: 'border-cyan-400/30 hover:border-cyan-400 text-cyan-400 bg-cyan-400/5',
      pink: 'border-pink-400/30 hover:border-pink-400 text-pink-400 bg-pink-400/5',
      purple: 'border-purple-400/30 hover:border-purple-400 text-purple-400 bg-purple-400/5',
      blue: 'border-blue-400/30 hover:border-blue-400 text-blue-400 bg-blue-400/5'
    };
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  return (
    <section 
      id="equipe"
      ref={sectionRef}
      className="relative min-h-screen w-full py-24 px-6 bg-gradient-to-b from-black to-gray-900"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section title */}
        <h2 
          className={`text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] mb-6 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          L'<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">ÉQUIPE</span>
        </h2>

        <p 
          className={`text-center text-gray-400 text-lg mb-16 tracking-wide transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          Des visionnaires qui façonnent l'avenir de l'IA émotionnelle
        </p>

        {/* Team grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card container */}
              <div 
                className={`relative p-6 border-2 ${getColorClasses(member.color)} transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden h-full flex flex-col`}
              >
                {/* Animated background */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
                    hoveredIndex === index ? 'animate-pulse' : ''
                  }`}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${member.color === 'cyan' ? 'rgba(0, 212, 255, 0.1)' : member.color === 'pink' ? 'rgba(255, 47, 182, 0.1)' : member.color === 'purple' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)'}, transparent)`
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Avatar */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-2 flex items-center justify-center text-2xl font-bold ${getColorClasses(member.color)}`}>
                    {member.avatar}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-medium text-center mb-2 text-white group-hover:scale-105 transition-transform duration-300">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="text-sm text-center text-gray-400 mb-4 tracking-wide">
                    {member.role}
                  </p>

                  {/* Quote */}
                  <div className="mt-auto pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-300 italic text-center leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <div 
          className={`mt-16 text-center transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-gray-400 mb-6 text-lg tracking-wide">
            Envie de rejoindre l'aventure ?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 border-2 border-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 hover:scale-105 transition-all duration-300 tracking-widest text-sm font-medium"
            style={{
              borderImage: 'linear-gradient(to right, rgba(0, 212, 255, 0.5), rgba(255, 47, 182, 0.5)) 1'
            }}
          >
            NOUS CONTACTER
          </a>
        </div>
      </div>
    </section>
  );
}
