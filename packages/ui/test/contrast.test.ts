// Automatic contrast checks of the design system rules (WCAG 2.2 AA), for every hue-* accent, in both themes.
// Grounds are computed the way the browser paints them: the bg tinted 7% by the accent (oklab), translucent
// surfaces composited over it, accent-soft (16%) over it.
import { color, hue, type HueToken } from '@slurp/tokens';
import { describe, expect, it } from 'vitest';

import { composite, contrast, mix, onColor, resolveAccent, vivid } from '../src/lib/color';

type Theme = 'light' | 'dark';
const themes: Theme[] = ['light', 'dark'];
const pick = (value: string | { light: string; dark: string }, theme: Theme) =>
  typeof value === 'string' ? value : value[theme];

function grounds(accent: string, theme: Theme): Record<string, string> {
  const bg = pick(color.bg, theme);
  const tinted = mix(accent, bg, 0.07);
  return {
    bg,
    'bg (tinted)': tinted,
    surface: composite(pick(color.surface, theme), tinted),
    'surface-dock': composite(pick(color['surface-dock'], theme), tinted),
    'surface-2': pick(color['surface-2'], theme),
    'accent-soft': composite(`${accent}29`, tinted), // 0x29 / 255 ≈ 16%
  };
}

const accentInk = (accent: string, theme: Theme) => mix(accent, pick(color.fg, theme), 0.45);

const cases = (Object.keys(hue) as HueToken[]).flatMap((name) =>
  themes.map((theme) => ({ name: `hue-${name}`, accent: hue[name], theme })),
);

describe.each(cases)('$name · $theme', ({ accent, theme }) => {
  const g = grounds(accent, theme);

  it('on-accent on the accent fill ≥ 4.5:1', () => {
    expect(contrast(onColor(accent), accent)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(Object.keys(g))('text ≥ 4.5:1 on %s', (ground) => {
    const on = g[ground] as string;
    // Status colours on accent-soft (light theme) are a known gap of the design system: see the test below.
    const status =
      ground === 'accent-soft' && theme === 'light'
        ? []
        : (['success', 'warning', 'danger'] as const);
    for (const text of ['fg', 'muted', ...status] as const) {
      expect(contrast(pick(color[text], theme), on), `${text} on ${ground}`).toBeGreaterThanOrEqual(
        4.5,
      );
    }
    expect(
      contrast(accentInk(accent, theme), on),
      `accent-ink on ${ground}`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(Object.keys(g).filter((n) => n !== 'accent-soft'))(
    'boundaries and focus ≥ 3:1 on %s',
    (ground) => {
      const on = g[ground] as string;
      expect(
        contrast(pick(color['border-control'], theme), on),
        'border-control',
      ).toBeGreaterThanOrEqual(3);
      expect(contrast(accentInk(accent, theme), on), 'focus').toBeGreaterThanOrEqual(3);
    },
  );
});

describe('known design-system gap', () => {
  // tokens.json says success / warning / danger are "≥ 4.5:1 on all grounds", but on accent-soft in the light theme
  // they drop to 4.07–4.49 for these hues. Reported to the design system; tokens are not changed here.
  // When the tokens are fixed this list becomes empty: then drop the exception in the suite above.
  it('status text on accent-soft (light) fails only for the recorded hues', () => {
    const failing = (Object.keys(hue) as HueToken[]).filter((name) => {
      const on = grounds(hue[name], 'light')['accent-soft'] as string;
      return (['success', 'warning', 'danger'] as const).some(
        (t) => contrast(pick(color[t], 'light'), on) < 4.5,
      );
    });
    expect(failing).toEqual(['red', 'orange', 'green', 'teal', 'blue', 'violet', 'pink']);
  });
});

describe('default accent', () => {
  it('the static accent-ink of tokens.json matches the runtime formula', () => {
    for (const theme of themes) {
      expect(
        contrast(accentInk(color.accent, theme), pick(color['accent-ink'], theme)),
      ).toBeLessThan(1.1);
    }
  });
});

describe('vivid()', () => {
  it.each(['#336699', '#c0c0c0', '#000000', '#ffffff', '#ff00ff', '#7a5c00'])(
    'turns %s into an accent with a readable on-accent',
    (source) => {
      const accent = vivid(source);
      expect(contrast(onColor(accent), accent)).toBeGreaterThanOrEqual(4.5);
      for (const theme of themes) {
        expect(
          contrast(accentInk(accent, theme), grounds(accent, theme)['bg (tinted)'] as string),
        ).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it('keeps hue-* presets as they are through resolveAccent()', () => {
    expect(resolveAccent('hue-teal')).toBe(hue.teal);
    expect(resolveAccent('#336699')).toBe(vivid('#336699'));
  });
});
