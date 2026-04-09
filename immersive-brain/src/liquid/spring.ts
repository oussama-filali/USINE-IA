export type SpringState = {
  x: number;
  v: number;
};

export function stepSpring(
  state: SpringState,
  target: number,
  dt: number,
  stiffness: number,
  damping: number
): SpringState {
  // Critically-damped-ish spring, simple explicit integration.
  // x'' = k*(target-x) - c*x'
  const x = state.x;
  const v = state.v;

  const a = stiffness * (target - x) - damping * v;
  const vNext = v + a * dt;
  const xNext = x + vNext * dt;

  return { x: xNext, v: vNext };
}
