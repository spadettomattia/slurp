import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRegistry, measure } from '../src';
import { must, place } from './waapi';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

function el(id?: string) {
  const e = document.createElement('div');
  if (id) e.id = id;
  document.body.appendChild(e);
  return e;
}

describe('registry', () => {
  it('resolves registered ids, falls back to DOM ids and ignores unknown refs', () => {
    const r = createRegistry();
    const a = place(el(), 10, 20, 100, 50);
    r.register('card-a', a);
    el('dom-only');
    expect(r.resolve('card-a')).toMatchObject([
      { key: 'card-a', el: a, rect: { x: 10, y: 20, width: 100, height: 50 } },
    ]);
    expect(r.resolve('dom-only')[0]?.key).toBe('dom-only');
    expect(r.resolve('missing')).toEqual([]);
  });

  it('resolves a group in DOM order, with lead / disabled / ghost from the registration', () => {
    const r = createRegistry();
    const [first, second, third] = [el(), el(), el()];
    r.register('c', must(third), { group: 'tiles' });
    r.register('a', must(first), { group: 'tiles', lead: true });
    r.register('b', must(second), { group: 'tiles', disabled: true, ghost: 'snapshot' });
    r.register('other', el(), { group: 'cards' });
    const nodes = r.resolve({ group: 'tiles' });
    expect(nodes.map((n) => n.key)).toEqual(['a', 'b', 'c']);
    expect(nodes[0]?.lead).toBe(true);
    expect(nodes[1]).toMatchObject({ disabled: true, ghost: 'snapshot' });
  });

  it('resolves elements, ref objects and nodes, without duplicates', () => {
    const r = createRegistry();
    const a = el();
    r.register('a', a, { lead: true });
    const [node] = r.resolve(a);
    expect(node).toMatchObject({ key: 'a', lead: true });
    expect(r.resolve({ current: a })[0]?.key).toBe('a');
    expect(r.resolve({ current: null })).toEqual([]);
    expect(r.resolve([a, 'a', must(node)])).toHaveLength(1);
  });

  it('unregisters, keeping a later registration under the same id', () => {
    const r = createRegistry();
    const a = el();
    const b = el();
    const offA = r.register('x', a);
    r.register('x', b);
    offA();
    expect(r.resolve('x')[0]?.el).toBe(b);
  });

  it('skips disconnected elements', () => {
    const r = createRegistry();
    const a = el();
    r.register('a', a, { group: 'g' });
    a.remove();
    expect(r.resolve('a')).toEqual([]);
    expect(r.resolve({ group: 'g' })).toEqual([]);
  });

  it('whenMounted waits for the registration, then times out to []', async () => {
    vi.useFakeTimers();
    const r = createRegistry();
    const waiting = r.whenMounted({ group: 'later' });
    r.register('x', el(), { group: 'later' });
    r.register('y', el(), { group: 'later' });
    await vi.advanceTimersByTimeAsync(0);
    expect((await waiting).map((n) => n.key)).toEqual(['x', 'y']);

    const never = r.whenMounted('nothing', { timeout: 300 });
    await vi.advanceTimersByTimeAsync(300);
    expect(await never).toEqual([]);
  });

  it('hands off once, and not after it expired', () => {
    vi.useFakeTimers();
    const r = createRegistry();
    r.handoff.set({ kind: 'expand', from: [], to: { group: 'tiles' } });
    expect(r.handoff.take()?.kind).toBe('expand');
    expect(r.handoff.take()).toBeNull();
    r.handoff.set({ kind: 'collapse', from: [], to: 'crumb' });
    vi.advanceTimersByTime(1001);
    expect(r.handoff.take()).toBeNull();
  });
});

describe('measure', () => {
  it('reads radius and background, falling back to the tint, then the accent, when transparent', () => {
    const r = createRegistry();
    const solid = el();
    solid.style.backgroundColor = 'rgb(1, 2, 3)';
    solid.style.borderTopLeftRadius = '34px'; // jsdom does not expand the shorthand
    const tinted = el();
    tinted.style.setProperty('--slurp-animation-tint', 'rgb(9, 9, 9)');
    const plain = el();
    plain.style.setProperty('--slurp-accent', 'rgb(139, 111, 255)');
    r.register('solid', solid);
    r.register('tinted', tinted);
    r.register('plain', plain);
    const [s, t, p] = measure(['solid', 'tinted', 'plain'], r);
    expect(s).toMatchObject({ fill: 'rgb(1, 2, 3)', tint: 'rgb(1, 2, 3)', radius: '34px' });
    expect(t).toMatchObject({ fill: 'rgb(9, 9, 9)', tint: 'rgb(9, 9, 9)' });
    expect(p?.fill).toBe('rgb(139, 111, 255)');
  });
});
