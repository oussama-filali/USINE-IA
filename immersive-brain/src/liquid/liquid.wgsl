struct Globals {
  canvasSize : vec2<f32>,
  time : f32,
  dpr : f32,
}

struct Instance {
  // screen-space rect in CSS pixels
  x : f32,
  y : f32,
  w : f32,
  h : f32,

  radius : f32,
  kind : f32, // 0=card, 1=button
  hover : f32,
  press : f32,

  // pointer in local 0..1
  px : f32,
  py : f32,
  vx : f32,
  vy : f32,

  // spring offset (local -1..1)
  sx : f32,
  sy : f32,

  // group / drag info
  groupVx : f32,
  groupVy : f32,

  // visual
  baseA : f32,
  glowA : f32,
  redGlow : f32,

  // neighbors / bridge data
  // For cards/buttons: neighbor delta vectors (normalized roughly to element size)
  // For bridges (kind=2): centers in 0..1 space of the union rect
  n1x : f32,
  n1y : f32,
  n2x : f32,
  n2y : f32,

  // For bridges: radii in pixels (in union space)
  r1 : f32,
  r2 : f32,

  // 0..1 strength of the bridge (typically driven by drag velocity)
  bridge : f32,
  _pad0 : f32,
}

@group(0) @binding(0) var<uniform> globals : Globals;
@group(0) @binding(1) var<storage, read> instances : array<Instance>;

struct VSIn {
  @location(0) p : vec2<f32>,  // local -0.5..0.5
  @location(1) uv : vec2<f32>, // 0..1
  @builtin(instance_index) iid : u32,
}

struct VSOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
  @location(1) local : vec2<f32>,
  @location(2) rect : vec4<f32>, // x,y,w,h
  @location(3) k : vec4<f32>, // radius, hover, press, kind
  @location(4) pv : vec4<f32>, // px,py,vx,vy
  @location(5) s : vec2<f32>, // sx,sy
  @location(6) gv : vec2<f32>, // groupV
  @location(7) v : vec3<f32>,  // baseA, glowA, redGlow
}

fn saturate(x: f32) -> f32 { return clamp(x, 0.0, 1.0); }

fn easeOutCubic(x: f32) -> f32 {
  let t = saturate(x);
  let inv = 1.0 - t;
  return 1.0 - inv*inv*inv;
}

fn len2(v: vec2<f32>) -> f32 { return sqrt(max(1e-8, dot(v, v))); }

@vertex
fn vsMain(input: VSIn) -> VSOut {
  let inst = instances[input.iid];

  var out : VSOut;

  // Local coordinates
  let uv = input.uv;
  let local = input.p; // -0.5..0.5

  // Cursor in local space -0.5..0.5
  let c = vec2<f32>(inst.px - 0.5, inst.py - 0.5);

  // Base displacement amplitude (jelly)
  let speed = length(vec2<f32>(inst.vx, inst.vy));
  let pressBoost = mix(1.0, 1.7, inst.press);
  let hoverBoost = mix(0.65, 1.0, inst.hover);
  let amp = (0.06 + 0.10 * easeOutCubic(speed)) * pressBoost * hoverBoost;

  // Distance-based falloff
  let d = distance(local, c);
  let fall = exp(-d * 5.5);

  // Direction away from cursor
  let dir = normalize(local - c + vec2<f32>(1e-4, 1e-4));

  // Group drag wave (carousel)
  let gspeed = length(vec2<f32>(inst.groupVx, inst.groupVy));
  let wave = sin(globals.time * 9.0 + uv.x * 8.0) * 0.012 * saturate(gspeed * 1.2);

  // Spring offset adds inertia
  let spring = vec2<f32>(inst.sx, inst.sy) * 0.05;

  // Neighbor pull (cards): softly pull edges towards neighbors during movement
  var pull = vec2<f32>(0.0, 0.0);
  if (inst.kind < 1.5) {
    let edge = smoothstep(0.18, 0.49, abs(local.x));
    let n1 = vec2<f32>(inst.n1x, inst.n1y);
    let n2 = vec2<f32>(inst.n2x, inst.n2y);
    let n1Dir = n1 / len2(n1);
    let n2Dir = n2 / len2(n2);
    let pullAmp = 0.010 * edge * saturate(gspeed * 0.9);
    pull = (n1Dir + n2Dir) * pullAmp;
  }

  // Final displaced local
  let displaced = local + dir * (amp * fall) + spring + vec2<f32>(wave, 0.0) + pull;

  // Convert to screen pixels (CSS px)
  let sx = inst.x + (displaced.x + 0.5) * inst.w;
  let sy = inst.y + (displaced.y + 0.5) * inst.h;

  // To clip space
  let clipX = (sx / globals.canvasSize.x) * 2.0 - 1.0;
  let clipY = 1.0 - (sy / globals.canvasSize.y) * 2.0;

  out.pos = vec4<f32>(clipX, clipY, 0.0, 1.0);
  out.uv = uv;
  out.local = displaced;
  out.rect = vec4<f32>(inst.x, inst.y, inst.w, inst.h);
  out.k = vec4<f32>(inst.radius, inst.hover, inst.press, inst.kind);
  out.pv = vec4<f32>(inst.px, inst.py, inst.vx, inst.vy);
  out.s = vec2<f32>(inst.sx, inst.sy);
  out.gv = vec2<f32>(inst.groupVx, inst.groupVy);
  out.v = vec3<f32>(inst.baseA, inst.glowA, inst.redGlow);
  return out;
}

