import { useEffect, useRef } from 'react';

type AmbientAudioProps = {
  slideIndex: number;
};

type AudioState = {
  ctx: AudioContext;
  master: GainNode;
  ambientGain: GainNode;
  sfxGain: GainNode;
  noise?: AudioBufferSourceNode;
  pad?: OscillatorNode;
  pad2?: OscillatorNode;
  lfo?: OscillatorNode;
  lfoGain?: GainNode;
};

function createPinkNoiseBuffer(ctx: AudioContext, seconds = 2) {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, seconds * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  // Simple filtered noise (not perfect pink, but warm enough for ambience)
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    data[i] = pink * 0.06;
  }

  return buffer;
}

function now(ctx: AudioContext) {
  return ctx.currentTime;
}

export default function AmbientAudio({ slideIndex }: AmbientAudioProps) {
  const audioRef = useRef<AudioState | null>(null);
  const armedRef = useRef(false);
  const lastSlideRef = useRef<number | null>(null);

  useEffect(() => {
    const arm = async () => {
      if (armedRef.current) return;
      armedRef.current = true;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      // iOS/Safari may start suspended; resume asap (inside user gesture)
      try {
        await ctx.resume();
      } catch {
        // ignore
      }

      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);

      const ambientGain = ctx.createGain();
      ambientGain.gain.value = 0.0;
      ambientGain.connect(master);

      const sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.0;
      sfxGain.connect(master);

      // Ambient: warm filtered noise + subtle pad
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = createPinkNoiseBuffer(ctx);
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 900;
      noiseFilter.Q.value = 0.7;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(ambientGain);

      const padOsc = ctx.createOscillator();
      padOsc.type = 'sine';
      padOsc.frequency.value = 110;

      const padOsc2 = ctx.createOscillator();
      padOsc2.type = 'sine';
      padOsc2.frequency.value = 220;

      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 420;
      padFilter.Q.value = 0.9;

      padOsc.connect(padFilter);
      padOsc2.connect(padFilter);
      padFilter.connect(ambientGain);

      // Slow LFO to breathe the ambience
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.08;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 70;
      lfo.connect(lfoGain);
      lfoGain.connect(noiseFilter.frequency);

      // Start nodes
      noiseSource.start();
      padOsc.start();
      padOsc2.start();
      lfo.start();

      audioRef.current = {
        ctx,
        master,
        ambientGain,
        sfxGain,
        noise: noiseSource,
        pad: padOsc,
        pad2: padOsc2,
        lfo,
        lfoGain,
      };

      const t = now(ctx);
      master.gain.setValueAtTime(0.0, t);
      master.gain.linearRampToValueAtTime(0.55, t + 1.6);

      ambientGain.gain.setValueAtTime(0.0, t);
      ambientGain.gain.linearRampToValueAtTime(0.38, t + 2.0);

      sfxGain.gain.setValueAtTime(0.0, t);
      sfxGain.gain.linearRampToValueAtTime(0.6, t + 0.4);
    };

    const opts: AddEventListenerOptions = { passive: true };
    const onUserGesture = () => {
      void arm();
      window.removeEventListener('pointerdown', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      window.removeEventListener('wheel', onUserGesture);
    };

    window.addEventListener('pointerdown', onUserGesture, opts);
    window.addEventListener('touchstart', onUserGesture, opts);
    window.addEventListener('keydown', onUserGesture, opts);
    window.addEventListener('wheel', onUserGesture, opts);

    return () => {
      window.removeEventListener('pointerdown', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      window.removeEventListener('wheel', onUserGesture);

      const a = audioRef.current;
      audioRef.current = null;
      if (!a) return;

      try {
        a.noise?.stop();
      } catch {
        // ignore
      }
      try {
        a.pad?.stop();
      } catch {
        // ignore
      }
      try {
        a.pad2?.stop();
      } catch {
        // ignore
      }
      try {
        a.lfo?.stop();
      } catch {
        // ignore
      }
      void a.ctx.close();
    };
  }, []);

  useEffect(() => {
    const onVis = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.visibilityState === 'visible' && a.ctx.state === 'suspended') {
        void a.ctx.resume();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    // SFX on real slide changes only
    const last = lastSlideRef.current;
    lastSlideRef.current = slideIndex;
    if (last === null || last === slideIndex) return;

    const ctx = a.ctx;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const t0 = now(ctx);

    // Whoosh: noise burst with filter sweep
    const burst = ctx.createBufferSource();
    burst.buffer = createPinkNoiseBuffer(ctx, 0.6);

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(380, t0);
    bp.frequency.exponentialRampToValueAtTime(1200, t0 + 0.18);
    bp.Q.value = 1.2;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0, t0);
    env.gain.linearRampToValueAtTime(0.35, t0 + 0.05);
    env.gain.linearRampToValueAtTime(0.0, t0 + 0.24);

    burst.connect(bp);
    bp.connect(env);
    env.connect(a.sfxGain);

    burst.start();
    burst.stop(t0 + 0.25);
  }, [slideIndex]);

  return null;
}
