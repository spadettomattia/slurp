// The `css` prop: a style object with design tokens, pseudo/nested selectors and breakpoints, compiled to hashed atomic
// classes in `@layer slurp.utilities`. Pure and server-safe: components render the result through a React 19 <style>.
import {
  color,
  COMPACT_QUERY,
  font,
  hue,
  radius,
  shadow,
  space,
  type ColorToken,
  type FontToken,
  type HueToken,
  type RadiusToken,
  type SpaceToken,
} from '@slurp-ui/tokens';
import type { CSSProperties } from 'react';

export const LAYER_ORDER = '@layer slurp.reset, slurp.base, slurp.components, slurp.utilities;';

/** Breakpoint keys: `compact` is the design system's phone layout (COMPACT_QUERY), `wide` everything above it. */
export interface Responsive<T> {
  base?: T;
  compact?: T;
  wide?: T;
}
export type MaybeResponsive<T> = T | Responsive<T>;

type SpaceStep = SpaceToken extends `${infer N extends number}` ? N : never;
/** A step of the space scale (`4` → `var(--slurp-space-4)`), or any CSS length. */
export type SpaceValue = SpaceStep | (string & {}) | (number & {});
/** A colour token (`'accent-soft'`, `'hue-teal'`), or any CSS colour. */
export type ColorValue = ColorToken | `hue-${HueToken}` | (string & {});
export type RadiusValue = RadiusToken | (string & {}) | (number & {});

interface TokenProps {
  p?: MaybeResponsive<SpaceValue>;
  px?: MaybeResponsive<SpaceValue>;
  py?: MaybeResponsive<SpaceValue>;
  pt?: MaybeResponsive<SpaceValue>;
  pr?: MaybeResponsive<SpaceValue>;
  pb?: MaybeResponsive<SpaceValue>;
  pl?: MaybeResponsive<SpaceValue>;
  m?: MaybeResponsive<SpaceValue>;
  mx?: MaybeResponsive<SpaceValue>;
  my?: MaybeResponsive<SpaceValue>;
  mt?: MaybeResponsive<SpaceValue>;
  mr?: MaybeResponsive<SpaceValue>;
  mb?: MaybeResponsive<SpaceValue>;
  ml?: MaybeResponsive<SpaceValue>;
  gap?: MaybeResponsive<SpaceValue>;
  rowGap?: MaybeResponsive<SpaceValue>;
  columnGap?: MaybeResponsive<SpaceValue>;
  bg?: MaybeResponsive<ColorValue>;
  color?: MaybeResponsive<ColorValue>;
  borderColor?: MaybeResponsive<ColorValue>;
  outlineColor?: MaybeResponsive<ColorValue>;
  fill?: MaybeResponsive<ColorValue>;
  stroke?: MaybeResponsive<ColorValue>;
  radius?: MaybeResponsive<RadiusValue>;
  /** A type style: sets `font` and `letter-spacing`. */
  font?: MaybeResponsive<FontToken>;
  shadow?: MaybeResponsive<keyof typeof shadow | (string & {})>;
}

type PlainProps = {
  [K in Exclude<keyof CSSProperties, keyof TokenProps>]?: MaybeResponsive<CSSProperties[K]>;
};

/** Style object of the `css` prop. Keys starting with `&` are nested selectors (`'&:hover'`, `'& .slurp-card-media'`). */
export type SlurpCss = TokenProps &
  PlainProps & {
    [selector: `&${string}`]: SlurpCss | undefined;
    [customProperty: `--${string}`]: MaybeResponsive<string | number> | undefined;
  };

const SPACE_ALIASES: Record<string, string[]> = {
  p: ['padding'],
  px: ['padding-inline'],
  py: ['padding-block'],
  pt: ['padding-top'],
  pr: ['padding-right'],
  pb: ['padding-bottom'],
  pl: ['padding-left'],
  m: ['margin'],
  mx: ['margin-inline'],
  my: ['margin-block'],
  mt: ['margin-top'],
  mr: ['margin-right'],
  mb: ['margin-bottom'],
  ml: ['margin-left'],
};
const SPACE_PROPS = new Set([
  'gap',
  'row-gap',
  'column-gap',
  ...Object.values(SPACE_ALIASES).flat(),
]);
const SPACE_PROPS_PREFIXES = ['padding', 'margin', 'inset', 'top', 'right', 'bottom', 'left'];
const COLOR_PROPS = new Set([
  'color',
  'background',
  'background-color',
  'border-color',
  'outline-color',
  'fill',
  'stroke',
]);
const UNITLESS = new Set([
  'opacity',
  'z-index',
  'flex',
  'flex-grow',
  'flex-shrink',
  'font-weight',
  'line-height',
  'order',
  'aspect-ratio',
  'scale',
  'grid-column',
  'grid-row',
]);

