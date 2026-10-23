// The collapse / expand engine: nodes → fixed overlay of droplets → Web Animations (transform, opacity,
// border-radius) → cleanup. Every timing lives in one shared timeline p (0 = items in place, 1 = all fused into the
// single element): a collapse plays it forwards, an expand backwards, reverse() flips it wherever it is.
import { ensureGoo, gooEnabled } from './goo';
import { nodeOf, registry, type Registry } from './registry';
import type {
  CollapseOptions,
  ExpandOptions,
  SlurpAnimation,
  SlurpDefaults,
  SlurpNode,
  SlurpOptions,
  SlurpPhase,
  SlurpResult,
} from './types';

export const MOTION_DEFAULTS: SlurpDefaults = {
  duration: 650,
  stagger: 0.35,
  curve: 0.16,
  swell: 1.08,
  drop: 18,
  goo: 'auto',
  ghost: 'shape',
  order: 'distance',
  reducedMotion: 'user',
  interrupt: 'reverse',
};

/** Reduced motion: a short fade from the items to the single element. */
export const REDUCED_DURATION = 150;
/** Beyond this, the farthest items only fade. */
export const MAX_DROPLETS = 40;
/** The element keeps its content during the first 18% of its travel, then only the droplet is left. */
const CONTENT_FADE = 0.18;
const SNAPSHOT_FADE = 0.15;
const PATH_SAMPLES = 10;
const CORE_SAMPLES = 40;
const OVERLAY_Z = '60';
/** Inputs stay blocked at most this long after the end. */
const INERT_GRACE = 100;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const round = (v: number) => Math.round(v * 100) / 100;

type Resolved = SlurpDefaults & Pick<SlurpOptions, 'container' | 'signal' | 'onPhase'>;

interface Cell {
  node: SlurpNode;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  d: number;
  /** Unit normal of the straight path, signed so paths bow outwards. */
  nx: number;
  ny: number;
  lead: boolean;
  /** Departure, on the shared timeline. */
  start: number;
  mode: 'drop' | 'fade';
}

// ---------- Hidden state, kept across runs (a collapse leaves its items hidden until restore()) ----------

const savedVisibility = new WeakMap<HTMLElement, string>();

function hide(el: HTMLElement) {
  if (!savedVisibility.has(el)) savedVisibility.set(el, el.style.visibility);
  el.dataset.animationState = 'hidden';
  el.style.visibility = 'hidden';
}

function show(el: HTMLElement) {
  if (savedVisibility.has(el)) {
    el.style.visibility = savedVisibility.get(el) ?? '';
    savedVisibility.delete(el);
  }
  delete el.dataset.animationState;
}

// ---------- Busy region: aria-busy + inert, at most duration + 100ms ----------

function commonAncestor(els: HTMLElement[]): HTMLElement | null {
  let root = els[0]?.parentElement ?? null;
  while (root && !els.every((el) => root?.contains(el))) root = root.parentElement;
  return root;
}

function markBusy(items: HTMLElement[], hub: HTMLElement | undefined, container?: HTMLElement) {
  if (!items.length) return () => undefined;
  const region = container ?? commonAncestor(items);
  const whole =
    region &&
    region !== document.body &&
    region !== document.documentElement &&
    !(hub && region.contains(hub));
  const targets = whole ? [region] : items;
  const saved = targets.map(
    (el) => [el, el.hasAttribute('inert'), el.getAttribute('aria-busy')] as const,
  );
  for (const el of targets) {
    el.setAttribute('inert', '');
    el.setAttribute('aria-busy', 'true');
  }
  let done = false;
  return () => {
    if (done) return;
    done = true;
    for (const [el, inert, busy] of saved) {
      if (!inert) el.removeAttribute('inert');
      if (busy === null) el.removeAttribute('aria-busy');
      else el.setAttribute('aria-busy', busy);
    }
  };
}

// ---------- Geometry and timing ----------

