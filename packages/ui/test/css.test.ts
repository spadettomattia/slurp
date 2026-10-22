import { describe, expect, it } from 'vitest';

import { compileCss, hash, mergeCss } from '../src/lib/css';

const rules = (css: string) =>
  css.replace(/^@layer [^;]+;@layer slurp\.utilities\{/, '').slice(0, -1);

describe('compileCss', () => {
  it('returns nothing for no style', () => {
    expect(compileCss(undefined)).toEqual({ className: '', css: '' });
    expect(compileCss({})).toEqual({ className: '', css: '' });
  });

  it('resolves tokens: space steps, colours, radius, shadow and type styles', () => {
    const { css } = compileCss({
      p: 4,
      gap: 2,
      bg: 'accent-soft',
      color: 'hue-teal',
      radius: 'card',
      shadow: 'float',
      font: 'title-l',
    });
    expect(css).toContain('padding:var(--slurp-space-4)');
    expect(css).toContain('gap:var(--slurp-space-2)');
    expect(css).toContain('background:var(--slurp-accent-soft)');
    expect(css).toContain('color:var(--slurp-hue-teal)');
    expect(css).toContain('border-radius:var(--slurp-radius-card)');
    expect(css).toContain('box-shadow:var(--slurp-shadow-float)');
    expect(css).toContain('font:var(--slurp-font-title-l)');
    expect(css).toContain('letter-spacing:var(--slurp-font-title-l-tracking)');
  });

  it('keeps plain CSS: numbers become px except unitless properties, strings stay as they are', () => {
    const { css } = compileCss({
      width: 120,
      opacity: 0.5,
      zIndex: 2,
      p: 7,
      margin: '0 auto',
      color: 'rebeccapurple',
    });
    expect(css).toContain('width:120px');
    expect(css).toContain('opacity:0.5');
    expect(css).toContain('z-index:2');
    expect(css).toContain('padding:7px'); // not a step of the scale
    expect(css).toContain('margin:0 auto');
    expect(css).toContain('color:rebeccapurple');
  });

  it('expands the space aliases', () => {
    const { css } = compileCss({ px: 6, my: 3 });
    expect(css).toContain('padding-inline:var(--slurp-space-6)');
    expect(css).toContain('margin-block:var(--slurp-space-3)');
  });

  it('gives one class per declaration, stable across calls', () => {
    const a = compileCss({ p: 4, bg: 'surface' });
    const b = compileCss({ bg: 'surface', p: 4 });
    expect(a.className.split(' ')).toHaveLength(2);
    expect(new Set(a.className.split(' '))).toEqual(new Set(b.className.split(' ')));
    expect(a.className).toMatch(/^slurp-x[0-9a-z]+ slurp-x[0-9a-z]+$/);
  });

  it('compiles nested selectors with & replaced by the class', () => {
    const { className, css } = compileCss({
      '&:hover': { bg: 'accent-soft' },
      '& .slurp-card-media': { radius: 'lg' },
    });
    const [hover, media] = className.split(' ');
    expect(rules(css)).toContain(`.${hover}:hover{background:var(--slurp-accent-soft)}`);
    expect(rules(css)).toContain(
      `.${media} .slurp-card-media{border-radius:var(--slurp-radius-lg)}`,
    );
  });

  it('compiles breakpoints with a doubled class, so they win over the base rule in any order', () => {
    const { className, css } = compileCss({ p: { base: 6, compact: 4 } });
    const [base, compact] = className.split(' ');
    expect(css).toContain(`.${base}{padding:var(--slurp-space-6)}`);
    expect(css).toContain(
      `@media (max-width: 640px){.${compact}.${compact}{padding:var(--slurp-space-4)}}`,
    );
    expect(compileCss({ display: { wide: 'grid' } }).css).toContain(
      '@media not all and (max-width: 640px)',
    );
  });

  it('puts every rule in slurp.utilities, after the layer order statement', () => {
    expect(compileCss({ p: 1 }).css).toMatch(
      /^@layer slurp\.reset, slurp\.base, slurp\.components, slurp\.utilities;@layer slurp\.utilities\{/,
    );
  });

  it('passes custom properties through', () => {
    expect(compileCss({ '--slurp-flow-gap': '3px' }).css).toContain('--slurp-flow-gap:3px');
  });
});

describe('mergeCss', () => {
  it('lets later objects win and merges nested selectors', () => {
    expect(
      mergeCss(
        { p: 2, '&:hover': { bg: 'surface', color: 'fg' } },
        { p: 4, '&:hover': { bg: 'accent-soft' } },
      ),
    ).toEqual({
      p: 4,
      '&:hover': { bg: 'accent-soft', color: 'fg' },
    });
    expect(mergeCss(undefined, { p: 1 })).toEqual({ p: 1 });
  });
});

describe('hash', () => {
  it('is short and deterministic', () => {
    expect(hash('a')).toBe(hash('a'));
    expect(hash('a')).not.toBe(hash('b'));
    expect(hash('padding:var(--slurp-space-4)').length).toBeLessThanOrEqual(7);
  });
});
