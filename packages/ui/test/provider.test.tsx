import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ColorSchemeScript, createTheme, SlurpProvider, useColorScheme, useTheme } from '../src';

function SchemeProbe() {
  const { mode, resolved, setMode } = useColorScheme();
  return (
    <div>
      <output data-testid="mode">{mode}</output>
      <output data-testid="resolved">{resolved}</output>
      <button onClick={() => setMode('dark')}>scuro</button>
      <button onClick={() => setMode('system')}>sistema</button>
    </div>
  );
}

const html = document.documentElement;

describe('SlurpProvider', () => {
  afterEach(() => vi.restoreAllMocks());

  it('starts from the theme colour scheme and writes data-theme on <html>', () => {
    render(
      <SlurpProvider theme={createTheme({ colorScheme: 'light' })}>
        <SchemeProbe />
      </SlurpProvider>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(html.getAttribute('data-theme')).toBe('light');
  });

  it('setMode() applies and remembers the choice; system removes the attribute', () => {
    render(
      <SlurpProvider>
        <SchemeProbe />
      </SlurpProvider>,
    );
    expect(html.hasAttribute('data-theme')).toBe(false);
    act(() => screen.getByText('scuro').click());
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(html.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('slurp-theme')).toBe('dark');
    act(() => screen.getByText('sistema').click());
    expect(html.hasAttribute('data-theme')).toBe(false);
  });

  it('reads the remembered choice', () => {
    localStorage.setItem('slurp-theme', 'dark');
    render(
      <SlurpProvider theme={createTheme({ colorScheme: 'light' })}>
        <SchemeProbe />
      </SlurpProvider>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('keeps working when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(
      <SlurpProvider>
        <SchemeProbe />
      </SlurpProvider>,
    );
    act(() => screen.getByText('scuro').click());
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(html.getAttribute('data-theme')).toBe('dark');
  });

  it('storageKey={null} follows the theme and remembers nothing', () => {
    const { rerender } = render(
      <SlurpProvider storageKey={null} theme={createTheme({ colorScheme: 'light' })}>
        <SchemeProbe />
      </SlurpProvider>,
    );
    rerender(
      <SlurpProvider storageKey={null} theme={createTheme({ colorScheme: 'dark' })}>
        <SchemeProbe />
      </SlurpProvider>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(localStorage.length).toBe(0);
  });

  it('hoists the theme stylesheet into <head> only when the theme overrides something', () => {
    render(<SlurpProvider>x</SlurpProvider>);
    expect(document.head.querySelector('style[data-precedence]')).toBeNull();
    render(<SlurpProvider theme={createTheme({ accent: 'hue-teal' })}>x</SlurpProvider>);
    expect(document.head.querySelector('style[data-precedence="slurp"]')?.textContent).toContain(
      '--slurp-accent:#1aa594',
    );
  });

  it('gives useTheme() the default theme without a provider, and useColorScheme() a clear error', () => {
    function ThemeProbe() {
      return <span>{useTheme().accent}</span>;
    }
    render(<ThemeProbe />);
    expect(screen.getByText('hue-violet')).toBeTruthy();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<SchemeProbe />)).toThrow(/needs a <SlurpProvider>/);
  });

  it('nested: shares the outer colour scheme and scopes its theme to a display:contents wrapper', () => {
    const { container } = render(
      <SlurpProvider theme={createTheme({ colorScheme: 'dark' })}>
        <SlurpProvider theme={createTheme({ colorScheme: 'light', accent: 'hue-amber' })}>
          <SchemeProbe />
        </SlurpProvider>
      </SlurpProvider>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(html.getAttribute('data-theme')).toBe('dark');
    const wrapper = container.querySelector<HTMLElement>('[data-slurp-theme]');
    expect(wrapper?.style.display).toBe('contents');
    const scope = wrapper?.dataset.slurpTheme ?? '';
    const css = [...document.head.querySelectorAll('style')].map((s) => s.textContent).join('');
    expect(css).toContain(
      `[data-slurp-theme="${scope}"],[data-slurp-theme="${scope}"] [data-theme]{--slurp-accent:#e29b03`,
    );
  });

  it('renders on the server without touching window', () => {
    expect(() =>
      renderToString(
        <SlurpProvider theme={createTheme({ accent: 'hue-sky' })}>
          <SchemeProbe />
        </SlurpProvider>,
      ),
    ).not.toThrow();
  });
});

describe('ColorSchemeScript', () => {
  it('applies the stored scheme before React runs', () => {
    localStorage.setItem('slurp-theme', 'dark');
    const markup = renderToString(<ColorSchemeScript />);
    const code = /<script>(.*)<\/script>/.exec(markup)?.[1] ?? '';
    new Function(code)();
    expect(html.getAttribute('data-theme')).toBe('dark');
  });

  it('falls back to defaultMode', () => {
    const markup = renderToString(<ColorSchemeScript defaultMode="light" storageKey="other" />);
    new Function(/<script>(.*)<\/script>/.exec(markup)?.[1] ?? '')();
    expect(html.getAttribute('data-theme')).toBe('light');
  });
});