function prefersReduced(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function layout(items: SlurpNode[], hub: SlurpNode | null, o: Resolved, leads: Set<string> | null) {
  const tx = hub ? hub.rect.x + hub.rect.width / 2 : 0;
  const ty = hub ? hub.rect.y + hub.rect.height / 2 : 0;
  const cells: Cell[] = items.map((node) => {
    const { x: left, y: top, width, height } = node.rect;
    const x = left + width / 2;
    const y = top + height / 2;
    const dx = tx - x;
    const dy = ty - y;
    const d = Math.hypot(dx, dy) || 1;
    const side = dx >= 0 ? 1 : -1;
    return {
      node,
      x,
      y,
      w: Math.max(1, width),
      h: Math.max(1, height),
      r: parseFloat(node.radius) || 24,
      d,
      nx: (-dy / d) * side,
      ny: (dx / d) * side,
      lead: leads ? leads.has(node.key) : !!node.lead,
      start: 0,
      mode: node.disabled ? 'fade' : 'drop',
    };
  });

  const stagger = clamp(o.stagger, 0, 0.8);
  // The farthest regular item departs a little before the lead, which goes last.
  const spread = stagger * (6 / 7);
  const ranked = cells.filter((c) => !c.lead);
  if (o.order === 'distance') {
    const max = Math.max(1, ...ranked.map((c) => c.d));
    for (const c of ranked) c.start = (c.d / max) * spread;
  } else {
    const sorted =
      o.order === 'dom'
        ? ranked
        : [...ranked].sort((a, b) =>
            (o.order as (a: SlurpNode, b: SlurpNode) => number)(a.node, b.node),
          );
    const last = Math.max(1, sorted.length - 1);
    sorted.forEach((c, i) => (c.start = (i / last) * spread));
  }
  for (const c of cells) if (c.lead) c.start = stagger;

  // At most MAX_DROPLETS droplets: the lead first, then the nearest; the others fade.
  const candidates = cells
    .filter((c) => c.mode === 'drop')
    .sort((a, b) => Number(b.lead) - Number(a.lead) || a.d - b.d);
  for (const c of candidates.slice(MAX_DROPLETS)) c.mode = 'fade';

  return { cells, tx, ty, travel: Math.max(0.2, 1 - stagger - 0.03) };
}

/**
 * Box of everything that moves (items, bowed paths, swollen single element) plus room for the blur, clipped to the
 * viewport. The goo filter costs in proportion to its area, so the overlay covers only this box.
 */
function bounds(
  drops: Cell[],
  hub: SlurpNode,
  g: { tx: number; ty: number },
  o: Resolved,
  blur: number,
) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const add = (x: number, y: number, rx: number, ry: number) => {
    x0 = Math.min(x0, x - rx);
    y0 = Math.min(y0, y - ry);
    x1 = Math.max(x1, x + rx);
    y1 = Math.max(y1, y + ry);
  };
  for (const c of drops) {
    add(c.x, c.y, c.w / 2, c.h / 2);
    // The path stays inside the triangle item / control point / target.
    const bow = 2 * o.curve * c.d;
    const r = Math.max(c.w, c.h) / 2;
    add((c.x + g.tx) / 2 + c.nx * bow, (c.y + g.ty) / 2 + c.ny * bow, r, r);
  }
  const { width: w, height: h } = hub.rect;
  add(g.tx, g.ty, (w * o.swell) / 2, (h * (1 + (o.swell - 1) * 3.5)) / 2);
  const pad = blur * 3;
  const vw = typeof innerWidth === 'number' ? innerWidth : Infinity;
  const vh = typeof innerHeight === 'number' ? innerHeight : Infinity;
  const left = Math.max(0, Math.floor(x0 - pad));
  const top = Math.max(0, Math.floor(y0 - pad));
  return {
    ox: left,
    oy: top,
    width: Math.max(0, Math.min(vw, Math.ceil(x1 + pad)) - left),
    height: Math.max(0, Math.min(vh, Math.ceil(y1 + pad)) - top),
  };
}

/** Quadratic Bézier from the item to the single element, bowed sideways by `curve`. */
function pointAt(c: Cell, tx: number, ty: number, curve: number, e: number) {
  const bow = 2 * curve * c.d;
  const cx = (c.x + tx) / 2 + c.nx * bow;
  const cy = (c.y + ty) / 2 + c.ny * bow;
  const a = (1 - e) * (1 - e);
  const b = 2 * (1 - e) * e;
  const z = e * e;
  return { x: a * c.x + b * cx + z * tx, y: a * c.y + b * cy + z * ty };
}

