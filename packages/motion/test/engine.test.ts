import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  collapse,
  expand,
  MAX_DROPLETS,
  REDUCED_DURATION,
  registry,
  runningCount,
  slurp,
  spring,
} from '../src';
import { flush, installWaapi, must, place, type FakeAnimation, type Waapi } from './waapi';

let waapi: Waapi;
const cleanups: (() => void)[] = [];

beforeEach(() => {
  waapi = installWaapi();
  Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
});

afterEach(async () => {
  // Let every run settle, so none is left in the engine's set of running transitions.
  waapi.advance(1e6);
  await flush();
  waapi.advance(1e6);
  waapi.uninstall();
  for (const off of cleanups.splice(0)) off();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

/** A grid of `n` items (group "tiles") in a section and a target at the bottom ("crumb"). */
function scene(n = 3, opts: { lead?: number } = {}) {
  const grid = document.createElement('section');
  document.body.appendChild(grid);
  const items = Array.from({ length: n }, (_, i) => {
    const el = place(
      document.createElement('div'),
      40 + (i % 6) * 120,
      40 + Math.floor(i / 6) * 120,
      100,
      100,
    );
    el.style.backgroundColor = 'rgb(200, 100, 50)';
    grid.appendChild(el);
    cleanups.push(registry.register(`tile-${i}`, el, { group: 'tiles', lead: opts.lead === i }));
    return el;
  });
  const target = place(document.createElement('button'), 300, 700, 120, 44);
  document.body.appendChild(target);
  cleanups.push(registry.register('crumb', target));
  return { grid, items, target };
}

const overlay = () => document.querySelector<HTMLElement>('[data-slurp-overlay]');
const droplets = () => [...(overlay()?.children ?? [])].slice(0, -1) as HTMLElement[];
const animationOf = (el: Element) => waapi.all.find((a) => a.target === el) as FakeAnimation;
/** Offset at which a droplet leaves its place (the keyframe before its first fully visible one). */
const departure = (a: FakeAnimation) =>
  a.keyframes[a.keyframes.findIndex((k) => k.opacity === 1) - 1]?.offset as number;
const inert = (el: Element) => el.hasAttribute('inert');

describe('collapse', () => {
  it('draws one droplet per item plus the core in a fixed, non-interactive overlay', () => {
    scene(3);
    collapse({ items: { group: 'tiles' }, target: 'crumb' });
    const layer = overlay();
    expect(layer).not.toBeNull();
    expect(layer?.getAttribute('aria-hidden')).toBe('true');
    expect(layer?.style.position).toBe('fixed');
    expect(layer?.style.pointerEvents).toBe('none');
    expect(layer?.children).toHaveLength(4);
    expect(layer?.style.filter).toMatch(/^url\("?#slurp-goo-/);
    expect(document.querySelector('filter feColorMatrix')?.getAttribute('values')).toContain(
      '22 -9',
    );
  });

  it('animates only transform, opacity, border-radius and the droplet colour, with one shared timing', () => {
    scene(3);
    collapse({ items: { group: 'tiles' }, target: 'crumb', duration: 500 });
    const props = new Set(
      waapi.all
        .flatMap((a) => a.keyframes.flatMap((k) => Object.keys(k)))
        .filter((k) => k !== 'offset'),
    );
    const allowed = ['backgroundColor', 'borderRadius', 'opacity', 'transform'];
    expect([...props].every((p) => allowed.includes(p))).toBe(true);
    expect(props.has('transform') && props.has('opacity')).toBe(true);
    expect(new Set(waapi.all.map((a) => a.duration))).toEqual(new Set([500]));
    for (const a of waapi.all)
      expect(
        a.keyframes.every(
          (k, i, all) => i === 0 || (k.offset as number) >= (all[i - 1]?.offset as number),
        ),
      ).toBe(true);
  });

  it('moves nearer items first and the lead last', () => {
    // tile-0 is the farthest from the crumb, tile-2 the nearest; the lead (tile-1) goes last whatever its distance.
    scene(3, { lead: 1 });
    collapse({ items: { group: 'tiles' }, target: 'crumb' });
    const [far, lead, near] = droplets().map((d) => departure(animationOf(d)));
    expect(near).toBeLessThan(must(far));
    expect(lead).toBeCloseTo(0.35);
    expect(lead).toBeGreaterThan(must(far));
  });

  it('accepts lead as an option and DOM order', () => {
    scene(3);
    collapse({
      items: { group: 'tiles' },
      target: 'crumb',
      lead: 'tile-2',
      order: 'dom',
      stagger: 0.5,
    });
    const [a, b, lead] = droplets().map((d) => departure(animationOf(d)));
    expect(a).toBeLessThan(must(b));
    expect(lead).toBeCloseTo(0.5);
  });

  it('paths bend: mid-way the droplet is off the straight line', () => {
    scene(1);
    collapse({ items: 'tile-0', target: 'crumb', stagger: 0 });
    const frames = animationOf(must(droplets()[0])).keyframes;
    const xy = (k: Keyframe) =>
      must((k.transform as string).match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/))
        .slice(1)
        .map(Number);
    const [x0 = 0, y0 = 0] = xy(must(frames[1]));
    const [x1 = 0, y1 = 0] = xy(must(frames.at(-2)));
    const [xm = 0, ym = 0] = xy(must(frames[Math.round(frames.length / 2)]));
    // Distance of the mid point from the chord, in px.
    const off =
      Math.abs((x1 - x0) * (y0 - ym) - (x0 - xm) * (y1 - y0)) / Math.hypot(x1 - x0, y1 - y0);
    expect(off).toBeGreaterThan(10);
  });

  it('fades the content, keeps the items hidden after the end and shows them again on restore()', async () => {
    const { items, grid } = scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(inert(grid)).toBe(true);
    expect(grid.getAttribute('aria-busy')).toBe('true');
    const content = animationOf(must(items[0]));
    expect(content.keyframes.at(-1)?.opacity).toBe(0);
    waapi.advance(650);
    expect(await run.finished).toBe('finished');
    expect(overlay()).toBeNull();
    expect(
      items.every(
        (el) => el.dataset.animationState === 'hidden' && el.style.visibility === 'hidden',
      ),
    ).toBe(true);
    expect(inert(grid)).toBe(false);
    expect(grid.hasAttribute('aria-busy')).toBe(false);
    expect(waapi.live()).toHaveLength(0);
    run.restore();
    expect(items.some((el) => el.dataset.animationState || el.style.visibility)).toBe(false);
  });

  it('reports its phases in order', async () => {
    vi.useFakeTimers();
    scene(2);
    const phases: string[] = [];
    const run = collapse({
      items: { group: 'tiles' },
      target: 'crumb',
      onPhase: (p) => phases.push(p),
    });
    expect(phases).toEqual(['prepare', 'travel']);
    vi.advanceTimersByTime(650);
    waapi.advance(650);
    await run.finished;
    expect(phases).toEqual(['prepare', 'travel', 'fuse', 'settle']);
    vi.useRealTimers();
  });

  it('settles when the time is up even if no frame fired finish (hidden tab), not while paused', async () => {
    vi.useFakeTimers();
    const { items } = scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb', duration: 400 });
    const master = must(waapi.all[0]);
    master.playState = 'paused';
    vi.advanceTimersByTime(600);
    expect(overlay()).not.toBeNull();
    master.playState = 'running';
    vi.advanceTimersByTime(600);
    expect(await run.finished).toBe('finished');
    expect(items.every((el) => el.dataset.animationState === 'hidden')).toBe(true);
    vi.useRealTimers();
  });

  it('lifts inert after duration + 100ms even if the run is held', () => {
    vi.useFakeTimers();
    const { grid } = scene(2);
    collapse({ items: { group: 'tiles' }, target: 'crumb', duration: 400 });
    vi.advanceTimersByTime(499);
    expect(inert(grid)).toBe(true);
    vi.advanceTimersByTime(1);
    expect(inert(grid)).toBe(false);
    vi.useRealTimers();
  });
});

describe('expand', () => {
  it('plays the same timeline backwards and leaves the items visible', async () => {
    const { items } = scene(3, { lead: 0 });
    const run = expand({ source: 'crumb', items: { group: 'tiles' } });
    expect(waapi.all.every((a) => a.direction === 'reverse')).toBe(true);
    // The lead comes out first: on the reversed timeline its departure is the latest.
    expect(departure(animationOf(must(droplets()[0])))).toBeCloseTo(0.35);
    waapi.advance(650);
    expect(await run.finished).toBe('finished');
    expect(items.some((el) => el.dataset.animationState)).toBe(false);
    expect(overlay()).toBeNull();
  });

  it('shows items a previous collapse left hidden', async () => {
    const { items } = scene(2);
    const first = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    waapi.advance(650);
    await first.finished;
    expand({ source: 'crumb', items: { group: 'tiles' } });
    expect(items.some((el) => el.dataset.animationState)).toBe(false);
  });
});

describe('interruptions', () => {
  it('cancel() stops at once, removes the overlay and restores the items', async () => {
    const { items } = scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    waapi.advance(300);
    run.cancel();
    expect(await run.finished).toBe('cancelled');
    expect(overlay()).toBeNull();
    expect(items.some((el) => el.dataset.animationState)).toBe(false);
    expect(waapi.all.every((a) => a.playState === 'idle')).toBe(true);
    expect(runningCount()).toBe(0);
  });

  it('an aborted signal cancels', async () => {
    scene(2);
    const ctrl = new AbortController();
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb', signal: ctrl.signal });
    ctrl.abort();
    expect(await run.finished).toBe('cancelled');
    expect(overlay()).toBeNull();
  });

  it('reverse() half-way plays back to the start: items visible', async () => {
    const { items } = scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    waapi.advance(300);
    expect(run.reverse()).toBe(run);
    expect(waapi.live().every((a) => a.playbackRate === -1)).toBe(true);
    waapi.advance(300);
    expect(await run.finished).toBe('reversed');
    expect(items.some((el) => el.dataset.animationState)).toBe(false);
  });

  it('reverse() after the end starts the other way', async () => {
    scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    waapi.advance(650);
    await run.finished;
    const back = run.reverse();
    expect(back).not.toBe(run);
    expect(waapi.live().every((a) => a.direction === 'reverse')).toBe(true);
  });

  it('interrupt "reverse": the opposite transition on the same elements reverses the running one', async () => {
    scene(3);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    waapi.advance(200);
    const created = waapi.all.length;
    const back = expand({ source: 'crumb', items: { group: 'tiles' } });
    expect(waapi.all).toHaveLength(created);
    expect(waapi.live().every((a) => a.playbackRate === -1)).toBe(true);
    // Each caller reads the outcome from its own side: the expand reached its goal, the collapse went back.
    waapi.advance(200);
    expect(await back.finished).toBe('finished');
    expect(await run.finished).toBe('reversed');
  });

  it('the same transition requested again while running is the same run', () => {
    scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(collapse({ items: { group: 'tiles' }, target: 'crumb' })).toBe(run);
  });

  it('interrupt "cancel" replaces, "queue" waits', async () => {
    scene(2);
    const first = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    const second = expand({ source: 'crumb', items: { group: 'tiles' }, interrupt: 'cancel' });
    expect(await first.finished).toBe('cancelled');
    expect(second).not.toBe(first);
    waapi.advance(650);
    await second.finished;

    const a = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    const before = waapi.all.length;
    const b = expand({ source: 'crumb', items: { group: 'tiles' }, interrupt: 'queue' });
    expect(waapi.all).toHaveLength(before);
    waapi.advance(650);
    await a.finished;
    await flush();
    expect(waapi.all.length).toBeGreaterThan(before);
    waapi.advance(650);
    expect(await b.finished).toBe('finished');
  });
});

describe('degraded paths', () => {
  it('reduced motion: a 150ms fade of the items, no overlay', async () => {
    const { items } = scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb', reducedMotion: 'always' });
    expect(overlay()).toBeNull();
    expect(waapi.all.map((a) => a.target)).toEqual(items);
    expect(waapi.all.every((a) => a.duration === REDUCED_DURATION)).toBe(true);
    waapi.advance(REDUCED_DURATION);
    expect(await run.finished).toBe('finished');
  });

  it("reducedMotion 'user' follows prefers-reduced-motion", () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce') }));
    scene(2);
    collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(overlay()).toBeNull();
  });

  it(`caps droplets at ${MAX_DROPLETS}: the farthest fade, and goo 'auto' turns off past 24`, () => {
    scene(45);
    collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(droplets()).toHaveLength(MAX_DROPLETS);
    expect(overlay()?.style.filter).toBe('');
  });

  it("goo 'auto' is off on low-end devices; goo: false always off", () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: true });
    scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(overlay()?.style.filter).toBe('');
    run.cancel();
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
    collapse({ items: { group: 'tiles' }, target: 'crumb', goo: false });
    expect(overlay()?.style.filter).toBe('');
  });

  it('animationDisabled items only fade: no droplet', () => {
    scene(2);
    const extra = place(document.createElement('div'), 0, 0, 50, 50);
    document.body.appendChild(extra);
    cleanups.push(registry.register('off', extra, { group: 'tiles', disabled: true }));
    collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(droplets()).toHaveLength(2);
    expect(animationOf(extra).keyframes.at(-1)?.opacity).toBe(0);
  });

  it('snapshot ghost: a cloned copy (without ids) travels and fades, the original is hidden', () => {
    const { items } = scene(1);
    must(items[0]).innerHTML = '<span id="label">Telefoni</span>';
    collapse({ items: 'tile-0', target: 'crumb', ghost: 'snapshot' });
    const clone = droplets()[0]?.firstElementChild as HTMLElement;
    expect(clone.textContent).toBe('Telefoni');
    expect(clone.querySelector('[id]')).toBeNull();
    expect(must(items[0]).dataset.animationState).toBe('hidden');
    expect(animationOf(clone).keyframes.at(-1)?.opacity).toBe(0);
  });

  it('a missing single element degrades to a fade; nothing resolved is a no-op', async () => {
    scene(2);
    collapse({ items: { group: 'tiles' }, target: 'nowhere' });
    expect(overlay()).toBeNull();
    expect(waapi.all.every((a) => a.duration === REDUCED_DURATION)).toBe(true);
    expect(await slurp({ from: 'a', to: 'b' }).finished).toBe('finished');
  });

  it('without Web Animations it jumps to the end state', async () => {
    waapi.uninstall();
    const { items } = scene(2);
    const run = collapse({ items: { group: 'tiles' }, target: 'crumb' });
    expect(await run.finished).toBe('finished');
    expect(items.every((el) => el.dataset.animationState === 'hidden')).toBe(true);
  });
});

describe('spring', () => {
  it('builds a linear() easing from 0 to 1 and a settle duration', () => {
    const s = spring({ stiffness: 200, damping: 20 });
    expect(s.easing).toMatch(/^linear\(0, .*, 1\)$/);
    expect(s.duration).toBeGreaterThan(200);
    expect(s.duration).toBeLessThan(1200);
    expect(s.at(s.duration)).toBeCloseTo(1, 2);
  });

  it('overshoots when underdamped, not when critically damped', () => {
    const peak = (o: Parameters<typeof spring>[0]) => {
      const s = spring(o);
      return Math.max(...Array.from({ length: 200 }, (_, i) => s.at(i * 5)));
    };
    expect(peak({ stiffness: 260, damping: 12 })).toBeGreaterThan(1.05);
    expect(peak({ stiffness: 100, damping: 20 })).toBeLessThanOrEqual(1.0001);
  });
});
