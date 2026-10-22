import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  buildCss,
  buildFontsCss,
  buildModel,
  fontVars,
  resolve,
  varName,
  type SlurpTokensSource,
} from '../scripts/tokens-lib.ts';
import { COMPACT_QUERY, color, cssVar, font, hue, radius, space, vars } from '../src/index';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = JSON.parse(
  readFileSync(path.join(here, '../src/tokens.json'), 'utf8'),
) as SlurpTokensSource;
const model = buildModel(src);
const css = buildCss(model);

/** Body of the first rule whose selector starts exactly with `selector`. */
function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start, `rule ${selector}`).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf('}', start));
}

describe('tokens.css', () => {
  it('declares every token of the source with the --slurp- prefix', () => {
    const all = [
      ...src.color.tokens,
      ...src.spacing.tokens,
      ...src.radius.tokens,
      ...src.shadow.tokens,
      ...src.blur.tokens,
      ...src.opacity.tokens,
    ];
    for (const token of all) expect(css).toContain(`${varName(token.name)}:`);
  });

  it('gives every themed token both a light and a dark value', () => {
    const light = block(":where(:root, [data-theme='light'])");
    const dark = block(":where([data-theme='dark'])");
    const systemDark = block(":where(:root:not([data-theme='light']))");
    for (const token of src.color.tokens) {
      if (typeof token.value === 'string' || token.value.light === token.value.dark) continue;
      expect(light).toContain(`${varName(token.name)}: ${token.value.light};`);
      expect(dark).toContain(`${varName(token.name)}: ${token.value.dark};`);
      expect(systemDark).toContain(`${varName(token.name)}: ${token.value.dark};`);
    }
  });

  it('emits aliases of themed tokens inside each theme block, so subtrees re-resolve them', () => {
    expect(block(":where([data-theme='dark'])")).toContain(
      '--slurp-focus: var(--slurp-accent-ink);',
    );
    expect(block(':where(:root)')).not.toContain('--slurp-focus');
    expect(resolve(model, 'focus')).toEqual({ light: '#463b79', dark: '#c1baff' });
  });

  it('uses zero-specificity selectors only, so theme overrides win whatever the stylesheet order', () => {
    const selectors = [...css.matchAll(/^ *([^@\s/*-][^{\n]*)\{$/gm)].map((m) =>
      String(m[1]).trim(),
    );
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) expect(selector).toMatch(/^:where\(.+\)$/);
  });

  it('wraps everything in the slurp.base layer, after the layer order statement', () => {
    expect(css).toMatch(
      /^\/\*.*\*\/\n@layer slurp\.reset, slurp\.base, slurp\.components, slurp\.utilities;\n\n@layer slurp\.base \{/,
    );
  });

  it('shrinks display styles on phones as the design system says', () => {
    expect(COMPACT_QUERY).toBe('(max-width: 640px)');
    const compact = block(`@media ${COMPACT_QUERY}`);
    expect(compact).toContain('--slurp-font-display-xl-size: 34px;');
    expect(compact).toContain('--slurp-font-display-l-size: 36px;');
    expect(compact).toContain('--slurp-font-title-xl-size: 32px;');
    expect(compact).toContain('--slurp-font-tile-label-size: 22px;');
    expect(compact).not.toContain('--slurp-font-body-size');
  });
});

describe('fonts.css', () => {
  it('declares one Poppins face per shipped weight', () => {
    const fonts = buildFontsCss(model);
    for (const weight of ['400', '500', '600', '700']) {
      expect(fonts).toContain(`font-weight: ${weight};`);
      expect(fonts).toContain(`url('./fonts/poppins-latin-${weight}-normal.woff2')`);
    }
  });
});

describe('TS constants', () => {
  it('mirror the source values', () => {
    expect(color.bg).toEqual({ light: '#f7f7fa', dark: '#0f0e14' });
    expect(color.accent).toBe('#8b6fff');
    expect(hue.violet).toBe(color.accent);
    expect(space[4]).toBe('16px');
    expect(radius.card).toBe('34px');
    expect(font['display-xl']).toMatchObject({
      fontSize: '52px',
      compactFontSize: '34px',
      fontWeight: 600,
    });
  });

  it('list every custom property of tokens.css in `vars`', () => {
    const declared = new Set([...css.matchAll(/(--slurp-[a-z0-9-]+):/g)].map((m) => m[1]));
    expect(new Set(Object.values(vars))).toEqual(declared);
    expect(fontVars(model).length).toBeGreaterThan(0);
  });

  it('cssVar() builds var() references', () => {
    expect(cssVar('accent-soft')).toBe('var(--slurp-accent-soft)');
    expect(cssVar('space-4', '16px')).toBe('var(--slurp-space-4, 16px)');
  });
});

describe('buildModel validation', () => {
  it('rejects references to unknown tokens', () => {
    const broken = structuredClone(src);
    broken.color.tokens.push({ name: 'ghost', value: '{nope}', usage: '' });
    expect(() => buildModel(broken)).toThrow(/unknown token "nope"/);
  });

  it('rejects duplicate names', () => {
    const broken = structuredClone(src);
    broken.radius.tokens.push({ name: 'space-1', value: '1px', usage: '' });
    expect(() => buildModel(broken)).toThrow(/Duplicate token "space-1"/);
  });
});