function dropletFrames(
  c: Cell,
  g: { tx: number; ty: number; travel: number; ox: number; oy: number },
  o: Resolved,
  ghosted: boolean,
): Keyframe[] {
  const state = (k: number): Keyframe => {
    const e = k * k; // ease-in: slow departure, fast fusion
    const p = pointAt(c, g.tx, g.ty, o.curve, e);
    const shrink = Math.pow(e, 0.7);
    const w = lerp(c.w, o.drop, shrink);
    const h = lerp(c.h, o.drop, shrink);
    const sx = w / c.w;
    const sy = h / c.h;
    const r = lerp(c.r, Math.min(w, h) / 2, clamp(e * 1.5));
    const frame: Keyframe = {
      transform: `translate(${round(p.x - g.ox - c.w / 2)}px, ${round(p.y - g.oy - c.h / 2)}px) scale(${round(sx * 100) / 100}, ${round(sy * 100) / 100})`,
      borderRadius: `${round(r / sx)}px / ${round(r / sy)}px`,
    };
    if (c.node.tint !== c.node.fill) {
      frame.backgroundColor = `color-mix(in oklab, ${c.node.tint} ${Math.round(e * 100)}%, ${c.node.fill})`;
    }
    return frame;
  };
  const before = ghosted ? 1 : 0;
  const frames: Keyframe[] = [{ offset: 0, ...state(0), opacity: before }];
  for (let i = 0; i <= PATH_SAMPLES; i++) {
    const k = i / PATH_SAMPLES;
    frames.push({
      offset: c.start + g.travel * k,
      ...state(k),
      opacity: i === 0 ? before : i === PATH_SAMPLES ? 0 : 1,
    });
  }
  frames.push({ offset: 1, ...state(1), opacity: 0 });
  return frames;
}

/** The single element's swell: a pulse while each droplet closes in (e from 0.75 to 1). */
function swellAt(p: number, cells: Cell[], travel: number): number {
  let s = 0;
  for (const c of cells) {
    if (c.mode !== 'drop') continue;
    const k = clamp((p - c.start) / travel);
    const e = k * k;
    if (e > 0.75 && e < 1) s = Math.max(s, Math.sin((Math.PI * (e - 0.75)) / 0.25));
  }
  return s;
}

function coreFrames(
  hub: SlurpNode,
  cells: Cell[],
  travel: number,
  swell: number,
  origin: { ox: number; oy: number },
): Keyframe[] {
  const { width: w, height: h } = hub.rect;
  const x = hub.rect.x - origin.ox;
  const y = hub.rect.y - origin.oy;
  const own = parseFloat(hub.radius);
  const r = own > 0 ? Math.min(own, w / 2, h / 2) : Math.min(w, h) / 2;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= CORE_SAMPLES; i++) {
    const p = i / CORE_SAMPLES;
    const s = swellAt(p, cells, travel);
    const sx = 1 + (swell - 1) * s;
    const sy = 1 + (swell - 1) * 3.5 * s;
    frames.push({
      offset: p,
      transform: `translate(${round(x)}px, ${round(y)}px) scale(${round(sx * 1000) / 1000}, ${round(sy * 1000) / 1000})`,
      borderRadius: `${round((r * sy) / sx)}px / ${round(r)}px`,
      opacity: i === 0 || i === CORE_SAMPLES ? 0 : 1,
    });
  }
  return frames;
}

function contentFrames(start: number, end: number, from: number): Keyframe[] {
  return [
    { offset: 0, opacity: from },
    { offset: start, opacity: from },
    { offset: Math.min(1, end), opacity: 0 },
    { offset: 1, opacity: 0 },
  ];
}

