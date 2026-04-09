export type LiquidKind = 'card' | 'button';

export type LiquidEffectOptions = {
  kind?: LiquidKind;
  radiusPx?: number;
  baseAlpha?: number;
  glowAlpha?: number;
  redGlow?: number;
  groupId?: string;
  dynamicRect?: boolean;
};

export type LiquidHandle = {
  detach: () => void;
  setGroupVelocity: (vx: number, vy: number) => void;
};
