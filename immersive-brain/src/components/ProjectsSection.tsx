import React, { useMemo, useRef } from 'react';

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
    tagline: 'IA Émotionnelle',
    description:
      "Sophia n'est pas un chatbot. C'est une mémoire expérientielle : elle détecte la détresse, structure l'écoute et ne juge jamais.",
    status: 'live',
    link: 'https://t.me/Sophia_bot',
    ctaLabel: 'Tester Sophia sur Telegram',
    ctaHref: 'https://t.me/Sophia_bot',
    icon: '💖'
  },
  {
    name: 'Dino Bot',
    tagline: 'Fact-checking enfants (6–12 ans)',
    description:
      "L'éducation aux médias pour les 6–12 ans : vérification des faits et langage adapté.",
    status: 'coming',
    ctaLabel: "S'inscrire à la Beta",
    ctaAction: 'navigate',
    ctaTargetId: 'newsletter',
    icon: '🦖'
  },
  {
    name: 'Maître Koba',
    tagline: "L'Avocat Sémantique",
    description:
      "Déconstruit la complexité juridique et stratégique. Met fin à la confusion des démarches initiales en offrant une feuille de route claire pour chaque problème professionnel ou légal. Un raisonnement de haut niveau pour des décisions importantes.",
    status: 'coming',
    icon: '⚖️'
  }
];

type ProjectsSectionProps = {
  onNavigateToId?: (id: string) => void;
};

export default function ProjectsSection({ onNavigateToId }: ProjectsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ isDown: boolean; startX: number; scrollLeft: number }>(
    { isDown: false, startX: 0, scrollLeft: 0 }
  );

  const getLedTheme = useMemo(() => {
    return (projectName: string) => {
      if (projectName === 'Dino Bot') {
        return {
          borderA: 'border-emerald-300/45',
          borderB: 'border-emerald-200/25',
          accent: 'bg-gradient-to-r from-emerald-300/45 to-emerald-100/10'
        };
      }
      if (projectName === 'Sophia') {
        return {
          borderA: 'border-pink-300/40',
          borderB: 'border-violet-300/30',
          accent: 'bg-gradient-to-r from-pink-300/40 via-purple-300/25 to-violet-200/20'
        };
      }
      return null;
    };
  }, []);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (e.pointerType !== 'mouse') return;
    if (e.button !== 0) return;

    dragStateRef.current.isDown = true;
    dragStateRef.current.startX = e.clientX;
    dragStateRef.current.scrollLeft = el.scrollLeft;

    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (e.pointerType !== 'mouse') return;
    if (!dragStateRef.current.isDown) return;

    const dx = e.clientX - dragStateRef.current.startX;
    el.scrollLeft = dragStateRef.current.scrollLeft - dx;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (e.pointerType !== 'mouse') return;

    dragStateRef.current.isDown = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center px-4 md:px-6">
      <div className="w-full max-w-6xl mx-auto">
        <h2
          className="text-2xl md:text-4xl font-light tracking-[0.3em] text-white/90 text-center mb-6"
          style={{
            animation: 'fadeInUp 2s ease-out',
            textShadow: '0 0 40px rgba(255,255,255,0.3)'
          }}
        >
          NOS AGENTS
        </h2>

        <p
          className="text-xs md:text-sm font-light text-gray-400/90 text-center mb-8 max-w-2xl mx-auto"
          style={{ animation: 'fadeInUp 2s ease-out 0.3s backwards' }}
        >
          Show, don’t tell.
        </p>

        <div
          ref={scrollerRef}
          className="relative w-full overflow-x-auto overflow-y-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className="flex gap-4 md:gap-6 py-2 md:py-3" style={{ msOverflowStyle: 'none' }}>
            {projects.map((project, idx) => {
              const led = getLedTheme(project.name);
              const isComing = project.status === 'coming';

              return (
                <a
                  key={project.name}
                  href={project.link}
                  target={project.link ? '_blank' : undefined}
                  rel={project.link ? 'noopener noreferrer' : undefined}
                  className={
                    `group relative flex-none w-[260px] md:w-[320px] ` +
                    `p-4 md:p-5 border border-white/10 bg-black/30 backdrop-blur-sm hover:border-white/30 ` +
                    `transition-transform duration-500 will-change-transform ` +
                    `${isComing ? 'cursor-default opacity-75' : 'cursor-pointer hover:scale-[1.06]'}`
                  }
                  style={{ animation: `fadeInUp 2s ease-out ${0.5 + idx * 0.2}s backwards` }}
                  onClick={(e) => {
                    if (isComing) e.preventDefault();
                  }}
                >
                  {led && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className={`absolute inset-0 border ${led.borderA}`} />
                      <div className={`absolute inset-0 border ${led.borderB} animate-pulse`} />
                      <div className={`absolute inset-x-0 bottom-0 h-1 ${led.accent} opacity-80`} />
                    </div>
                  )}

                  {isComing && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 text-white/60 text-[10px] font-light tracking-wider rounded-full">
                      EN COURS
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg md:text-2xl font-light tracking-wide text-white/95 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm md:text-base text-white/70 font-light italic">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="text-xl md:text-2xl leading-none select-none opacity-90">{project.icon}</div>
                  </div>

                  <div className="mt-3 overflow-hidden max-h-12 group-hover:max-h-40 transition-all duration-500">
                    <p className="text-[10px] md:text-xs text-gray-400/80 font-light leading-relaxed">
                      {project.description}
                    </p>
                  </div>

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
                        <button
                          type="button"
                          onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openExternal(project.ctaHref!);
                        }}
                        className="w-full px-4 py-2 border border-white/20 text-white/80 text-[10px] md:text-xs tracking-wider hover:bg-white/10 transition-all duration-300"
                      >
                        {project.ctaLabel}
                      </button>
                      ) : null}
                    </div>
                  )}

                  {project.status === 'live' && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-white/40 group-hover:text-white/70 transition-colors duration-300">
                      <span>Explorer</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  )}

                  {!led && (
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-white/30 to-white/10 group-hover:w-full transition-all duration-500" />
                  )}

                  {!led && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        <div
          className="mt-6 p-4 border-l-2 border-white/20 bg-white/5 max-w-3xl mx-auto"
          style={{ animation: 'fadeInUp 2s ease-out 1.3s backwards' }}
        >
          <h4 className="text-xs md:text-sm font-light text-white/90 mb-2 tracking-wide">
            ⚙️ La Fiabilité Augmentée (RAG)
          </h4>
          <p className="text-[10px] md:text-xs text-gray-400/80 font-light leading-relaxed">
            RAG + mémoire vectorielle : vos documents deviennent un cerveau consultable, traçable et fiable.
          </p>
        </div>

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