function shape(el: HTMLElement, w: number, h: number, fill: string) {
  Object.assign(el.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${w}px`,
    height: `${h}px`,
    background: fill,
    opacity: '0',
    transformOrigin: '50% 50%',
    willChange: 'transform, opacity',
  });
}

function snapshotOf(el: HTMLElement, w: number, h: number): HTMLElement {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  for (const n of clone.querySelectorAll('[id]')) n.removeAttribute('id');
  const cs = getComputedStyle(el);
  Object.assign(clone.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    margin: '0',
    width: `${w}px`,
    height: `${h}px`,
    boxSizing: 'border-box',
    color: cs.color,
    font: cs.font,
    pointerEvents: 'none',
    visibility: 'visible',
  });
  return clone;
}

// ---------- Running transitions ----------

interface Active {
  run: Controller;
  els: Set<HTMLElement>;
  keys: Set<string>;
  hubKey: string | null;
}

interface Controller extends SlurpAnimation {
  /** Direction on the shared timeline: true while moving toward "all fused". */
  readonly towardOne: boolean;
}

const active = new Set<Active>();

const settled = (result: SlurpResult): SlurpAnimation => {
  const self: SlurpAnimation = {
    finished: Promise.resolve(result),
    cancel: () => undefined,
    finish: () => undefined,
    reverse: () => self,
    restore: () => undefined,
  };
  return self;
};

interface Plan {
  items: SlurpNode[];
  hub: SlurpNode | null;
  /** Starts from "all fused" and plays toward the items (expand). */
  backwards: boolean;
  leads: Set<string> | null;
}

function start(plan: Plan, o: Resolved): Controller {
  const { items, hub, backwards } = plan;
  const phase = (p: SlurpPhase) => o.onPhase?.(p);
  phase('prepare');

  const canAnimate =
    typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  const reduced =
    !hub || o.reducedMotion === 'always' || (o.reducedMotion === 'user' && prefersReduced());
  const duration = reduced ? REDUCED_DURATION : Math.max(1, o.duration);
  const geo = layout(items, hub, o, plan.leads);
  const { cells, travel } = geo;
  const els = cells.map((c) => c.node.el).filter((el): el is HTMLElement => !!el);

  let towardOne = !backwards;
  let done = false;
  let resolve: (r: SlurpResult) => void = () => undefined;
  const finished = new Promise<SlurpResult>((r) => (resolve = r));
  const animations: Animation[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];
  let layer: HTMLElement | null = null;
  let unbusy = () => {};
  let inertTimer: ReturnType<typeof setTimeout> | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  const entry: Active = {
    run: null as unknown as Controller,
    els: new Set(hub?.el ? [...els, hub.el] : els),
    keys: new Set(cells.map((c) => c.node.key)),
    hubKey: hub?.key ?? null,
  };

  const settle = (atOne: boolean, cancelled = false) => {
    if (done) return;
    done = true;
    for (const t of timers) clearTimeout(t);
    clearTimeout(inertTimer);
    clearTimeout(watchdog);
    o.signal?.removeEventListener('abort', onAbort);
    // Hide first, then drop the animation effects: no frame shows the items in between.
    for (const el of els) (atOne ? hide : show)(el);
    for (const a of animations) a.cancel();
    layer?.remove();
    unbusy();
    active.delete(entry);
    phase('settle');
    resolve(cancelled ? 'cancelled' : atOne === !backwards ? 'finished' : 'reversed');
  };

  const busy = () => {
    unbusy();
    unbusy = markBusy(els, hub?.el, o.container);
    clearTimeout(inertTimer);
    inertTimer = setTimeout(() => unbusy(), duration + INERT_GRACE);
  };

  const onAbort = () => settle(false, true);

  // A hidden tab draws no frames, so `finish` never fires: settle when the time is up and the timeline has stopped.
  // While it still moves (a late first frame, a busy device) or is paused on purpose, wait for the rest.
  const guard = () => {
    clearTimeout(watchdog);
    if (!master) return;
    const at = Number(master.currentTime ?? 0);
    const left = master.playbackRate >= 0 ? duration - at : at;
    watchdog = setTimeout(
      () => {
        const moving = master?.playState === 'running' && Number(master.currentTime ?? 0) !== at;
        if (master?.playState === 'paused' || moving) guard();
        else settle(towardOne);
      },
      Math.max(0, left) + INERT_GRACE,
    );
  };

  const controller: Controller = {
    finished,
    get towardOne() {
      return towardOne;
    },
    cancel: () => settle(false, true),
    finish: () => settle(towardOne),
    reverse() {
      if (done) {
        // Play again the other way, from where the elements are now.
        const fresh = (n: SlurpNode) => (n.el?.isConnected ? { ...n, ...remeasure(n) } : n);
        const again = {
          ...plan,
          items: plan.items.map(fresh),
          hub: hub && fresh(hub),
          backwards: towardOne,
        };
        return start(again, o);
      }
      for (const t of timers) clearTimeout(t);
      towardOne = !towardOne;
      for (const a of animations) a.reverse();
      busy();
      guard();
      return controller;
    },
    restore() {
      if (done) for (const el of els) show(el);
    },
  };
  entry.run = controller;

  if (o.signal?.aborted) {
    settle(false, true);
    return controller;
  }
  o.signal?.addEventListener('abort', onAbort, { once: true });

  if (!canAnimate || !cells.length) {
    // No Web Animations (or nothing to move): jump to the end state.
    queueMicrotask(() => settle(towardOne));
    return controller;
  }

  active.add(entry);
  const timing: KeyframeAnimationOptions = {
    duration,
    fill: 'both',
    easing: 'linear',
    direction: backwards ? 'reverse' : 'normal',
  };
  const opacityOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).opacity) || 1;

  if (reduced) {
    for (const c of cells) {
      const el = c.node.el;
      if (!el) continue;
      show(el);
      animations.push(el.animate(contentFrames(0, 1, opacityOf(el)), timing));
    }
  } else if (hub) {
    const drops = cells.filter((c) => c.mode === 'drop');
    const goo = gooEnabled(o.goo, drops.length);
    layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.dataset.slurpOverlay = '';
    const box = bounds(drops, hub, geo, o, goo?.blur ?? 0);
    Object.assign(layer.style, {
      position: 'fixed',
      left: `${box.ox}px`,
      top: `${box.oy}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
      pointerEvents: 'none',
      contain: 'layout paint',
      zIndex: OVERLAY_Z,
    });
    if (goo) layer.style.filter = `url(#${ensureGoo(goo, o.container)})`;

    const core = document.createElement('div');
    const coreFill = hub.fill || cells[0]?.node.tint || '';
    shape(core, hub.rect.width, hub.rect.height, coreFill);

    for (const c of cells) {
      const el = c.node.el;
      if (el) show(el);
      if (c.mode === 'fade') {
        if (el)
          animations.push(
            el.animate(contentFrames(c.start, c.start + travel, opacityOf(el)), timing),
          );
        continue;
      }
      const ghost = c.node.ghost ?? o.ghost;
      const droplet = document.createElement('div');
      shape(droplet, c.w, c.h, c.node.fill);
      let content: HTMLElement | null = null;
      if (typeof ghost === 'function') content = ghost(c.node);
      else if (ghost === 'snapshot' && el) content = snapshotOf(el, c.w, c.h);
      if (content) droplet.appendChild(content);
      layer.appendChild(droplet);
      animations.push(droplet.animate(dropletFrames(c, { ...geo, ...box }, o, !!content), timing));
      if (content) {
        if (el) hide(el);
        animations.push(
          content.animate(contentFrames(c.start, c.start + travel * SNAPSHOT_FADE, 1), timing),
        );
      } else if (el) {
        animations.push(
          el.animate(
            contentFrames(c.start, c.start + travel * CONTENT_FADE, opacityOf(el)),
            timing,
          ),
        );
      }
    }
    layer.appendChild(core);
    animations.push(core.animate(coreFrames(hub, cells, travel, o.swell, box), timing));
    (o.container ?? document.body).appendChild(layer);
  }

  if (!animations.length) {
    queueMicrotask(() => settle(towardOne));
    return controller;
  }

  // Every animation shares the same timing: the first one tells when the run is over.
  const master = animations[0];
  if (master) master.onfinish = () => settle(towardOne);
  busy();
  guard();

  const arrivals = cells.filter((c) => c.mode === 'drop').map((c) => c.start + travel);
  const first = arrivals.length ? Math.min(...arrivals) : 1;
  const later = (p: SlurpPhase, at: number) => timers.push(setTimeout(() => phase(p), at));
  if (reduced) phase('travel');
  else if (!backwards) {
    phase('travel');
    later('fuse', first * duration);
  } else {
    phase('fuse');
    later('travel', (1 - first) * duration);
  }
  return controller;
}

