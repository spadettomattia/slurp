import { REDUCED_DURATION, registry, type SlurpAnimation } from '@slurp-ui/motion';
import { act, render, screen } from '@testing-library/react';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  Cell,
  useSlurpEnter,
  useSlurpNavigate,
  type SlurpEnterOptions,
  type SlurpNavigate,
} from '../src';

const animate = vi.fn();
const started: SlurpAnimation[] = [];

beforeEach(() => {
  animate.mockImplementation(() => ({ cancel() {}, reverse() {}, onfinish: null }));
  Element.prototype.animate = animate as unknown as Element['animate'];
});

afterEach(() => {
  for (const a of started.splice(0)) a.cancel();
  registry.handoff.take();
  delete (Element.prototype as { animate?: unknown }).animate;
  animate.mockReset();
});

const durations = () => animate.mock.calls.map(([, o]) => (o as { duration: number }).duration);

/** Two "routes" behind a navigate function that is just a state setter: no router needed. */
function App({
  enter = {},
  strict = false,
  duration,
}: {
  enter?: SlurpEnterOptions;
  strict?: boolean;
  duration?: number;
}) {
  const [page, setPage] = useState<'grid' | 'section'>('grid');
  const go = useSlurpNavigate(setPage);
  const onStart = (a: SlurpAnimation) => {
    started.push(a);
    enter.onStart?.(a);
  };
  const routes = (
    <>
      {page === 'grid' ? (
        <Grid
          onOpen={() =>
            go('section', {
              from: { group: 'tiles' },
              lead: 'tile-b',
              to: 'crumb',
              ...(duration ? { duration } : null),
            })
          }
          enter={{ ...enter, onStart }}
        />
      ) : (
        <Section onBack={() => go('grid', { from: 'crumb' })} enter={{ ...enter, onStart }} />
      )}
    </>
  );
  return strict ? <StrictMode>{routes}</StrictMode> : routes;
}

function Grid({ onOpen, enter }: { onOpen: () => void; enter: SlurpEnterOptions }) {
  useSlurpEnter({ group: 'tiles' }, enter);
  return (
    <>
      <Cell animationId="tile-a" animationGroup="tiles" />
      <Cell animationId="tile-b" animationGroup="tiles" />
      <button type="button" onClick={onOpen}>
        Apri
      </button>
    </>
  );
}

function Section({ onBack, enter }: { onBack: () => void; enter: SlurpEnterOptions }) {
  useSlurpEnter(undefined, enter);
  return (
    <>
      <Cell animationId="crumb" />
      <button type="button" onClick={onBack}>
        Indietro
      </button>
    </>
  );
}

const click = async (name: string) => {
  await act(async () => screen.getByRole('button', { name }).click());
};

describe('useSlurpNavigate', () => {
  it('measures the source before navigating and passes the other arguments through', () => {
    const navigate = vi.fn();
    let go: SlurpNavigate<(to: string, o: { replace: boolean }) => void> | undefined;
    function Probe() {
      const wrapped = useSlurpNavigate(navigate as (to: string, o: { replace: boolean }) => void);
      useEffect(() => {
        go = wrapped;
      });
      return (
        <>
          <Cell animationId="a" animationGroup="g" />
          <Cell animationId="b" animationGroup="g" />
        </>
      );
    }
    render(<Probe />);
    go?.('/next', { from: { group: 'g' }, lead: 'b', duration: 400 }, { replace: true });
    expect(navigate).toHaveBeenCalledWith('/next', { replace: true });
    const handoff = registry.handoff.take();
    expect(handoff?.from.map((n) => [n.key, n.el, n.lead])).toEqual([
      ['a', undefined, undefined],
      ['b', undefined, true],
    ]);
    expect(handoff?.to).toBeUndefined();
    expect(handoff?.options).toEqual({ duration: 400 });
  });

  it('a lead that is not leaving is passed on, to be resolved in the next route', () => {
    let go: ((to: string, o?: { from: string; lead: string }) => void) | undefined;
    function Probe() {
      const wrapped = useSlurpNavigate(() => {});
      useEffect(() => {
        go = wrapped;
      });
      return <Cell animationId="crumb" />;
    }
    render(<Probe />);
    go?.('/', { from: 'crumb', lead: 'tile-b' });
    const handoff = registry.handoff.take();
    expect(handoff?.from[0]?.lead).toBeUndefined();
    expect(handoff?.options).toEqual({ lead: 'tile-b' });
  });

  it('without options, or with nothing to measure, it only navigates', () => {
    const navigate = vi.fn();
    let go: ((to: string, o?: { from: string } | null) => void) | undefined;
    function Probe() {
      const wrapped = useSlurpNavigate(navigate);
      useEffect(() => {
        go = wrapped;
      });
      return null;
    }
    render(<Probe />);
    go?.('/a');
    go?.('/b', { from: 'not-registered' });
    expect(navigate.mock.calls).toEqual([['/a'], ['/b']]);
    expect(registry.handoff.take()).toBeNull();
  });
});

