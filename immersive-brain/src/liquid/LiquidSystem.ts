import liquidWGSL from './liquid.wgsl?raw';
import { createGridQuad } from './mesh';
import { stepSpring, type SpringState } from './spring';
import type { LiquidEffectOptions, LiquidHandle, LiquidKind } from './types';

type NormalizedLiquidEffectOptions = {
  kind: LiquidKind;
  radiusPx: number;
  baseAlpha: number;
  glowAlpha: number;
  redGlow: number;
  groupId?: string;
  dynamicRect: boolean;
};

type InstanceInternal = {
  id: number;
  el: HTMLElement;
  options: NormalizedLiquidEffectOptions;
  groupId: string | null;

  // rect in CSS pixels
  rect: { x: number; y: number; w: number; h: number };
  rectDirty: boolean;

  // pointer state (local 0..1)
  pointerX: number;
  pointerY: number;
  pointerVX: number;
  pointerVY: number;
  lastPointerClientX: number;
  lastPointerClientY: number;
  hasPointer: boolean;

  // target states
  hoverTarget: number;
  pressTarget: number;

  // smoothed states
  hover: SpringState;
  press: SpringState;
  springX: SpringState;
  springY: SpringState;

  // group velocity (set externally)
  groupVx: number;
  groupVy: number;

  // cleanup
  ro: ResizeObserver | null;
  cleanupFns: Array<() => void>;
};

function kindToNumber(kind: LiquidKind): number {
  return kind === 'button' ? 1 : 0;
}

function nowSec() {
  return performance.now() / 1000;
}

export class LiquidSystem {
  private static initPromise: Promise<LiquidSystem | null> | null = null;
  static get(): Promise<LiquidSystem | null> {
    if (!this.initPromise) this.initPromise = LiquidSystem.init();
    return this.initPromise;
  }