const MEDIA = {
  compact: COMPACT_QUERY,
  wide: `not all and ${COMPACT_QUERY}`,
} as const;

const kebab = (key: string) =>
  key.startsWith('--') ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const isSpaceProp = (prop: string) =>
  SPACE_PROPS.has(prop) || SPACE_PROPS_PREFIXES.some((p) => prop === p || prop.startsWith(`${p}-`));

/** One CSS value for `prop`, with design tokens resolved to custom properties. */
function value(prop: string, raw: string | number): string {
  if (isSpaceProp(prop) && String(raw) in space) return `var(--slurp-space-${raw})`;
  if (COLOR_PROPS.has(prop) && typeof raw === 'string') {
    if (raw in color) return `var(--slurp-${raw})`;
    if (raw.startsWith('hue-') && raw.slice(4) in hue) return `var(--slurp-${raw})`;
  }
  if (prop === 'border-radius' && typeof raw === 'string' && raw in radius)
    return `var(--slurp-radius-${raw})`;
  if (prop === 'box-shadow' && typeof raw === 'string' && raw in shadow)
    return `var(--slurp-shadow-${raw})`;
  if (typeof raw === 'number' && raw !== 0 && !UNITLESS.has(prop) && !prop.startsWith('--'))
    return `${raw}px`;
  return String(raw);
}

/** Expands aliases (`p`, `bg`, `radius`, `font`, …) into real declarations. */
function declarations(key: string, raw: string | number): [string, string][] {
  if (key === 'font') {
    return String(raw) in font
      ? [
          ['font', `var(--slurp-font-${raw})`],
          ['letter-spacing', `var(--slurp-font-${raw}-tracking)`],
        ]
      : [['font', String(raw)]];
  }
  const props =
    SPACE_ALIASES[key] ??
    (key === 'bg'
      ? ['background']
      : key === 'radius'
        ? ['border-radius']
        : key === 'shadow'
          ? ['box-shadow']
          : [kebab(key)]);
  return props.map((prop) => [prop, value(prop, raw)]);
}

/** FNV-1a, base 36: short, stable class names. */
export function hash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

const isResponsive = (v: unknown): v is Responsive<string | number> =>
  typeof v === 'object' &&
  v !== null &&
  Object.keys(v).every((k) => k === 'base' || k === 'compact' || k === 'wide');

export interface CompiledCss {
  /** Space-separated atomic class names. */
  className: string;
  /** The rules, inside `@layer slurp.utilities` (empty when there is nothing to emit). */
  css: string;
}

/**
 * Compiles a `css` object. Each declaration becomes one class: `.slurp-x<hash>`.
 * Breakpoint rules double the class (higher specificity than the base rule, whatever the order).
 */
export function compileCss(style: SlurpCss | undefined): CompiledCss {
  if (!style) return { className: '', css: '' };
  const classes = new Set<string>();
  const rules: string[] = [];

  const walk = (obj: SlurpCss, selector: string) => {
    for (const [key, raw] of Object.entries(obj)) {
      if (raw === undefined || raw === null || raw === false) continue;
      if (key.startsWith('&')) {
        walk(raw as SlurpCss, selector + key.slice(1));
        continue;
      }
      const variants = isResponsive(raw)
        ? (Object.entries(raw) as ['base' | 'compact' | 'wide', string | number | undefined][])
        : [['base', raw as string | number] as const];
      for (const [bp, v] of variants) {
        if (v === undefined) continue;
        for (const [prop, val] of declarations(key, v)) {
          const name = `slurp-x${hash(`${bp}|${selector}|${prop}|${val}`)}`;
          if (classes.has(name)) continue;
          classes.add(name);
          const target =
            (bp === 'base' ? `.${name}` : `.${name}.${name}`) +
            selector.replaceAll('&', `.${name}`);
          const rule = `${target}{${prop}:${val}}`;
          rules.push(bp === 'base' ? rule : `@media ${MEDIA[bp]}{${rule}}`);
        }
      }
    }
  };
  walk(style, '');

  return {
    className: [...classes].join(' '),
    css: rules.length ? `${LAYER_ORDER}@layer slurp.utilities{${rules.join('')}}` : '',
  };
}

/** Deep merge of `css` objects, later ones win (theme defaults first, instance last). */
export function mergeCss(...styles: (SlurpCss | undefined)[]): SlurpCss | undefined {
  const present = styles.filter((s): s is SlurpCss => !!s);
  if (present.length <= 1) return present[0];
  const out: Record<string, unknown> = {};
  for (const style of present) {
    for (const [key, v] of Object.entries(style)) {
      const prev = out[key];
      out[key] = key.startsWith('&') && prev && v ? mergeCss(prev as SlurpCss, v as SlurpCss) : v;
    }
  }
  return out as SlurpCss;
}
