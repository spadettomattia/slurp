import { render } from '@testing-library/react';
import { createRef, type ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import {
  AccentScope,
  Cell,
  createTheme,
  Flow,
  Frame,
  Ground,
  SlurpProvider,
  Surface,
  Text,
} from '../src';
import { expectNoAxeViolations } from './axe';

/** Hoisted <style> rules of the css runtime, joined. */
const hoisted = () =>
  [...document.head.querySelectorAll('style')].map((s) => s.textContent).join('\n');

const components: [
  string,
  ComponentType<Record<string, unknown>>,
  string,
  Record<string, unknown>,
][] = [
  ['Cell', Cell as ComponentType<Record<string, unknown>>, 'slurp-cell', {}],
  ['Flow', Flow as ComponentType<Record<string, unknown>>, 'slurp-flow', {}],
  ['Frame', Frame as ComponentType<Record<string, unknown>>, 'slurp-frame', {}],
  ['Surface', Surface as ComponentType<Record<string, unknown>>, 'slurp-surface', {}],
  ['Text', Text as ComponentType<Record<string, unknown>>, 'slurp-text', {}],
  [
    'AccentScope',
    AccentScope as ComponentType<Record<string, unknown>>,
    'slurp-accent-scope',
    { color: 'hue-teal' },
  ],
];

describe.each(components)('%s (shared API)', (_name, Component, rootClass, required) => {
  it('renders one root with its stable class, forwarding className, style, ref and unknown props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Component
        {...required}
        ref={ref}
        className="mine"
        style={{ marginTop: 3 }}
        data-testid="root"
        aria-label="x"
      >
        contenuto
      </Component>,
    );
    expect(container.children).toHaveLength(1);
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains(rootClass)).toBe(true);
    expect(root.classList.contains('mine')).toBe(true);
    expect(root.style.marginTop).toBe('3px');
    expect(root.dataset.testid).toBe('root');
    expect(ref.current).toBe(root);
  });

  it('renders as another element with `as`', () => {
    const { container } = render(<Component {...required} as="section" />);
    expect(container.firstElementChild?.tagName).toBe('SECTION');
  });

  it('applies the css prop through hoisted atomic classes', () => {
    const { container } = render(<Component {...required} css={{ p: 6 }} />);
    const atomic = [...(container.firstElementChild as HTMLElement).classList].find((c) =>
      c.startsWith('slurp-x'),
    );
    expect(atomic).toBeDefined();
    expect(hoisted()).toContain(`.${atomic}{padding:var(--slurp-space-6)}`);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <Component {...required}>Contenuto</Component>
      </main>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('theme components config', () => {
  it('applies defaults and css overrides; instance props win', () => {
    const theme = createTheme({
      components: {
        Text: { defaults: { font: 'caption' }, css: { root: { color: 'accent-ink', p: 2 } } },
      },
    });
    const { getByText } = render(
      <SlurpProvider theme={theme}>
        <Text>predefinito</Text>
        <Text font="title-l" css={{ p: 4 }}>
          esplicito
        </Text>
      </SlurpProvider>,
    );
    expect(getByText('predefinito').dataset.font).toBe('caption');
    expect(getByText('esplicito').dataset.font).toBe('title-l');
    expect(hoisted()).toContain('color:var(--slurp-accent-ink)');
    expect(hoisted()).toContain('padding:var(--slurp-space-4)');
  });
});

describe('Text', () => {
  it('picks the element from the type style', () => {
    const { getByText } = render(
      <>
        <Text font="display-xl">a</Text>
        <Text font="title-l">b</Text>
        <Text>c</Text>
        <Text font="eyebrow">d</Text>
        <Text font="title-xl" as="p">
          e
        </Text>
      </>,
    );
    expect(getByText('a').tagName).toBe('H1');
    expect(getByText('b').tagName).toBe('H3');
    expect(getByText('c').tagName).toBe('P');
    expect(getByText('d').tagName).toBe('SPAN');
    expect(getByText('e').tagName).toBe('P');
  });

  it('exposes tone and muted as data attributes', () => {
    const { getByText } = render(
      <Text tone="accent" muted={false}>
        a
      </Text>,
    );
    expect(getByText('a').dataset.tone).toBe('accent');
    expect(getByText('a').dataset.muted).toBe('false');
  });
});

describe('Flow', () => {
  it('compiles layout props, responsive ones included', () => {
    render(<Flow direction={{ base: 'column', wide: 'row' }} gap={2} align="center" wrap />);
    const css = hoisted();
    expect(css).toContain('flex-direction:column');
    expect(css).toMatch(
      /@media not all and \(max-width: 640px\)\{\.(slurp-x\w+)\.\1\{flex-direction:row\}\}/,
    );
    expect(css).toContain('gap:var(--slurp-space-2)');
    expect(css).toContain('align-items:center');
    expect(css).toContain('flex-wrap:wrap');
  });
});

describe('Surface', () => {
  it('defaults to the translucent level and the card radius', () => {
    const { container } = render(<Surface />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.level).toBe('surface');
    expect(root.dataset.radius).toBe('card');
  });
});

describe('AccentScope', () => {
  it('sets the accent variables inline; hue presets as they are, other colours through vivid()', () => {
    const { container, rerender } = render(<AccentScope color="hue-amber" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--slurp-accent')).toBe('#e29b03');
    expect(root.style.getPropertyValue('--slurp-on-accent')).toBe('#111114');
    expect(root.style.getPropertyValue('--slurp-focus')).toBe('var(--slurp-accent-ink)');
    rerender(<AccentScope color="#336699" />);
    expect(root.style.getPropertyValue('--slurp-accent')).not.toBe('#336699');
  });
});

describe('Ground', () => {
  it('hoists the baseline into slurp.reset and renders no element', () => {
    const { container } = render(<Ground />);
    expect(container.children).toHaveLength(0);
    expect(hoisted()).toContain('@layer slurp.reset{');
    expect(hoisted()).toContain('color-mix(in oklab,var(--slurp-accent) 7%,var(--slurp-bg))');
  });
});