  private static async init(): Promise<LiquidSystem | null> {
    if (typeof window === 'undefined') return null;
    const nav = navigator as Navigator & { gpu?: GPU };
    if (!nav.gpu) return null;

    const adapter = await nav.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return null;

    const device = await adapter.requestDevice();
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.background = 'transparent';

    document.body.appendChild(canvas);

    const context = canvas.getContext('webgpu');
    if (!context) {
      canvas.remove();
      return null;
    }

    const format = nav.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format,
      alphaMode: 'premultiplied',
    });

    const sys = new LiquidSystem(device, context, format, canvas);
    sys.start();
    return sys;
  }

  private device: GPUDevice;
  private context: GPUCanvasContext;
  private format: GPUTextureFormat;
  private canvas: HTMLCanvasElement;

  private globalsBuffer: GPUBuffer;
  private instancesBuffer: GPUBuffer;
  private bindGroup: GPUBindGroup;
  private pipeline: GPURenderPipeline;

  private vertexBuffer: GPUBuffer;
  private indexBuffer: GPUBuffer;
  private indexCount: number;

  private instances = new Map<number, InstanceInternal>();
  private elementToId = new WeakMap<HTMLElement, number>();
  private nextId = 1;

  private groupVelocity = new Map<string, { vx: number; vy: number }>();

  private raf: number | null = null;
  private lastT = nowSec();

  private canvasW = 1;
  private canvasH = 1;
  private dpr = 1;

  private constructor(device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement) {
    this.device = device;
    this.context = context;
    this.format = format;
    this.canvas = canvas;

    this.globalsBuffer = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Pre-allocate for a reasonable number of instances.
    const maxInstances = 128;
    const floatsPerInstance = 27;
    this.instancesBuffer = device.createBuffer({
      size: maxInstances * floatsPerInstance * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const module = device.createShaderModule({ code: liquidWGSL });

    this.pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vsMain',
        buffers: [
          {
            arrayStride: 16,
            attributes: [
              { shaderLocation: 0, offset: 0, format: 'float32x2' },
              { shaderLocation: 1, offset: 8, format: 'float32x2' },
            ],
          },
        ],
      },
      fragment: {
        module,
        entryPoint: 'fsMain',
        targets: [
          {
            format,
            blend: {
              color: {
                srcFactor: 'src-alpha',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
            },
            writeMask: GPUColorWrite.ALL,
          },
        ],
      },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.globalsBuffer } },
        { binding: 1, resource: { buffer: this.instancesBuffer } },
      ],
    });

    const mesh = createGridQuad(18);
    this.indexCount = mesh.indices.length;

    this.vertexBuffer = device.createBuffer({
      size: mesh.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, mesh.vertices);

    this.indexBuffer = device.createBuffer({
      size: mesh.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, mesh.indices);
  }

  attach(element: HTMLElement, options: LiquidEffectOptions = {}): LiquidHandle {
    const existing = this.elementToId.get(element);
    if (existing) {
      const inst = this.instances.get(existing);
      if (inst) {
        const normalized = this.normalizeOptions(options);
        inst.options = normalized;
        inst.groupId = normalized.groupId ?? null;
      }
      return {
        detach: () => this.detach(element),
        setGroupVelocity: (vx, vy) => {
          const gid = inst?.groupId;
          if (gid) this.setGroupVelocity(gid, vx, vy);
        },
      };
    }

    const id = this.nextId++;
    this.elementToId.set(element, id);

    const normalized = this.normalizeOptions(options);

    const inst: InstanceInternal = {
      id,
      el: element,
      options: normalized,
      groupId: options.groupId ?? null,

      rect: { x: 0, y: 0, w: 1, h: 1 },
      rectDirty: true,

      pointerX: 0.5,
      pointerY: 0.45,
      pointerVX: 0,
      pointerVY: 0,
      lastPointerClientX: 0,
      lastPointerClientY: 0,
      hasPointer: false,

      hoverTarget: 0,
      pressTarget: 0,

      hover: { x: 0, v: 0 },
      press: { x: 0, v: 0 },
      springX: { x: 0, v: 0 },
      springY: { x: 0, v: 0 },

      groupVx: 0,
      groupVy: 0,

      ro: null,
      cleanupFns: [],
    };

    // Observe size changes
    if (!inst.options.dynamicRect && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        inst.rectDirty = true;
      });
      ro.observe(element);
      inst.ro = ro;
    }

    // Track scroll/resize to update rect
    const onScrollOrResize = () => {
      inst.rectDirty = true;
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    inst.cleanupFns.push(() => window.removeEventListener('scroll', onScrollOrResize));
    inst.cleanupFns.push(() => window.removeEventListener('resize', onScrollOrResize));

    // Pointer interactions
    const onPointerEnter = () => {
      inst.hoverTarget = 1;
      inst.hasPointer = true;
      inst.rectDirty = true;
    };
    const onPointerLeave = () => {
      inst.hoverTarget = 0;
      inst.pressTarget = 0;
      inst.hasPointer = false;
    };
    const onPointerDown = () => {
      inst.pressTarget = 1;
    };
    const onPointerUp = () => {
      inst.pressTarget = 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      const r = element.getBoundingClientRect();
      const lx = (e.clientX - r.left) / Math.max(1, r.width);
      const ly = (e.clientY - r.top) / Math.max(1, r.height);
      inst.pointerX = Math.max(0, Math.min(1, lx));
      inst.pointerY = Math.max(0, Math.min(1, ly));

      if (!inst.hasPointer) {
        inst.hasPointer = true;
        inst.lastPointerClientX = e.clientX;
        inst.lastPointerClientY = e.clientY;
        return;
      }

      // Velocity in "element widths per second".
      const dx = e.clientX - inst.lastPointerClientX;
      const dy = e.clientY - inst.lastPointerClientY;
      inst.lastPointerClientX = e.clientX;
      inst.lastPointerClientY = e.clientY;

      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      inst.pointerVX = dx / w;
      inst.pointerVY = dy / h;
    };

    element.addEventListener('pointerenter', onPointerEnter);
    element.addEventListener('pointerleave', onPointerLeave);
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerLeave);
    element.addEventListener('pointermove', onPointerMove);

    inst.cleanupFns.push(() => element.removeEventListener('pointerenter', onPointerEnter));
    inst.cleanupFns.push(() => element.removeEventListener('pointerleave', onPointerLeave));
    inst.cleanupFns.push(() => element.removeEventListener('pointerdown', onPointerDown));
    inst.cleanupFns.push(() => element.removeEventListener('pointerup', onPointerUp));
    inst.cleanupFns.push(() => element.removeEventListener('pointercancel', onPointerLeave));
    inst.cleanupFns.push(() => element.removeEventListener('pointermove', onPointerMove));

    this.instances.set(id, inst);

    return {
      detach: () => this.detach(element),
      setGroupVelocity: (vx, vy) => {
        const gid = inst.groupId;
        if (gid) this.setGroupVelocity(gid, vx, vy);
      },
    };
  }

  detach(element: HTMLElement) {
    const id = this.elementToId.get(element);
    if (!id) return;
    const inst = this.instances.get(id);
    if (inst) {
      inst.ro?.disconnect();
      inst.cleanupFns.forEach((fn) => fn());
    }
    this.instances.delete(id);
    this.elementToId.delete(element);
  }

  setGroupVelocity(groupId: string, vx: number, vy: number) {
    this.groupVelocity.set(groupId, { vx, vy });
  }

  private normalizeOptions(options: LiquidEffectOptions): NormalizedLiquidEffectOptions {
    return {
      kind: options.kind ?? 'card',
      radiusPx: options.radiusPx ?? 18,
      baseAlpha: options.baseAlpha ?? 0.35,
      glowAlpha: options.glowAlpha ?? 1.0,
      redGlow: options.redGlow ?? 1.0,
      groupId: options.groupId,
      dynamicRect: options.dynamicRect ?? false,
    };
  }

  private start() {
    const tick = () => {
      this.raf = window.requestAnimationFrame(tick);
      this.frame();
    };
    this.raf = window.requestAnimationFrame(tick);
  }

  private resizeCanvasIfNeeded() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));

    if (w === this.canvasW && h === this.canvasH && dpr === this.dpr) return;

    this.dpr = dpr;
    this.canvasW = w;
    this.canvasH = h;
    this.canvas.width = w;
    this.canvas.height = h;

    // Reconfigure (safe) to match size.
    const nav = navigator as Navigator & { gpu?: GPU };
    const format = nav.gpu?.getPreferredCanvasFormat() ?? this.format;
    this.context.configure({ device: this.device, format, alphaMode: 'premultiplied' });
  }

  private frame() {
    const t = nowSec();
    const dt = Math.max(0.001, Math.min(0.05, t - this.lastT));
    this.lastT = t;

    if (this.instances.size === 0) return;

    this.resizeCanvasIfNeeded();

    const globals = new Float32Array([this.canvasW, this.canvasH, t, this.dpr]);
    this.device.queue.writeBuffer(this.globalsBuffer, 0, globals);

    const floatsPerInstance = 27;
    const tmp = new Float32Array(this.instances.size * floatsPerInstance);

    let idx = 0;
    for (const inst of this.instances.values()) {
      // Update rect (CSS px) -> scale to device pixels
      if (inst.options.dynamicRect || inst.rectDirty) {
        const r = inst.el.getBoundingClientRect();
        inst.rect.x = r.left * this.dpr;
        inst.rect.y = r.top * this.dpr;
        inst.rect.w = Math.max(1, r.width * this.dpr);
        inst.rect.h = Math.max(1, r.height * this.dpr);
        inst.rectDirty = false;
      }

      // Pull group velocity
      if (inst.groupId) {
        const gv = this.groupVelocity.get(inst.groupId);
        if (gv) {
          inst.groupVx = gv.vx;
          inst.groupVy = gv.vy;
        } else {
          inst.groupVx = 0;
          inst.groupVy = 0;
        }
      }

      // Spring smoothing
      inst.hover = stepSpring(inst.hover, inst.hoverTarget, dt, 28, 9);
      inst.press = stepSpring(inst.press, inst.pressTarget, dt, 50, 12);

      // Inertia target from pointer velocity
      const inertiaX = -inst.pointerVX * (0.9 + 0.7 * inst.hover.x);
      const inertiaY = -inst.pointerVY * (0.9 + 0.7 * inst.hover.x);
      inst.springX = stepSpring(inst.springX, inertiaX, dt, 40, 10);
      inst.springY = stepSpring(inst.springY, inertiaY, dt, 40, 10);

      const kindNum = kindToNumber(inst.options.kind);

      // Pack
      const o = inst.options;
      tmp[idx++] = inst.rect.x;
      tmp[idx++] = inst.rect.y;
      tmp[idx++] = inst.rect.w;
      tmp[idx++] = inst.rect.h;

      tmp[idx++] = o.radiusPx * this.dpr;
      tmp[idx++] = kindNum;
      tmp[idx++] = inst.hover.x;
      tmp[idx++] = inst.press.x;

      tmp[idx++] = inst.pointerX;
      tmp[idx++] = inst.pointerY;
      tmp[idx++] = inst.pointerVX;
      tmp[idx++] = inst.pointerVY;

      tmp[idx++] = inst.springX.x;
      tmp[idx++] = inst.springY.x;

      tmp[idx++] = inst.groupVx;
      tmp[idx++] = inst.groupVy;

      tmp[idx++] = o.baseAlpha;
      tmp[idx++] = o.glowAlpha;
      tmp[idx++] = o.redGlow;

      tmp[idx++] = 0; // n1x
      tmp[idx++] = 0; // n1y
      tmp[idx++] = 0; // n2x
      tmp[idx++] = 0; // n2y
      tmp[idx++] = 0; // r1
      tmp[idx++] = 0; // r2
      tmp[idx++] = 0; // bridge
      tmp[idx++] = 0; // pad
    }

    this.device.queue.writeBuffer(this.instancesBuffer, 0, tmp);

    const encoder = this.device.createCommandEncoder();
    const view = this.context.getCurrentTexture().createView();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
        },
      ],
    });

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, 'uint16');
    pass.drawIndexed(this.indexCount, this.instances.size);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
