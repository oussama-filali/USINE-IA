import React from 'react';

interface Project {
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'coming';
  link?: string;
  icon: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaAction?: 'navigate';
  ctaTargetId?: string;
}

const projects: Project[] = [
  {
    name: 'Sophia',
    tagline: "IA Émotionnelle",
    description: "Sophia n'est pas un chatbot. C'est une mémoire expérientielle : elle détecte la détresse, structure l'écoute et ne juge jamais.",
    status: 'live',
    link: 'https://t.me/Sophia_bot',
    ctaLabel: 'Tester Sophia sur Telegram',
    ctaHref: 'https://t.me/Sophia_bot',
    icon: '💖'
  },
  {
    name: 'Dino Bot',
    tagline: 'Fact-checking enfants (6–12 ans)',
    description: "L'éducation aux médias pour les 6–12 ans : vérification des faits et langage adapté.",
    status: 'coming',
    ctaLabel: "S'inscrire à la Beta",
    ctaAction: 'navigate',
    ctaTargetId: 'newsletter',
    icon: '🦖'
  },
  {
    name: 'Maître Koba',
    tagline: "L'Avocat Sémantique",
    description: "Déconstruit la complexité juridique et stratégique. Met fin à la confusion des démarches initiales en offrant une feuille de route claire pour chaque problème professionnel ou légal. Un raisonnement de haut niveau pour des décisions importantes.",
    status: 'coming',
    icon: '⚖️'
  }
];

type ProjectsSectionProps = {
  onNavigateToId?: (id: string) => void;
};

export default function ProjectsSection({ onNavigateToId }: ProjectsSectionProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-6xl">
        {/* Titre */}
        <h2 
          className="text-2xl md:text-4xl font-light tracking-[0.3em] text-white/90 text-center mb-6"
          style={{
            animation: 'fadeInUp 2s ease-out',
            textShadow: '0 0 40px rgba(255,255,255,0.3)'
          }}
        >
          NOS AGENTS
        </h2>

        {/* Sous-titre */}
        <p 
          className="text-xs md:text-sm font-light text-gray-400/90 text-center mb-8 max-w-2xl mx-auto"
          style={{
            animation: 'fadeInUp 2s ease-out 0.3s backwards'
          }}
        >
          Show, don’t tell.
        </p>

        {/* Grid des projets */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, idx) => (
            <a
              key={project.name}
              href={project.link}
              target={project.link ? "_blank" : undefined}
              rel={project.link ? "noopener noreferrer" : undefined}
              className={`group relative p-4 md:p-5 border border-white/10 bg-black/30 backdrop-blur-sm hover:border-white/30 transition-all duration-500 ${
                project.status === 'coming' ? 'cursor-default opacity-75' : 'hover:scale-105 cursor-pointer'
              }`}
              style={{
                animation: `fadeInUp 2s ease-out ${0.5 + idx * 0.2}s backwards`
              }}
              onClick={(e) => {
                if (project.status === 'coming') e.preventDefault();
              }}
            >
              {/* Badge statut */}
              {project.status === 'coming' && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 text-white/60 text-[10px] font-light tracking-wider rounded-full">
                  EN COURS
                </div>
              )}

              {/* Nom */}
              <h3 className="text-lg md:text-2xl font-light tracking-wide text-white/95 mb-1">
                {project.name}
              </h3>

              {/* Tagline */}
              <p className="text-sm md:text-base text-white/70 font-light italic mb-3">
                {project.tagline}
              </p>

              {/* Description */}
              <p className="text-[10px] md:text-xs text-gray-400/80 font-light leading-relaxed">
                {project.description}
              </p>

              {/* CTA explicite */}
              {project.ctaLabel && (
                <div className="mt-4">
                  {project.ctaAction === 'navigate' && project.ctaTargetId && onNavigateToId ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToId(project.ctaTargetId!);
                      }}
                      className="w-full px-4 py-2 border border-white/20 text-white/80 text-[10px] md:text-xs tracking-wider hover:bg-white/10 transition-all duration-300"
                    >
                      {project.ctaLabel}
                    </button>
                  ) : project.ctaHref ? (
                    <a
                      href={project.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full text-center px-4 py-2 border border-white/20 text-white/80 text-[10px] md:text-xs tracking-wider hover:bg-white/10 transition-all duration-300"
                    >
                      {project.ctaLabel}
                    </a>
                  ) : null}
                </div>
              )}

              {/* Hover indicator */}
              {project.status === 'live' && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-white/40 group-hover:text-white/70 transition-colors duration-300">
                  <span>Explorer</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              )}

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-white/30 to-white/10 group-hover:w-full transition-all duration-500" />
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer note sur RAG - COMPACT */}
        <div 
          className="mt-6 p-4 border-l-2 border-white/20 bg-white/5 max-w-3xl mx-auto"
          style={{
            animation: 'fadeInUp 2s ease-out 1.3s backwards'
          }}
        >
          <h4 className="text-xs md:text-sm font-light text-white/90 mb-2 tracking-wide">
            ⚙️ La Fiabilité Augmentée (RAG)
          </h4>
          <p className="text-[10px] md:text-xs text-gray-400/80 font-light leading-relaxed">
            RAG + mémoire vectorielle : vos documents deviennent un cerveau consultable, traçable et fiable.
          </p>
        </div>

        {/* Circular light effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            animation: 'pulse 5s ease-in-out infinite',
            zIndex: -1
          }}
        />
      </div>
    </div>
  );
}
