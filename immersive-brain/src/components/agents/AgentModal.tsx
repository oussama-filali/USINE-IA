import React from 'react';
import type { AgentProject } from './types';
import { ModalModelPreview } from './AgentModelPreviews';

export function AgentModal({
  project,
  onClose,
  onNavigateToId,
}: {
  project: AgentProject;
  onClose: () => void;
  onNavigateToId?: (id: string) => void;
}) {
  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      data-allow-native-scroll="true"
      onWheelCapture={(e) => e.stopPropagation()}
      onTouchMoveCapture={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" onClick={onClose} aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div
          className="relative w-full max-w-[680px] rounded-[28px] border border-white/18 bg-white/10 backdrop-blur-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Liquid glass (WWDC-like) — reflets "déformés" via filtre SVG (sans WebGL) */}
          <div className="pointer-events-none absolute inset-0">
            {/* Clear Liquid Glass often benefits from a subtle dimming layer for legibility */}
            <div className="absolute inset-0 bg-black/12" />

            <div className="absolute inset-0 bg-gradient-to-br from-white/14 via-white/6 to-transparent" />

            <div
              className="absolute -top-16 -left-20 h-56 w-72 rounded-full bg-white/18 blur-2xl opacity-80"
              style={{ filter: 'url(#liquid-glass-distort)' }}
            />
            <div
              className="absolute -bottom-20 -right-24 h-64 w-80 rounded-full bg-white/15 blur-2xl opacity-62"
              style={{ filter: 'url(#liquid-glass-distort)' }}
            />

            {/* Bubble lens impression (stacked highlights) */}
            <div
              className="absolute inset-0 opacity-68"
              style={{
                background:
                   'radial-gradient(120% 90% at 36% 28%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.12) 22%, rgba(255,255,255,0.00) 60%),' +
                   'radial-gradient(90% 75% at 72% 76%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.00) 58%),' +
                   'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                filter: 'url(#liquid-glass-distort)',
                mixBlendMode: 'overlay',
              }}
            />

            <div
              className="absolute left-6 right-6 top-7 h-[2px] opacity-80"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 25%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.25) 75%, transparent 100%)',
                filter: 'url(#liquid-glass-distort)',
              }}
            />

            <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/16" />
            <div className="absolute inset-[1px] rounded-[27px] ring-1 ring-inset ring-white/8" />
            <div className="absolute inset-0 opacity-70 mix-blend-overlay bg-gradient-to-tr from-transparent via-white/16 to-transparent" />
          </div>

          <div className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] tracking-[0.30em] text-white/74 font-semibold">AGENT</div>
                <div className="text-2xl md:text-3xl font-semibold text-white/98 tracking-[0.03em] mt-1">{project.name}</div>
                <div className="text-sm md:text-base text-white/86 font-medium italic mt-1 tracking-[0.01em]">{project.tagline}</div>
              </div>

              <div className="flex items-center gap-3">
                {project.imageUrl ? (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl border border-white/10 bg-white/5 overflow-hidden pointer-events-none">
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading="eager"
                    />
                  </div>
                ) : (
                  <ModalModelPreview project={project} />
                )}
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl border border-white/15 text-white/70 text-[10px] tracking-wider hover:bg-white/10 transition-colors"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="mt-5 md:mt-6 overflow-auto pr-1" style={{ maxHeight: '52vh' }} data-allow-native-scroll="true">
              <p className="text-[15px] md:text-base text-gray-100/85 font-light leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {project.ctaAction === 'navigate' && project.ctaTargetId && onNavigateToId ? (
                <button
                  type="button"
                  className="px-4 py-3 rounded-xl border border-white/20 text-white/85 text-[11px] tracking-wider hover:bg-white/10 transition-colors"
                  onClick={() => {
                    const targetId = project.ctaTargetId!;
                    onClose();
                    onNavigateToId(targetId);
                  }}
                >
                  {project.ctaLabel}
                </button>
              ) : project.ctaHref ? (
                <button
                  type="button"
                  className="px-4 py-3 rounded-xl border border-white/20 text-white/85 text-[11px] tracking-wider hover:bg-white/10 transition-colors"
                  onClick={() => openExternal(project.ctaHref!)}
                >
                  {project.ctaLabel ?? 'Ouvrir'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* SVG filter defs (document-local) */}
      <svg width="0" height="0" className="absolute">
        <defs>
                <filter id="liquid-glass-distort" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="24" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.22" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
