import type { LiquidEffectOptions, LiquidHandle } from './types';
import { LiquidSystem } from './LiquidSystem';

export type { LiquidEffectOptions, LiquidHandle } from './types';

const handles = new WeakMap<HTMLElement, LiquidHandle>();

export async function attachLiquidEffect(element: HTMLElement, options: LiquidEffectOptions = {}): Promise<LiquidHandle> {
  const existing = handles.get(element);
  if (existing) return existing;

  const sys = await LiquidSystem.get();
  if (!sys) {
    const noop: LiquidHandle = {
      detach: () => {},
      setGroupVelocity: () => {},
    };
    handles.set(element, noop);
    return noop;
  }

  const handle = sys.attach(element, options);
  handles.set(element, handle);
  return handle;
}

export async function setLiquidGroupVelocity(groupId: string, vx: number, vy: number): Promise<void> {
  const sys = await LiquidSystem.get();
  if (!sys) return;
  sys.setGroupVelocity(groupId, vx, vy);
}
