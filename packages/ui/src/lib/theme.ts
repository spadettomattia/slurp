// createTheme() and the stylesheet that applies a theme. Server-safe: a theme is plain, serialisable data,
// so it can be created in a server component and passed to <SlurpProvider>.
import { MOTION_DEFAULTS, type GhostKind, type SlurpDefaults } from '@slurp-ui/motion';
import type { blur, ColorToken, HueToken, RadiusToken, shadow, SpaceToken } from '@slurp-ui/tokens';

import type { AccentScopeProps } from '../AccentScope/AccentScope';
import type { CellProps } from '../Cell/Cell';
import type { FlowProps } from '../Flow/Flow';
import type { FrameProps } from '../Frame/Frame';
import type { SurfaceProps } from '../Surface/Surface';
import type { TextProps } from '../Text/Text';
import { accentVars, resolveAccent } from './color';
import { hash, LAYER_ORDER, type SlurpCss } from './css';

export type ColorSchemeMode = 'light' | 'dark' | 'system';
export type ResolvedColorScheme = 'light' | 'dark';
/** A `hue-*` preset (used as is) or any hex colour (turned into an accent with `vivid()`). */
export type AccentInput = `hue-${HueToken}` | `#${string}`;

type Themed = string | { light: string; dark: string };
type Length = string | number;

export interface TokenOverrides {
  color?: Partial<Record<ColorToken | `hue-${HueToken}`, Themed>>;
  space?: Partial<Record<SpaceToken, Length>>;
  radius?: Partial<Record<RadiusToken, Length>>;
  shadow?: Partial<Record<keyof typeof shadow, Themed>>;
  blur?: Partial<Record<keyof typeof blur, Length>>;
}

/** Defaults of the collapse / expand transitions started with useSlurp() (serialisable values only). */
export interface MotionOptions extends Pick<
  SlurpDefaults,
  'duration' | 'stagger' | 'curve' | 'swell' | 'drop' | 'reducedMotion' | 'interrupt'
> {
  goo: boolean | 'auto';
  ghost: GhostKind;
  order: 'distance' | 'dom';
}

const { duration, stagger, curve, swell, drop, reducedMotion, interrupt } = MOTION_DEFAULTS;
const DEFAULT_MOTION: MotionOptions = {
  duration,
  stagger,
  curve,
  swell,
  drop,
  reducedMotion,
  interrupt,
  goo: 'auto',
  ghost: 'shape',
  order: 'distance',
};

/** Components that read defaults and `css` overrides from the theme, with their parts. */
export interface ThemeComponents {
  AccentScope: { props: AccentScopeProps; parts: 'root' };
  Cell: { props: CellProps; parts: 'root' };
  Flow: { props: FlowProps; parts: 'root' };
  Frame: { props: FrameProps; parts: 'root' };
  Surface: { props: SurfaceProps; parts: 'root' };
  Text: { props: TextProps; parts: 'root' };
}
export type ComponentName = keyof ThemeComponents;

export type ComponentsConfig = {
  [K in ComponentName]?: {
    defaults?: Partial<Omit<ThemeComponents[K]['props'], 'ref' | 'children' | 'css'>>;
    css?: Partial<Record<ThemeComponents[K]['parts'], SlurpCss>>;
  };
};

export interface ThemeOptions {
  /** Initial colour scheme, until the person chooses one (default `system`). */
  colorScheme?: ColorSchemeMode;
  /** Default `hue-violet`. */
  accent?: AccentInput;
  /** Used only by Intl (numbers, prices). Not an i18n system. Default `it-IT`. */
  locale?: string;
  tokens?: TokenOverrides;
  motion?: Partial<MotionOptions>;
  components?: ComponentsConfig;
}

export interface Theme {
  colorScheme: ColorSchemeMode;
  accent: AccentInput;
  /** The accent actually painted (hex). */
  accentColor: string;
  locale: string;
  tokens: TokenOverrides;
  motion: MotionOptions;
  components: ComponentsConfig;
}

const DEFAULT_ACCENT: AccentInput = 'hue-violet';

/** localStorage key of the chosen colour scheme (same as the design system's setTheme()). */
export const DEFAULT_STORAGE_KEY = 'slurp-theme';

export function createTheme(options: ThemeOptions = {}): Theme {
  const accent = options.accent ?? DEFAULT_ACCENT;
  return {
    colorScheme: options.colorScheme ?? 'system',
    accent,
    accentColor: resolveAccent(accent),
    locale: options.locale ?? 'it-IT',
    tokens: options.tokens ?? {},
    motion: { ...DEFAULT_MOTION, ...options.motion },
    components: options.components ?? {},
  };
}

export const defaultTheme: Theme = createTheme();

const px = (v: Length) => (typeof v === 'number' ? `${v}px` : v);

/** Light / dark declarations of the token overrides of a theme. */
function overrideDeclarations(tokens: TokenOverrides) {
  const light: string[] = [];
  const dark: string[] = [];
  const add = (name: string, v: Themed | number) => {
    if (typeof v === 'object') {
      light.push(`--slurp-${name}:${v.light}`);
      dark.push(`--slurp-${name}:${v.dark}`);
    } else light.push(`--slurp-${name}:${px(v)}`);
  };
  for (const [k, v] of Object.entries(tokens.color ?? {})) if (v !== undefined) add(k, v);
  for (const [k, v] of Object.entries(tokens.space ?? {}))
    if (v !== undefined) add(`space-${k}`, v);
  for (const [k, v] of Object.entries(tokens.radius ?? {}))
    if (v !== undefined) add(`radius-${k}`, v);
  for (const [k, v] of Object.entries(tokens.shadow ?? {}))
    if (v !== undefined) add(`shadow-${k}`, v);
  for (const [k, v] of Object.entries(tokens.blur ?? {})) if (v !== undefined) add(`blur-${k}`, v);
  return { light, dark };
}

function selectors(scope: string | undefined) {
  if (!scope) {
    return {
      base: ':root,[data-theme]',
      dark: "[data-theme='dark']",
      systemDark: ":root:not([data-theme='light'])",
    };
  }
  const s = `[data-slurp-theme="${scope}"]`;
  return {
    base: `${s},${s} [data-theme]`,
    dark: `:root[data-theme='dark'] ${s},${s} [data-theme='dark']`,
    systemDark: `:root:not([data-theme='light']) ${s}`,
  };
}

/**
 * The stylesheet of a theme: accent variables and token overrides, on the root (or on a nested provider's `scope`)
 * and on every `data-theme` subtree, so derived values re-resolve per theme. Empty for the default theme.
 * tokens.css uses `:where()`, so these plain selectors win whatever the stylesheet order.
 */
export function themeCss(theme: Theme, scope?: string): string {
  const { light, dark } = overrideDeclarations(theme.tokens);
  const accent =
    theme.accent === DEFAULT_ACCENT
      ? []
      : Object.entries(accentVars(theme.accentColor)).map(([k, v]) => `${k}:${v}`);
  const base = [...accent, ...light];
  if (!base.length && !dark.length) return '';
  const sel = selectors(scope);
  const rules = [`${sel.base}{${base.join(';')}}`];
  if (dark.length) {
    rules.push(
      `${sel.dark}{${dark.join(';')}}`,
      `@media (prefers-color-scheme: dark){${sel.systemDark}{${dark.join(';')}}}`,
    );
  }
  return `${LAYER_ORDER}@layer slurp.base{${rules.join('')}}`;
}

/** Stable id of a stylesheet, for React's <style href> de-duplication. */
export const styleId = (prefix: string, css: string) => `slurp-${prefix}-${hash(css)}`;
