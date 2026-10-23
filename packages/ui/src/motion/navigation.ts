import {
  REDUCED_DURATION,
  registry,
  type Handoff,
  type SlurpAnimation,
  type SlurpDefaults,
  type SlurpNode,
  type SlurpRef,
} from '@slurp-ui/motion';
import { useCallback, useEffectEvent, useLayoutEffect, useRef } from 'react';

import { useTheme } from '../internal/context';
import { useSlurp } from './useSlurp';

export interface SlurpNavigateOptions extends Partial<SlurpDefaults> {
  /** What leaves: measured now, before the navigation unmounts it. */
  from: SlurpRef | SlurpRef[];
  /** Where it lands in the next route; when omitted, `useSlurpEnter(to)` there says it. */
  to?: SlurpRef | SlurpRef[];
  /** The element the action is about: it merges last (collapse) or comes out first (expand, where it is in the next route). */
  lead?: SlurpRef;
}

type Go<A> = A extends [infer T, ...infer R]
  ? (to: T, options?: SlurpNavigateOptions | null, ...rest: R) => void
  : never;

/**
 * The navigate function of a router with slurp options as second argument; its other arguments pass through.
 * Overloads are kept (React Router's `navigate(to, options)` and `navigate(-1)`).
 */
export type SlurpNavigate<F> = F extends {
  (...args: infer A1): unknown;
  (...args: infer A2): unknown;
}
  ? Go<A1> & Go<A2>
  : never;

/** Measures without keeping the element: the snapshot outlives the route that rendered it. */
function snapshot(node: SlurpNode, lead: boolean): SlurpNode {
  const copy: SlurpNode = { ...node, lead: lead || node.lead };
  delete copy.el;
  return copy;
}

/**
 * Wraps a router's navigate function (`router.push`, React Router's `navigate`, `history.pushState`…):
 * with slurp options it measures `from` first and leaves a handoff that the next route plays with
 * `useSlurpEnter`. Without options it just navigates. No router is imported.
 */
export function useSlurpNavigate<F extends (...args: never[]) => unknown>(
  navigate: F,
): SlurpNavigate<F> {
  return useCallback(
    (to: unknown, options?: SlurpNavigateOptions | null, ...rest: unknown[]) => {
      if (options) {
        const { from, to: target, lead, ...motion } = options;
        const leads = new Set(lead ? registry.resolve(lead).map((n) => n.key) : []);
        const nodes = registry.resolve(from).map((n) => snapshot(n, leads.has(n.key)));
        // A lead that is not leaving (expand: it arrives with the next route) is resolved there.
        const arriving = lead !== undefined && !nodes.some((n) => n.lead);
        if (nodes.length) {
          registry.handoff.set({
            kind: 'run',
            from: nodes,
            ...(target === undefined ? null : { to: target }),
            options: arriving ? { ...motion, lead } : motion,
          });
        }
      }
      (navigate as unknown as (...args: unknown[]) => unknown)(to, ...rest);
    },
    [navigate],
  ) as SlurpNavigate<F>;
}

export interface SlurpEnterOptions {
  /** A handoff older than this (ms) only fades in. Default 1000. */
  maxAge?: number;
  /** How long to wait for the targets to mount (ms). Default 800. */
  timeout?: number;
  /** Plays again when it changes: for a route component reused with other params (e.g. the pathname). */
  key?: unknown;
  /** Called with the transition when it starts (for example to follow it or reverse it). */
  onStart?: (animation: SlurpAnimation) => void;
  /**
   * The rest of the route (title, text…): hidden before the first paint, it fades in while the droplets land
   * (the last 40% of the transition). Leave out what holds the targets: an element containing one is skipped.
   */
  content?: ContentRef | ContentRef[];
}

export type ContentRef = HTMLElement | { current: HTMLElement | null } | null | undefined;

/** Share of the transition before the content starts fading in. */
const CONTENT_DELAY = 0.6;

const prefersReduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function contentOf(content: ContentRef | ContentRef[] | undefined): HTMLElement[] {
  const refs = Array.isArray(content) ? content : [content];
  return refs.flatMap((r) => {
    const el = r && 'current' in r ? r.current : r;
    return el && typeof el.animate === 'function' ? [el] : [];
  });
}

/**
 * In the route that mounts after `useSlurpNavigate`: waits for `to` (or the handoff's own target) to be
 * mounted and plays the transition from the nodes measured before the navigation. A stale handoff or
 * missing targets fade instead; without a handoff (a direct visit, the browser's back) nothing runs.
 */
export function useSlurpEnter(to?: SlurpRef | SlurpRef[], options: SlurpEnterOptions = {}): void {
  const { run } = useSlurp();
  const motion = useTheme().motion;
  const { maxAge = 1000, timeout, key, onStart, content } = options;
  // Taken once per key: StrictMode's second mount replays the same handoff instead of losing it.
  const taken = useRef<{ key: unknown; handoff: Handoff | null } | null>(null);

  const play = useEffectEvent((handoff: Handoff, live: () => boolean) => {
    const target = handoff.to ?? to;
    if (!target) return () => {};
    const stale = Date.now() - handoff.at > maxAge;
    const o = { ...motion, ...handoff.options };
    // Hidden now (before the first paint), until the transition starts and fades it in.
    const els = contentOf(content);
    const fades = els.map((el) =>
      el.animate([{ opacity: 0 }, { opacity: 0 }], { fill: 'forwards' }),
    );
    let animation: SlurpAnimation | null = null;
    void registry.whenMounted(target, timeout === undefined ? {} : { timeout }).then((nodes) => {
      if (!live()) return;
      animation = run({
        ...handoff.options,
        ...(stale ? { reducedMotion: 'always' } : null),
        from: handoff.from,
        to: nodes,
      });
      const reduced =
        stale ||
        !nodes.length ||
        o.reducedMotion === 'always' ||
        (o.reducedMotion === 'user' && prefersReduced());
      const duration = reduced ? REDUCED_DURATION : o.duration;
      els.forEach((el, i) => {
        // Content holding a target would hide it while the droplets land on it.
        const holds = nodes.some((n) => n.el && el.contains(n.el));
        const fade = holds
          ? null
          : el.animate(
              [
                { opacity: 0 },
                { opacity: 0, offset: reduced ? 0 : CONTENT_DELAY, easing: 'ease-out' },
                { opacity: 1 },
              ],
              { duration, fill: 'both' },
            );
        fades[i]?.cancel();
        if (fade) fades[i] = fade;
      });
      void animation.finished.then(() => fades.forEach((f) => f.cancel()));
      onStart?.(animation);
    });
    return () => {
      animation?.cancel();
      fades.forEach((f) => f.cancel());
    };
  });

  // Layout effect + whenMounted's microtask: the targets are hidden before the first paint.
  useLayoutEffect(() => {
    if (!taken.current || taken.current.key !== key) {
      taken.current = { key, handoff: registry.handoff.take(Number.POSITIVE_INFINITY) };
    }
    const { handoff } = taken.current;
    if (!handoff) return;
    let live = true;
    const stop = play(handoff, () => live);
    return () => {
      live = false;
      stop();
    };
  }, [key]);
}