function remeasure(n: SlurpNode): Partial<SlurpNode> {
  if (!n.el) return {};
  const el = n.el;
  // Measure as laid out, even while hidden by a previous collapse.
  const { rect, radius, fill, tint } = nodeOf(el);
  return { rect, radius, fill, tint };
}

// ---------- Public API ----------

const defined = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;

function sameKeys(a: Set<string>, b: Set<string>) {
  return a.size === b.size && [...a].every((k) => b.has(k));
}

function queued(after: Promise<unknown>, begin: () => SlurpAnimation): SlurpAnimation {
  let real: SlurpAnimation | null = null;
  let cancelled = false;
  const self: SlurpAnimation = {
    finished: after.then(() => {
      if (cancelled) return 'cancelled' as const;
      real = begin();
      return real.finished;
    }),
    cancel() {
      cancelled = true;
      real?.cancel();
    },
    finish: () => real?.finish(),
    reverse: () => (real ? real.reverse() : self),
    restore: () => real?.restore(),
  };
  return self;
}

/** The same run seen by the opposite request: its start is this caller's goal. */
function flipped(run: SlurpAnimation): SlurpAnimation {
  const swap = (r: SlurpResult): SlurpResult =>
    r === 'finished' ? 'reversed' : r === 'reversed' ? 'finished' : r;
  const self: SlurpAnimation = {
    finished: run.finished.then(swap),
    cancel: () => run.cancel(),
    finish: () => run.finish(),
    reverse: () => (run.reverse(), self),
    restore: () => run.restore(),
  };
  return self;
}

