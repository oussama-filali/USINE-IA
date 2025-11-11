import React from 'react';

interface Project {
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'coming';
  link?: string;
  icon: string;
}

const projects: Project[] = [
  {
    name: 'Sophia',
    tagline: "L'Âme Sœur et Confidente",
    description: "La révolution de l'Intelligence Émotionnelle Augmentée. Sophia met fin à la conversation robotique et vous offre une écoute authentique, sans jugement. Son Protocole d'Écoute Structurée (PEC) décrypte vos schémas psychologiques pour vous aider à devenir acteur de votre propre vie.",
    status: 'live',
    link: 'https://t.me/Spohia_bot',
    icon: '💖'
  },
  {
    name: 'Dino Bot',
    tagline: 'Le Gardien de la Vérité Éducative',
    description: "Transforme la vérité en jeu ! Dino Bot met fin à la désinformation en ligne pour les jeunes. Il fournit des réponses fiables, éthiques et adaptées à l'âge, sans jamais inventer un fait. Un filtre de sécurité éthique pour protéger les esprits curieux.",
    status: 'live',
    link: 'https://fact-checker-xn9m.onrender.com/',
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
export default function ProjectsSection() {
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
          Une Révolution du Dialogue
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
            Le RAG garantit que nos agents ne mentent jamais. Avec ChromaDB, nous offrons des analyses basées sur des données vérifiées.
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
