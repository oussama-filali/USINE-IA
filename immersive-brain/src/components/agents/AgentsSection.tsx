import React, { useEffect, useMemo, useState, type MutableRefObject } from 'react';
import { useGLTF } from '@react-three/drei';
import { agentProjects } from './projectsData';
import { MiniModelPreview } from './AgentModelPreviews';
import { AgentModal } from './AgentModal';
import { useAgentsCarousel } from './useAgentsCarousel';

type AgentsSectionProps = {
  onNavigateToId?: (id: string) => void;
  orbitRef?: MutableRefObject<{ t: number }>;
};

export default function AgentsSection({ onNavigateToId, orbitRef }: AgentsSectionProps) {
  const dinoModelUrl = useMemo(() => agentProjects.find((p) => p.id === 'dino')?.modelUrl ?? null, []);
  const [dinoModelOk, setDinoModelOk] = useState<boolean>(false);
  const fallbackLogoUrl = useMemo(
    () => `${import.meta.env.BASE_URL}images/logo-minimalist-usine-ia.png`,
    []
  );

  useEffect(() => {
    if (!dinoModelUrl) return;
    let cancelled = false;
    fetch(dinoModelUrl, { method: 'HEAD' })
      .then((r) => {
        if (cancelled) return;
        setDinoModelOk(r.ok);
      })
      .catch(() => {
        if (cancelled) return;
        setDinoModelOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dinoModelUrl]);

  const {
    stageRef,
    viewportRef,
    cardRefs,
    metricsRef,

    activeIndex,
    setActiveIndex,
    openIndex,
    setOpenIndex,

    suppressClickRef,
    snapToIndex,
    beginDrag,

    onStagePointerDown,
    onAnyPointerMove,
    endAnyDrag,
    onKeyDown,

    mod,
  } = useAgentsCarousel({ projects: agentProjects, orbitRef });

  // Précharger uniquement l’agent actif (Dino) pour limiter la latence
  useEffect(() => {
    if (!dinoModelOk) return;
    const active = agentProjects[activeIndex];
    if (!active || active.id !== 'dino' || !active.modelUrl) return;
    // Important: keep preload options consistent with useGLTF(url, true)
    useGLTF.preload(active.modelUrl, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, dinoModelOk]);

  useEffect(() => {
    if (openIndex === null) return;
    const p = agentProjects[openIndex];
    if (!p) return;
    if (p.imageUrl) return;
    if (p.id === 'dino' && !dinoModelOk) return;
    const url = p.modelUrl;
    if (!url) return;
    // Important: keep preload options consistent with useGLTF(url, true)
    useGLTF.preload(url, true);
  }, [openIndex, dinoModelOk]);

  return (
    <div className="relative w-full h-full flex flex-col justify-center px-4 md:px-6">
      <div className="w-full max-w-6xl mx-auto">
        <h2
          className="text-xl sm:text-2xl md:text-4xl font-light tracking-[0.3em] text-white/90 text-center mb-4 sm:mb-6"
          style={{
            animation: 'fadeInUp 2s ease-out',
            textShadow: '0 0 40px rgba(255,255,255,0.3)',
          }}
        >
          NOS AGENTS
        </h2>

        <p
          className="text-[11px] sm:text-xs md:text-sm font-light text-gray-400/90 text-center mb-3 sm:mb-6 max-w-2xl mx-auto"
          style={{ animation: 'fadeInUp 2s ease-out 0.3s backwards' }}
        >
          Show, don’t tell.
        </p>

        <div className="relative w-full" style={{ animation: 'fadeInUp 2s ease-out 0.4s backwards' }}>
          <div
            ref={stageRef}
            data-disable-slide-nav="true"
            className="relative z-10 w-full max-w-[620px] mx-auto select-none overflow-visible"
            style={{
              perspective: `${metricsRef.current.perspective}px`,
              // Mobile: prioritize the carousel drag over page/slide gestures.
              // (We still allow vertical gestures outside of this stage.)
              touchAction: 'none',
            }}
            onPointerDown={onStagePointerDown}
            onPointerMove={onAnyPointerMove}
            onPointerUp={endAnyDrag}
            onPointerCancel={endAnyDrag}
            onPointerLeave={endAnyDrag}
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label="Carousel Agents"
          >
            <div ref={viewportRef} className="relative w-full">
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${metricsRef.current.tiltXDeg}deg)`,
                }}
              >
                {agentProjects.map((project, idx) => {
                  const isActive = idx === activeIndex;
                  const isModalOpen = openIndex !== null;
                  const enable3DPreview = !isModalOpen && idx === activeIndex && project.id === 'dino' && dinoModelOk;

                  const cardW = metricsRef.current.cardW;
                  const cardH = metricsRef.current.cardH;

                  return (
                    <button
                      key={project.id}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      type="button"
                      data-carousel-card="true"
                      className={
                        `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ` +
                        `rounded-2xl border bg-white/7 backdrop-blur-2xl ` +
                        `transition-colors duration-300 ` +
                        `${isActive ? 'border-white/25 bg-white/12' : 'border-white/15 hover:border-white/25 hover:bg-white/12'} `
                      }
                      style={{
                        width: `${cardW}px`,
                        height: `${cardH}px`,
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, filter, opacity',
                        transition: 'none',
                        // Ensure the actual touch target also opts out of browser panning.
                        touchAction: 'none',
                      }}
                      onPointerDown={(e) => {
                          if (e.pointerType === 'mouse' && e.button !== 0) return;
                        beginDrag(e, e.currentTarget);
                      }}
                      onPointerMove={onAnyPointerMove}
                      onPointerUp={endAnyDrag}
                      onPointerCancel={endAnyDrag}
                      onClick={() => {
                        if (suppressClickRef.current) {
                          suppressClickRef.current = false;
                          return;
                        }
                        if (isModalOpen) return;
                        setActiveIndex(idx);
                        snapToIndex(idx);
                        setOpenIndex(idx);
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        {/* Base haze (legibility over rich background) */}
                        <div className="absolute inset-0 bg-black/14" />

                        {/* Mirror + bubble layers (specular highlights) */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(120% 95% at calc(50% + (var(--lg-x) * 18px)) calc(38% + (var(--lg-y) * 14px)), rgba(255,255,255,0.33) 0%, rgba(255,255,255,0.14) 22%, rgba(255,255,255,0.00) 60%),' +
                              'radial-gradient(85% 70% at calc(38% - (var(--lg-x) * 12px)) calc(65% - (var(--lg-y) * 10px)), rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.00) 58%),' +
                              'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 44%, rgba(255,255,255,0.08) 100%)',
                            filter: 'url(#liquid-glass-card-distort)',
                            opacity: isActive ? 1 : 0.75,
                            transition: 'opacity 240ms ease',
                            mixBlendMode: 'overlay',
                          }}
                        />

                        {/* Specular sweep */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(100deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.15) 35%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.12) 65%, rgba(255,255,255,0.00) 100%)',
                            filter: 'blur(0.2px)',
                            opacity: isActive ? 0.55 : 0.30,
                            transition: 'opacity 260ms ease',
                            mixBlendMode: 'screen',
                          }}
                        />

                        {/* Rim + inner stroke */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/14" />
                        <div className="absolute inset-[1px] rounded-2xl ring-1 ring-inset ring-white/8" />
                      </div>

                      <div className="relative h-full w-full p-4 flex flex-col text-left">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div
                              className={
                                "text-[17px] sm:text-[18px] md:text-xl font-light tracking-wide " +
                                (isActive ? "text-white/95" : "text-white/90")
                              }
                            >
                              {project.name}
                            </div>
                            <div
                              className={
                                "text-[12px] sm:text-[13px] md:text-sm font-light italic mt-1 max-h-10 overflow-hidden " +
                                (isActive ? "text-white/78" : "text-white/70")
                              }
                            >
                              {project.tagline}
                            </div>
                          </div>
                          {project.imageUrl ? (
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-white/10 bg-white/5 overflow-hidden pointer-events-none">
                              <img
                                src={project.imageUrl}
                                alt={project.name}
                                className="w-full h-full object-cover"
                                draggable={false}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = fallbackLogoUrl;
                                }}
                              />
                            </div>
                          ) : project.id === 'dino' ? (
                            enable3DPreview ? (
                              <MiniModelPreview project={project} enabled={true} />
                            ) : (
                              <div className="text-2xl opacity-90 select-none pointer-events-none">{project.icon}</div>
                            )
                          ) : (
                            <div className="text-2xl opacity-90 select-none pointer-events-none">{project.icon}</div>
                          )}
                        </div>

                        <div className="mt-3 flex-1" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 'clamp(320px, 56vw, 520px)',
                    height: 'clamp(320px, 56vw, 520px)',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-0 pointer-events-none mt-4 sm:mt-6 p-3 sm:p-4 border-l-2 border-white/20 bg-white/5 max-w-3xl mx-auto"
          style={{ animation: 'fadeInUp 2s ease-out 1.3s backwards' }}
        >
          <h4 className="text-xs md:text-sm font-light text-white/90 mb-2 tracking-wide">⚙️ La Fiabilité Augmentée (RAG)</h4>
          <p className="text-[10px] md:text-xs text-gray-400/80 font-light leading-relaxed">
            RAG + mémoire vectorielle : vos documents deviennent un cerveau consultable, traçable et fiable.
          </p>
        </div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            animation: 'pulse 5s ease-in-out infinite',
            zIndex: -1,
          }}
        />
      </div>

      {openIndex !== null && (
        <AgentModal
          project={agentProjects[openIndex]}
          onClose={() => setOpenIndex(null)}
          onNavigateToId={onNavigateToId}
        />
      )}

      {/* SVG filter defs used by card layers (document-local) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="liquid-glass-card-distort" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.25" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