/**
 * Runs a transition between `from` and `to`: n → 1 collapses, 1 → n expands, 1 → 1 morphs.
 * n → m (and a missing single element) fades. Resolves refs and measures now, writes right after.
 */
export function slurp(options: SlurpOptions, from: Registry = registry): SlurpAnimation {
  const o: Resolved = { ...MOTION_DEFAULTS, ...defined(options) };
  const measureAll = () => ({ src: from.resolve(options.from), dst: from.resolve(options.to) });
  const begin = ({ src, dst } = measureAll()): SlurpAnimation => {
    const leads = options.lead ? new Set(from.resolve(options.lead).map((n) => n.key)) : null;
    if (!src.length && !dst.length) return settled('finished');
    if (dst.length === 1 && src.length)
      return start({ items: src, hub: dst[0] ?? null, backwards: false, leads }, o);
    if (src.length === 1 && dst.length)
      return start({ items: dst, hub: src[0] ?? null, backwards: true, leads }, o);
    // n → m, or the single element is missing: the items fade (out on the way in, in on the way back).
    const out = start({ items: src, hub: null, backwards: false, leads }, o);
    const into = start({ items: dst, hub: null, backwards: true, leads }, o);
    const both: SlurpAnimation = {
      finished: Promise.all([out.finished, into.finished]).then(([a, b]) =>
        a === 'cancelled' || b === 'cancelled' ? 'cancelled' : a,
      ),
      cancel: () => (out.cancel(), into.cancel()),
      finish: () => (out.finish(), into.finish()),
      reverse: () => (out.reverse(), into.reverse(), both),
      restore: () => (out.restore(), into.restore()),
    };
    return both;
  };

  // Interruptions: a transition on elements that are still moving.
  const nodes = measureAll();
  const { src, dst } = nodes;
  const keys = new Set([...src, ...dst].map((n) => n.key));
  const els = new Set([...src, ...dst].flatMap((n) => (n.el ? [n.el] : [])));
  const busy = [...active].filter(
    (a) =>
      [...a.keys].some((k) => keys.has(k)) ||
      [...a.els].some((el) => els.has(el)) ||
      (a.hubKey !== null && keys.has(a.hubKey)),
  );
  if (!busy.length) return begin(nodes);

  // Queued: measured when it actually starts.
  if (o.interrupt === 'queue') {
    return queued(Promise.all(busy.map((a) => a.run.finished)), () => begin());
  }

  if (o.interrupt === 'reverse') {
    const collapsing = dst.length === 1 && src.length > 0;
    const hub = collapsing ? dst[0] : src[0];
    const itemKeys = new Set((collapsing ? src : dst).map((n) => n.key));
    const same = busy.find((a) => a.hubKey === hub?.key && sameKeys(a.keys, itemKeys));
    if (same) {
      for (const a of busy) if (a !== same) a.run.cancel();
      if (same.run.towardOne === collapsing) return same.run;
      same.run.reverse();
      return flipped(same.run);
    }
  }
  for (const a of busy) a.run.cancel();
  return begin();
}

/** n → 1: the items collapse into the target (go forward). `lead` merges last. The items stay hidden until restore(). */
export function collapse({ items, target, ...rest }: CollapseOptions): SlurpAnimation {
  return slurp({ ...rest, from: items, to: target });
}

/** 1 → n: the source bursts into the items (go back). `lead` comes out first. */
export function expand({ source, items, ...rest }: ExpandOptions): SlurpAnimation {
  return slurp({ ...rest, from: source, to: items });
}

/** 1 → 1: one element travels into another. */
export function morph(options: SlurpOptions): SlurpAnimation {
  return slurp(options);
}

/** Transitions still running (for tests and devtools). */
export function runningCount(): number {
  return active.size;
}