fn sdRoundRect(p: vec2<f32>, b: vec2<f32>, r: f32) -> f32 {
  // p: centered point in pixels; b: half-size in pixels
  let q = abs(p) - (b - vec2<f32>(r));
  let outside = length(max(q, vec2<f32>(0.0))) - r;
  let inside = min(max(q.x, q.y), 0.0);
  return outside + inside;
}

@fragment
fn fsMain(input: VSOut) -> @location(0) vec4<f32> {
  let radius = input.k.x;
  let hover = input.k.y;
  let press = input.k.z;
  let kind = input.k.w;

  // Local pixel position inside rect
  let rectW = input.rect.z;
  let rectH = input.rect.w;
  let px = (input.uv.x - 0.5) * rectW;
  let py = (input.uv.y - 0.5) * rectH;

  var sdf = 0.0;
  var alpha = 0.0;
  let aa = 1.25;

  if (kind > 1.5) {
    // Bridge metaball between two centers inside the union rect.
    let c1 = vec2<f32>(instances[input.iid].n1x, instances[input.iid].n1y);
    let c2 = vec2<f32>(instances[input.iid].n2x, instances[input.iid].n2y);
    let r1 = max(6.0, instances[input.iid].r1);
    let r2 = max(6.0, instances[input.iid].r2);
    let p = vec2<f32>(input.uv.x, input.uv.y);

    let d1 = length((p - c1) * vec2<f32>(rectW, rectH));
    let d2 = length((p - c2) * vec2<f32>(rectW, rectH));

    // Soft-body field (distance field-ish)
    let f1 = exp(-d1 / (r1 * 0.92));
    let f2 = exp(-d2 / (r2 * 0.92));
    let field = f1 + f2;

    // Gate by a rounded-rect mask so the bridge stays confined
    sdf = sdRoundRect(vec2<f32>(px, py), vec2<f32>(rectW * 0.5, rectH * 0.5), radius);
    let mask = 1.0 - smoothstep(0.0, aa, sdf);

    let strength = saturate(instances[input.iid].bridge);
    alpha = smoothstep(1.05, 1.32, field) * mask * strength;
    if (alpha <= 0.001) { discard; }
  } else {
    // Signed distance to rounded rect border
    sdf = sdRoundRect(vec2<f32>(px, py), vec2<f32>(rectW * 0.5, rectH * 0.5), radius);
    alpha = 1.0 - smoothstep(0.0, aa, sdf);
    if (alpha <= 0.001) { discard; }
  }

  // Glass base: subtle gradient + moving highlight driven by pointer/time
  let c = vec2<f32>(input.pv.x, input.pv.y);
  let hl = 0.35 + 0.65 * exp(-distance(input.uv, c) * 6.0);
  let sweep = 0.5 + 0.5 * sin(globals.time * 1.6 + input.uv.x * 4.0 - input.uv.y * 2.5);

  let base = vec3<f32>(1.0, 1.0, 1.0);
  let glass = (0.06 + 0.06 * sweep) * base + (0.10 * hl) * base;

  // Glow on edges
  let edge = saturate(1.0 - (abs(sdf) / 10.0));
  let glow = edge * edge;

  // Red glow for active elements
  let activeAmount = saturate(hover * 0.7 + press * 1.0);
  let red = vec3<f32>(1.0, 0.15, 0.25) * activeAmount * input.v.z;

  // Output
  let outA = alpha * input.v.x;
  let glowA = glow * (0.20 + 0.55 * activeAmount) * input.v.y;

  let rgb = glass + red * 0.8;
  rgb += base * glowA * 0.9;

  return vec4<f32>(rgb, outA + glowA);
}