describe('useSlurpEnter', () => {
  it('plays the transition in the route that mounts, from the nodes measured before', async () => {
    const onStart = vi.fn();
    render(<App enter={{ onStart }} />);
    expect(onStart).not.toHaveBeenCalled();
    await click('Apri');
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Indietro' })).toBeTruthy();
    expect(durations().length).toBeGreaterThan(0);
    expect(durations().every((d) => d === 650)).toBe(true);
    // Forward and back: the crumb bursts into the tiles of the grid.
    animate.mockClear();
    await click('Indietro');
    expect(onStart).toHaveBeenCalledTimes(2);
    expect(durations().length).toBeGreaterThan(0);
  });

  it('applies the motion options given at navigation', async () => {
    render(<App duration={400} />);
    await click('Apri');
    expect(durations().length).toBeGreaterThan(0);
    expect(durations().every((d) => d === 400)).toBe(true);
  });

  it('plays once under StrictMode, without being cancelled by the second mount', async () => {
    const onStart = vi.fn();
    render(<App enter={{ onStart }} strict />);
    await click('Apri');
    expect(onStart).toHaveBeenCalledTimes(1);
    const [animation] = onStart.mock.calls[0] as [SlurpAnimation];
    animation.finish();
    expect(await animation.finished).toBe('finished');
  });

  it('a stale handoff only fades', async () => {
    // Measured 2s before the grid mounts (a slow navigation): the tiles fade in instead of travelling.
    registry.handoff.set({
      kind: 'run',
      from: [
        {
          rect: { x: 0, y: 0, width: 80, height: 40 },
          radius: '20px',
          fill: 'red',
          tint: 'red',
          key: 'crumb',
        },
      ],
      at: Date.now() - 2000,
    });
    render(<App />);
    await act(async () => {});
    expect(durations().length).toBe(2);
    expect(durations().every((d) => d === REDUCED_DURATION)).toBe(true);
  });

  it('without a handoff nothing runs, and a handoff is played only once', async () => {
    const onStart = vi.fn();
    const { unmount } = render(<App enter={{ onStart }} />);
    expect(onStart).not.toHaveBeenCalled();
    await click('Apri');
    unmount();
    render(<App enter={{ onStart }} />);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('missing targets never block: the transition settles', async () => {
    let go: ((to: string, o?: { from: string; to: string }) => void) | undefined;
    const onStart = vi.fn();
    function Probe() {
      const [page, setPage] = useState('a');
      const wrapped = useSlurpNavigate(setPage);
      useEffect(() => {
        go = wrapped;
      });
      return page === 'a' ? <Cell animationId="from" /> : <Arrive />;
    }
    function Arrive() {
      useSlurpEnter(undefined, { timeout: 5, onStart });
      return <Cell animationId="elsewhere" />;
    }
    render(<Probe />);
    await act(async () => go?.('b', { from: 'from', to: 'missing' }));
    await act(() => new Promise((r) => setTimeout(r, 20)));
    expect(onStart).toHaveBeenCalledTimes(1);
    const [animation] = onStart.mock.calls[0] as [SlurpAnimation];
    expect(await animation.finished).toBe('finished');
  });

  it('a new key takes the next handoff in a route component that stays mounted', async () => {
    let go: ((to: number, o?: { from: string }) => void) | undefined;
    const onStart = vi.fn();
    function Route() {
      const [n, setN] = useState(0);
      const wrapped = useSlurpNavigate(setN);
      useEffect(() => {
        go = wrapped;
      });
      useSlurpEnter('target', { key: n, onStart });
      return (
        <>
          <Cell animationId="source" />
          <Cell animationId="target" />
        </>
      );
    }
    render(<Route />);
    await act(async () => go?.(1, { from: 'source' }));
    await act(async () => go?.(2, { from: 'source' }));
    expect(onStart).toHaveBeenCalledTimes(2);
    for (const [a] of onStart.mock.calls as [SlurpAnimation][]) a.cancel();
  });

  describe('content', () => {
    /** Calls of animate() on `el`: its keyframes and timing. */
    const fadesOf = (el: Element | null) =>
      animate.mock.calls.filter((_, i) => animate.mock.contexts[i] === el) as [
        Keyframe[],
        KeyframeAnimationOptions,
      ][];

    function Flow({ enter }: { enter?: SlurpEnterOptions }) {
      const [page, setPage] = useState('a');
      const go = useSlurpNavigate(setPage);
      return page === 'a' ? (
        <>
          <Cell animationId="tile-1" animationGroup="tiles" />
          <Cell animationId="tile-2" animationGroup="tiles" />
          <button type="button" onClick={() => go('b', { from: { group: 'tiles' }, to: 'crumb' })}>
            Apri
          </button>
        </>
      ) : (
        <Arrive enter={enter} />
      );
    }
    function Arrive({ enter }: { enter?: SlurpEnterOptions }) {
      const text = useRef<HTMLParagraphElement>(null);
      const wrapper = useRef<HTMLDivElement>(null);
      useSlurpEnter(undefined, { ...enter, content: [text, wrapper] });
      return (
        <>
          <p ref={text} data-testid="text">
            Testo
          </p>
          <div ref={wrapper} data-testid="wrapper">
            <Cell animationId="crumb" />
          </div>
        </>
      );
    }

    it('hides the rest of the route, then fades it in over the end of the transition', async () => {
      const onStart = vi.fn();
      render(<Flow enter={{ onStart }} />);
      await click('Apri');
      expect(onStart).toHaveBeenCalledTimes(1);
      const [hold, fade] = fadesOf(screen.getByTestId('text'));
      expect(hold?.[0]).toEqual([{ opacity: 0 }, { opacity: 0 }]);
      expect(fade?.[0]).toEqual([
        { opacity: 0 },
        { opacity: 0, offset: 0.6, easing: 'ease-out' },
        { opacity: 1 },
      ]);
      expect(fade?.[1]).toMatchObject({ duration: 650, fill: 'both' });
      // The wrapper holds the target: fading it would hide the crumb the droplets land on.
      expect(fadesOf(screen.getByTestId('wrapper'))).toHaveLength(1);
      started.push(onStart.mock.calls[0]?.[0] as SlurpAnimation);
    });

    it('a stale handoff fades the content in at once, in the short duration', async () => {
      const onStart = vi.fn();
      render(<Flow enter={{ onStart, maxAge: -1 }} />);
      await click('Apri');
      const [, fade] = fadesOf(screen.getByTestId('text'));
      expect(fade?.[0][1]).toMatchObject({ opacity: 0, offset: 0 });
      expect(fade?.[1].duration).toBe(REDUCED_DURATION);
      started.push(onStart.mock.calls[0]?.[0] as SlurpAnimation);
    });

    it('shows the content again when the transition settles or the route unmounts', async () => {
      const cancels: Element[] = [];
      animate.mockImplementation(function (this: Element) {
        return { cancel: () => cancels.push(this), reverse() {}, onfinish: null };
      });
      const onStart = vi.fn();
      const { unmount } = render(<Flow enter={{ onStart }} />);
      await click('Apri');
      const text = screen.getByTestId('text');
      expect(cancels.filter((el) => el === text)).toHaveLength(1); // the hold, replaced by the fade
      unmount();
      expect(cancels.filter((el) => el === text).length).toBeGreaterThanOrEqual(2);
    });
  });
});
