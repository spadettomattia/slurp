import { hue } from '@slurp-ui/tokens';
import { describe, expect, it } from 'vitest';

import { alpha, contrast, meetsContrast, onColor, vivid } from '../src/lib/color';
import { createTheme, themeCss } from '../src/lib/theme';

describe('createTheme', () => {
  it('has the documented defaults', () => {
    expect(createTheme()).toEqual({
      colorScheme: 'system',
      accent: 'hue-violet',
      accentColor: hue.violet,
      locale: 'it-IT',
      tokens: {},
      motion: {
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
      },
      components: {},
    });
  });

  it('uses hue-* presets as they are and turns any other colour into a vivid accent', () => {
    expect(createTheme({ accent: 'hue-pink' }).accentColor).toBe(hue.pink);
    expect(createTheme({ accent: '#336699' }).accentColor).toBe(vivid('#336699'));
  });

  it('merges motion options', () => {
    expect(createTheme({ motion: { duration: 400, ghost: 'snapshot' } }).motion).toMatchObject({
      duration: 400,
      ghost: 'snapshot',
      stagger: 0.35,
      reducedMotion: 'user',
    });
  });

  it('is plain serialisable data (server components can pass it to the provider)', () => {
    const theme = createTheme({ accent: 'hue-teal', tokens: { radius: { card: 30 } } });
    expect(JSON.parse(JSON.stringify(theme))).toEqual(theme);
  });
});

describe('themeCss', () => {
  it('is empty for the default theme: tokens.css already has the default accent', () => {
    expect(themeCss(createTheme())).toBe('');
  });

  it('writes the accent variables on the root and on every data-theme subtree', () => {
    const css = themeCss(createTheme({ accent: 'hue-teal' }));
    expect(css).toContain(`:root,[data-theme]{--slurp-accent:${hue.teal}`);
    expect(css).toContain('--slurp-on-accent:#111114');
    expect(css).toContain(
      '--slurp-accent-ink:color-mix(in oklab, var(--slurp-accent) 45%, var(--slurp-fg))',
    );
    expect(css).toContain('--slurp-focus:var(--slurp-accent-ink)');
    expect(css).toMatch(/@layer slurp\.base\{/);
  });

  it('writes token overrides, numbers in px, themed values per scheme', () => {
    const css = themeCss(
      createTheme({
        tokens: {
          radius: { card: 30 },
          space: { 4: '18px' },
          color: { bg: { light: '#fff', dark: '#000' } },
        },
      }),
    );
    expect(css).toContain('--slurp-radius-card:30px');
    expect(css).toContain('--slurp-space-4:18px');
    expect(css).toContain(':root,[data-theme]{--slurp-bg:#fff');
    expect(css).toContain("[data-theme='dark']{--slurp-bg:#000}");
    expect(css).toContain(
      "@media (prefers-color-scheme: dark){:root:not([data-theme='light']){--slurp-bg:#000}}",
    );
  });
});

describe('colour utilities', () => {
  it('contrast() follows WCAG', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#777777')).toBe(1);
    expect(meetsContrast('#767676', '#ffffff')).toBe(true); // 4.54:1
    expect(meetsContrast('#777777', '#ffffff')).toBe(false); // 4.48:1
    expect(meetsContrast('#949494', '#ffffff', 'ui')).toBe(true);
  });

  it('rejects translucent colours and unknown formats', () => {
    expect(() => contrast('rgba(0, 0, 0, 0.5)', '#fff')).toThrow(/opaque/);
    expect(() => contrast('red', '#fff')).toThrow(/unsupported colour/);
  });

  it('onColor() picks dark ink or white', () => {
    expect(onColor('#ffe066')).toBe('#111114');
    expect(onColor('#1b1a23')).toBe('#ffffff');
  });

  it('vivid() lands in the design system range and stays in gamut', () => {
    for (const source of ['#336699', '#808080', '#ff0000', '#00ffcc'])
      expect(vivid(source)).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('alpha() writes a color-mix that also works with var()', () => {
    expect(alpha('#8b6fff', 0.16)).toBe('color-mix(in oklab, #8b6fff 16%, transparent)');
    expect(alpha('var(--slurp-accent)', 0.07)).toBe(
      'color-mix(in oklab, var(--slurp-accent) 7%, transparent)',
    );
  });
});
