import type { GhostKind, SlurpNode, SlurpRef } from './types';

export interface TargetMeta {
  group?: string;
  lead?: boolean;
  disabled?: boolean;
  ghost?: GhostKind;
}

/** A transition prepared before a navigation, to be played by the route that mounts next. */
export interface Handoff {
  kind: 'collapse' | 'expand' | 'morph' | 'run';
  /** Nodes measured before the navigation: they stay animatable after their elements unmount. */
  from: SlurpNode[];
  to: SlurpRef | SlurpRef[];
  /** Timestamp (ms, Date.now()) of set(); take() ignores stale handoffs. */
  at: number;
  options?: Record<string, unknown>;
}

export interface Registry {
  /** Registers an element under an id; returns the function that unregisters it (a React 19 ref cleanup). */
  register(id: string, el: HTMLElement, meta?: TargetMeta): () => void;
  /** Resolves refs to nodes, measuring the live elements now. Unknown refs resolve to nothing. */
  resolve(ref: SlurpRef | SlurpRef[]): SlurpNode[];
  /** Waits until a ref resolves to at least one node; resolves to `[]` after `timeout` (default 800ms). */
  whenMounted(ref: SlurpRef | SlurpRef[], options?: { timeout?: number }): Promise<SlurpNode[]>;
  handoff: {
    set(handoff: Omit<Handoff, 'at'> & { at?: number }): void;
    /** The pending handoff (once), or null when there is none or it is older than `maxAge` (default 1000ms). */
    take(maxAge?: number): Handoff | null;
  };
}

interface Entry {
  el: HTMLElement;
  meta: TargetMeta;
}

const TRANSPARENT = /^(transparent|rgba\(0, 0, 0, 0\)|)$/;
const generated = new WeakMap<HTMLElement, string>();
let counter = 0;

function keyOf(el: HTMLElement): string {
  if (el.id) return el.id;
  let key = generated.get(el);
  if (!key) generated.set(el, (key = `slurp-node-${++counter}`));
  return key;
}

/** Measures one element (layout read only). */
export function nodeOf(el: HTMLElement, meta: TargetMeta = {}, key = keyOf(el)): SlurpNode {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const bg = cs.backgroundColor;
  const accent = cs.getPropertyValue('--slurp-accent').trim();
  const tint = cs.getPropertyValue('--slurp-animation-tint').trim();
  const fill = TRANSPARENT.test(bg) ? tint || accent || cs.color : bg;
  return {
    rect: { x: r.left, y: r.top, width: r.width, height: r.height },
    radius: cs.borderTopLeftRadius || '0px',
    fill,
    tint: tint || fill,
    key,
    lead: meta.lead || undefined,
    disabled: meta.disabled || undefined,
    ghost: meta.ghost,
    el,
  };
}

const isElement = (v: unknown): v is HTMLElement =>
  typeof HTMLElement !== 'undefined' && v instanceof HTMLElement;

const byDomOrder = (a: Entry, b: Entry) =>
  a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export function createRegistry(): Registry {
  const entries = new Map<string, Entry>();
  const listeners = new Set<() => void>();
  let pending: Handoff | null = null;

  const metaOf = (el: HTMLElement) => {
    for (const [id, e] of entries) if (e.el === el) return { id, meta: e.meta };
    return null;
  };

  const one = (ref: SlurpRef): SlurpNode[] => {
    if (typeof ref === 'string') {
      const e = entries.get(ref);
      if (e?.el.isConnected) return [nodeOf(e.el, e.meta, ref)];
      const el = typeof document === 'undefined' ? null : document.getElementById(ref);
      return el ? [nodeOf(el)] : [];
    }
    if (isElement(ref)) {
      const found = metaOf(ref);
      return [found ? nodeOf(ref, found.meta, found.id) : nodeOf(ref)];
    }
    if ('group' in ref) {
      return [...entries]
        .filter(([, e]) => e.meta.group === ref.group && e.el.isConnected)
        .sort(([, a], [, b]) => byDomOrder(a, b))
        .map(([id, e]) => nodeOf(e.el, e.meta, id));
    }
    if ('rect' in ref) return [ref];
    return ref.current ? one(ref.current) : [];
  };

  const resolve: Registry['resolve'] = (ref) => {
    const seen = new Set<string>();
    return (Array.isArray(ref) ? ref : [ref]).flatMap(one).filter((n) => {
      if (seen.has(n.key)) return false;
      seen.add(n.key);
      return true;
    });
  };

  return {
    register(id, el, meta = {}) {
      const entry = { el, meta };
      entries.set(id, entry);
      for (const fn of [...listeners]) fn();
      return () => {
        // A later registration under the same id (StrictMode, a remount) keeps its entry.
        if (entries.get(id) === entry) entries.delete(id);
      };
    },
    resolve,
    whenMounted(ref, { timeout = 800 } = {}) {
      const now = resolve(ref);
      if (now.length) return Promise.resolve(now);
      return new Promise((done) => {
        let check: () => void = () => undefined;
        const timer = setTimeout(() => {
          listeners.delete(check);
          done([]);
        }, timeout);
        let queued = false;
        // Siblings register in the same commit: measure once they all are in.
        check = () => {
          if (queued) return;
          queued = true;
          queueMicrotask(() => {
            queued = false;
            const nodes = resolve(ref);
            if (!nodes.length) return;
            clearTimeout(timer);
            listeners.delete(check);
            done(nodes);
          });
        };
        listeners.add(check);
      });
    },
    handoff: {
      set(h) {
        pending = { ...h, at: h.at ?? Date.now() };
      },
      take(maxAge = 1000) {
        const h = pending;
        pending = null;
        return h && Date.now() - h.at <= maxAge ? h : null;
      },
    },
  };
}

/** The shared registry: components register into it, the engine resolves string and group refs through it. */
export const registry: Registry = createRegistry();

/** Measures a ref now: live elements become nodes with their current rect, radius and fill. */
export function measure(ref: SlurpRef | SlurpRef[], from: Registry = registry): SlurpNode[] {
  return from.resolve(ref);
}
