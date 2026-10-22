import { registry, type SlurpAnimation } from '@slurp-ui/motion';
import { render } from '@testing-library/react';
import { createRef, useEffect, type ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AccentScope,
  AnimationGroup,
  Cell,
  createTheme,
  Flow,
  Frame,
  SlurpProvider,
  Surface,
  Text,
  useSlurp,
  type SlurpControls,
} from '../src';

const animate = vi.fn();

beforeEach(() => {
  // Web Animations stub: records the timing, never finishes by itself.
  animate.mockImplementation(() => ({ cancel() {}, reverse() {}, onfinish: null }));
  Element.prototype.animate = animate as unknown as Element['animate'];
});

afterEach(() => {
  delete (Element.prototype as { animate?: unknown }).animate;
  animate.mockReset();
});

const components: [string, ComponentType<Record<string, unknown>>, Record<string, unknown>][] = [
  ['Cell', Cell as ComponentType<Record<string, unknown>>, {}],
  ['Flow', Flow as ComponentType<Record<string, unknown>>, {}],
  ['Frame', Frame as ComponentType<Record<string, unknown>>, {}],
  ['Surface', Surface as ComponentType<Record<string, unknown>>, {}],
  ['Text', Text as ComponentType<Record<string, unknown>>, {}],
  ['AccentScope', AccentScope as ComponentType<Record<string, unknown>>, { color: 'hue-teal' }],
];

describe.each(components)('%s (animation props)', (name, Component, required) => {
  it('registers its root under animationId while mounted, without forwarding the props', () => {
    const id = `${name}-target`;
    const ref = createRef<HTMLElement>();
    const { container, unmount } = render(
      <Component
        {...required}
        ref={ref}
        animationId={id}
        animationLead
        animationGhost="snapshot"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    const [node] = registry.resolve(id);
    expect(node?.el).toBe(root);
    expect(node).toMatchObject({ lead: true, ghost: 'snapshot' });
    expect(ref.current).toBe(root);
    expect(root.getAttributeNames().some((a) => a.startsWith('animation'))).toBe(false);
    unmount();
    expect(registry.resolve(id)).toEqual([]);
  });
});

describe('AnimationGroup', () => {
  it('puts descendants with an animationId in the group, and only those', () => {
    render(
      <AnimationGroup id="cards">
        <Cell animationId="card-1">
          <Text>interno, senza id</Text>
        </Cell>
        <Cell animationId="card-2" animationDisabled />
        <Cell>fuori dal gruppo</Cell>
      </AnimationGroup>,
    );
    const nodes = registry.resolve({ group: 'cards' });
    expect(nodes.map((n) => n.key)).toEqual(['card-1', 'card-2']);
    expect(nodes[1]?.disabled).toBe(true);
  });

  it('an explicit animationGroup registers the element even without an id', () => {
    render(
      <>
        <Cell animationGroup="dots" />
        <Cell animationGroup="dots" />
      </>,
    );
    expect(registry.resolve({ group: 'dots' })).toHaveLength(2);
  });
});

describe('zero cost', () => {
  it('without animation props the ref passes through and nothing is registered', () => {
    const ref = vi.fn();
    const before = registry.resolve({ group: 'none' }).length;
    render(<Cell ref={ref} />);
    expect(ref).toHaveBeenCalledTimes(1);
    expect(registry.resolve({ group: 'none' })).toHaveLength(before);
  });

  it('a callback ref and the registration both get the element', () => {
    const ref = vi.fn();
    const { container } = render(<Cell ref={ref} animationId="both" />);
    expect(ref).toHaveBeenCalledWith(container.firstElementChild);
    expect(registry.resolve('both')[0]?.el).toBe(container.firstElementChild);
  });
});

describe('useSlurp', () => {
  function Harness({ onReady }: { onReady: (c: SlurpControls) => void }) {
    const controls = useSlurp();
    useEffect(() => {
      onReady(controls);
    }, [controls, onReady]);
    return (
      <>
        <Cell animationId="from-a" css={{ bg: 'accent' }} />
        <Cell animationId="from-b" />
        <Cell animationId="to" />
      </>
    );
  }

  it('applies the theme motion defaults, overridable per call', () => {
    let controls: SlurpControls | undefined;
    const theme = createTheme({ motion: { duration: 900, goo: false } });
    render(
      <SlurpProvider theme={theme} storageKey={null}>
        <Harness onReady={(c) => (controls = c)} />
      </SlurpProvider>,
    );
    controls?.collapse({ items: ['from-a', 'from-b'], target: 'to' }).cancel();
    expect(animate.mock.calls.every(([, o]) => o.duration === 900)).toBe(true);
    animate.mockClear();
    controls?.collapse({ items: ['from-a', 'from-b'], target: 'to', duration: 300 }).cancel();
    expect(animate.mock.calls.every(([, o]) => o.duration === 300)).toBe(true);
  });

  it('cancels the transitions still running when the component unmounts', async () => {
    let controls: SlurpControls | undefined;
    const { unmount } = render(<Harness onReady={(c) => (controls = c)} />);
    const run = controls?.collapse({ items: ['from-a', 'from-b'], target: 'to' }) as SlurpAnimation;
    unmount();
    expect(await run.finished).toBe('cancelled');
  });
});
