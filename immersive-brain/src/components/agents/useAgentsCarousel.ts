import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { AgentProject } from './types';

type Metrics = {
  radius: number;
  perspective: number;
  tiltXDeg: number;
  cardW: number;
  cardH: number;
  openWScale: number;
  openHScale: number;
  openZBoost: number;
  openScaleMin: number;
  liftYvh: number;
  shiftXvw: number;
  viewportHvh: number;
  viewportMinH: number;
  viewportMaxH: number;
  dragSensitivity: number;
  dragThresholdPx: number;
  snap: boolean;
};

export function useAgentsCarousel({
  projects,
  orbitRef,
}: {
  projects: AgentProject[];
  orbitRef?: MutableRefObject<{ t: number }>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const rafRef = useRef<number | null>(null);
  const rotationRef = useRef<{ current: number; target: number }>({ current: 0, target: 0 });
  const lastFrameTRef = useRef<number>(performance.now() / 1000);
  const dragRef = useRef<{
    isDown: boolean;
    isDragging: boolean;
    startX: number;
    startY: number;
    startTarget: number;
    pointerId: number | null;
    captureEl: HTMLElement | null;
    axisLock: 'x' | 'y' | null;
  }>({
    isDown: false,
    isDragging: false,
    startX: 0,
    startY: 0,
    startTarget: 0,
    pointerId: null,
    captureEl: null,
    axisLock: null,
  });

  const suppressClickRef = useRef(false);
  const lastOrbitTRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeIndexRef = useRef(0);
  const openIndexRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  const metricsRef = useRef<Metrics>({
    radius: 520,
    perspective: 1200,
    tiltXDeg: -8,
    cardW: 220,
    cardH: 320,
    openWScale: 1.18,
    openHScale: 1.32,
    openZBoost: 160,
    openScaleMin: 1.25,
    liftYvh: -6,
    shiftXvw: 0,
    viewportHvh: 42,
    viewportMinH: 300,
    viewportMaxH: 520,
    dragSensitivity: 0.0046,
    dragThresholdPx: 10,
    snap: true,
  });

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const normalizeAngle = (a: number) => {
    const twoPi = Math.PI * 2;
    let out = a % twoPi;
    if (out > Math.PI) out -= twoPi;
    if (out < -Math.PI) out += twoPi;
    return out;
  };
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  const computeMetrics = () => {
    const w = stageRef.current?.clientWidth ?? 0;
    const t = clamp01((w - 360) / 900);
    const isSmall = w > 0 && w <= 420;

    const radius = 205 + t * 135;
    const cardW = 140 + t * 60;
    const cardH = 205 + t * 86;
    const perspective = 860 + t * 420;
    const tiltXDeg = -10 + t * 4;
    const dragSensitivity = 0.0039 - t * 0.0007;
    const dragThresholdPx = Math.round(18 - t * 5);

    const openWScale = 1.05 + t * 0.08;
    const openHScale = 1.10 + t * 0.10;
    const openZBoost = 85 + t * 50;
    const openScaleMin = 1.03 + t * 0.10;

    let liftYvh = -(19.0 - t * 6.0);
    let shiftXvw = -(7.5 - t * 2.2);
    let viewportHvh = 38 + t * 6;
    let viewportMinH = Math.round(260 + t * 40);
    let viewportMaxH = Math.round(440 + t * 120);

    // Mobile-first: avoid pushing the carousel off-screen on narrow viewports.
    if (isSmall) {
      liftYvh = -8;
      shiftXvw = 0;
      viewportHvh = 48;
      viewportMinH = 340;
      viewportMaxH = 560;
    }

    metricsRef.current = {
      ...metricsRef.current,
      radius,
      cardW,
      cardH,
      perspective,
      tiltXDeg,
      dragSensitivity,
      dragThresholdPx,
      openWScale,
      openHScale,
      openZBoost,
      openScaleMin,
      liftYvh,
      shiftXvw,
      viewportHvh,
      viewportMinH,
      viewportMaxH,
    };

    const stage = stageRef.current;
    if (stage) {
      stage.style.transform = `translate3d(${shiftXvw}vw, ${liftYvh}vh, 0)`;
    }
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.style.height = `${viewportHvh}vh`;
      viewport.style.minHeight = `${viewportMinH}px`;
      viewport.style.maxHeight = `${viewportMaxH}px`;
    }
  };

  const updateActiveFromRotation = (rotation: number) => {
    const step = (Math.PI * 2) / projects.length;
    const idx = mod(Math.round((-rotation) / step), projects.length);
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  };

  const snapToIndex = (idx: number) => {
    const step = (Math.PI * 2) / projects.length;
    rotationRef.current.target = -idx * step;
  };

  const tick = () => {
    const tFrame = performance.now() / 1000;
    const dt = Math.max(0.001, Math.min(0.05, tFrame - lastFrameTRef.current));
    lastFrameTRef.current = tFrame;

    const step = (Math.PI * 2) / projects.length;
    const isModalOpen = openIndexRef.current !== null;
    if (isModalOpen) {
      rotationRef.current.target = rotationRef.current.current;
    }

    if (!isModalOpen && orbitRef && !dragRef.current.isDown && !dragRef.current.isDragging) {
      const t = orbitRef.current.t;
      const last = lastOrbitTRef.current;
      lastOrbitTRef.current = t;
      if (last !== null) {
        const dt = Math.max(0, Math.min(0.05, t - last));
        rotationRef.current.target += dt * 0.10;
      }
    }

    const { current, target } = rotationRef.current;
    // Frame-rate independent smoothing for a more fluid feel.
    const lerpPer60 = 0.11;
    const alpha = 1 - Math.pow(1 - lerpPer60, dt * 60);
    const next = current + (target - current) * alpha;
    rotationRef.current.current = next;

    const stage = stageRef.current;
    if (stage) {
      const m = metricsRef.current;
      stage.style.perspective = `${m.perspective}px`;
    }

    const m = metricsRef.current;
    const radius = m.radius;

    const tNow = orbitRef ? orbitRef.current.t : performance.now() / 1000;

    for (let i = 0; i < projects.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const theta = normalizeAngle(i * step + next);
      const depth = (Math.cos(theta) + 1) / 2;
      const scale = 0.82 + depth * 0.28;
      const opacity = 0.44 + depth * 0.56;
      const blur = (1 - depth) * 1.05;
      const z = radius;

      const yawDeg = (theta * 180) / Math.PI;
      el.style.transform = `rotateY(${yawDeg}deg) translateZ(${z}px) rotateY(${-yawDeg}deg) scale(${scale})`;
      el.style.opacity = `${opacity}`;
      el.style.filter = blur > 0.01 ? `blur(${blur}px) saturate(1.12) contrast(1.06)` : 'saturate(1.12) contrast(1.06)';

      // Liquid glass driving vars (used by card overlay layers)
      el.style.setProperty('--lg-depth', `${depth}`);
      el.style.setProperty('--lg-theta', `${theta}`);
      el.style.setProperty('--lg-t', `${tNow}`);
      el.style.setProperty('--lg-x', `${Math.sin(theta)}`);
      el.style.setProperty('--lg-y', `${-Math.cos(theta)}`);

      const isActive = i === activeIndexRef.current;
      el.setAttribute('aria-current', isActive ? 'true' : 'false');
    }

    if (!isModalOpen) updateActiveFromRotation(next);

    rafRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    computeMetrics();
    const onResize = () => computeMetrics();
    window.addEventListener('resize', onResize);
    rafRef.current = window.requestAnimationFrame(tick);

    snapToIndex(0);

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginDrag = (e: React.PointerEvent, captureEl: HTMLElement) => {
    if (openIndexRef.current !== null) return;
    // Prevent browser gesture handling from stealing the interaction (mobile).
    try {
      e.preventDefault();
    } catch {
      // no-op
    }
    lastOrbitTRef.current = orbitRef ? orbitRef.current.t : null;
    dragRef.current.isDown = true;
    dragRef.current.isDragging = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startTarget = rotationRef.current.target;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.captureEl = captureEl;
    dragRef.current.axisLock = null;
    suppressClickRef.current = false;
    try {
      captureEl.setPointerCapture(e.pointerId);
    } catch {
      // Some browsers/devices may not support pointer capture reliably.
    }
  };

  const releaseCapture = () => {
    const id = dragRef.current.pointerId;
    const el = dragRef.current.captureEl;
    dragRef.current.pointerId = null;
    dragRef.current.captureEl = null;
    try {
      if (id !== null && el) el.releasePointerCapture(id);
    } catch {
      // no-op
    }
  };

  const onStagePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (openIndexRef.current !== null) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest('[data-carousel-card="true"]')) return;
    beginDrag(e, e.currentTarget);
  };

  const onAnyPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Axis lock: on mobile we want the carousel to win unless the intent is clearly vertical.
    const isTouch = e.pointerType === 'touch';
    const lockTrigger = isTouch ? 14 : 10;
    const verticalDominance = isTouch ? 2.4 : 1.2;
    const minVertical = isTouch ? 24 : 0;

    if (dragRef.current.axisLock === null && absDx + absDy > lockTrigger) {
      dragRef.current.axisLock = absDy > Math.max(minVertical, absDx * verticalDominance) ? 'y' : 'x';
      if (dragRef.current.axisLock === 'y') {
        dragRef.current.isDown = false;
        dragRef.current.isDragging = false;
        suppressClickRef.current = false;
        releaseCapture();
        return;
      }
    }

    if (dragRef.current.axisLock === 'y') return;

    if (!dragRef.current.isDragging && absDx >= metricsRef.current.dragThresholdPx) {
      dragRef.current.isDragging = true;
      suppressClickRef.current = true;
    }

    if (!dragRef.current.isDragging) return;

    if (isTouch) {
      try {
        e.preventDefault();
      } catch {
        // no-op
      }
    }
    const threshold = isTouch ? Math.min(8, metricsRef.current.dragThresholdPx) : metricsRef.current.dragThresholdPx;
    const dragDistance = Math.max(0, absDx - threshold);
    const dragDirection = dx < 0 ? -1 : 1;
    const dragProgress = clamp01(dragDistance / 72);
    const easedStart = dragProgress * dragProgress;
    const softenedDx = dragDirection * dragDistance * (0.35 + easedStart * 0.65);
    const sensitivity = isTouch ? metricsRef.current.dragSensitivity * 1.55 : metricsRef.current.dragSensitivity;
    rotationRef.current.target = dragRef.current.startTarget + softenedDx * sensitivity;
  };

  const endAnyDrag = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;

    const wasDragging = dragRef.current.isDragging;
    dragRef.current.isDragging = false;
    dragRef.current.axisLock = null;
    releaseCapture();

    if (wasDragging && metricsRef.current.snap && openIndexRef.current === null) {
      snapToIndex(activeIndexRef.current);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpenIndex(null);
      return;
    }
    if (openIndexRef.current !== null) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const idx = mod(activeIndexRef.current - 1, projects.length);
      setActiveIndex(idx);
      snapToIndex(idx);
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const idx = mod(activeIndexRef.current + 1, projects.length);
      setActiveIndex(idx);
      snapToIndex(idx);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      setOpenIndex(activeIndexRef.current);
    }
  };

  return {
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
  };
}
