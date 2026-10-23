// createTheme() and the stylesheet that applies a theme. Server-safe: a theme is plain, serialisable data,
// so it can be created in a server component and passed to <SlurpProvider>.
import { MOTION_DEFAULTS, type GhostKind, type SlurpDefaults } from '@slurp-ui/motion';
import type { blur, ColorToken, HueToken, RadiusToken, shadow, SpaceToken } from '@slurp-ui/tokens';

import type { AccentScopeProps } from '../AccentScope/AccentScope';
import type { BentoProps } from '../Bento/Bento';
import type { CardProps } from '../Card/Card';
import type { DockProps } from '../Dock/Dock';
import type { EmptyProps } from '../Empty/Empty';
import type { FactProps } from '../Fact/Fact';
import type { FiltersProps } from '../Filters/Filters';
import type { LinkProps } from '../Link/Link';
import type { ListProps, ListRowProps } from '../ListRow/ListRow';
import type { ResultRowProps } from '../ResultRow/ResultRow';
import type { ScoreProps } from '../Score/Score';
import type { SettingsProps } from '../Settings/Settings';
import type { ShelfProps } from '../Shelf/Shelf';
import type { StageProps } from '../Stage/Stage';
import type { TileProps } from '../Tile/Tile';
import type { AvatarProps } from '../Avatar/Avatar';
import type { BloomProps } from '../Bloom/Bloom';
import type { BubbleProps } from '../Bubble/Bubble';
import type { ButtonProps } from '../Button/Button';
import type { CellProps } from '../Cell/Cell';
import type { CheckboxProps } from '../Checkbox/Checkbox';
import type { ChipProps } from '../Chip/Chip';
import type { ChoiceProps } from '../Choice/Choice';
import type { CountProps } from '../Count/Count';
import type { DialogProps } from '../Dialog/Dialog';
import type { FieldProps } from '../Field/Field';
import type { FlowProps } from '../Flow/Flow';
import type { FoldProps } from '../Fold/Fold';
import type { FrameProps } from '../Frame/Frame';
import type { HintProps } from '../Hint/Hint';
import type { MenuProps } from '../Menu/Menu';
import type { NoticeProps } from '../Notice/Notice';
import type { PlaceholderProps } from '../Placeholder/Placeholder';
import type { ProgressProps } from '../Progress/Progress';
import type { RadioGroupProps, RadioProps } from '../Radio/Radio';
import type { RangeProps } from '../Range/Range';
import type { SearchProps } from '../Search/Search';
import type { SegmentedProps } from '../Segmented/Segmented';
import type { SheetProps } from '../Sheet/Sheet';
import type { SurfaceProps } from '../Surface/Surface';
import type { SwatchGroupProps, SwatchProps } from '../Swatch/Swatch';
import type { SwitchProps } from '../Switch/Switch';
import type { TabsProps } from '../Tabs/Tabs';
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
  Bento: { props: BentoProps; parts: 'root' };
  Card: { props: CardProps; parts: 'root' | 'media' | 'badge' | 'title' | 'description' };
  Dock: { props: DockProps; parts: 'root' };
  Empty: { props: EmptyProps; parts: 'root' };
  Fact: { props: FactProps; parts: 'root' };
  Filters: { props: FiltersProps; parts: 'root' };
  Link: { props: LinkProps; parts: 'root' };
  List: { props: ListProps; parts: 'root' };
  ListRow: {
    props: ListRowProps;
    parts: 'root' | 'mark' | 'title' | 'tag' | 'meta' | 'value' | 'action';
  };
  ResultRow: { props: ResultRowProps; parts: 'root' };
  Score: { props: ScoreProps; parts: 'root' };
  Settings: { props: SettingsProps; parts: 'root' };
  Shelf: { props: ShelfProps; parts: 'root' };
  Stage: { props: StageProps; parts: 'root' };
  Tile: {
    props: TileProps;
    parts: 'root' | 'blob' | 'text' | 'title' | 'subtitle' | 'badge' | 'media';
  };
  Avatar: { props: AvatarProps; parts: 'root' };
  Bloom: { props: BloomProps; parts: 'root' | 'surface' | 'trigger' | 'panel' };
  Bubble: { props: BubbleProps; parts: 'root' };
  Button: { props: ButtonProps; parts: 'root' | 'icon' | 'label' | 'endIcon' };
  Cell: { props: CellProps; parts: 'root' };
  Checkbox: { props: CheckboxProps; parts: 'root' | 'input' | 'box' | 'label' };
  Chip: { props: ChipProps; parts: 'root' };
  Choice: { props: ChoiceProps; parts: 'root' };
  Count: { props: CountProps; parts: 'root' };
  Dialog: {
    props: DialogProps;
    parts: 'root' | 'header' | 'title' | 'description' | 'body' | 'footer' | 'close';
  };
  Field: { props: FieldProps; parts: 'root' | 'label' | 'control' | 'hint' | 'error' };
  Flow: { props: FlowProps; parts: 'root' };
  Fold: { props: FoldProps; parts: 'root' | 'heading' | 'trigger' | 'region' };
  Frame: { props: FrameProps; parts: 'root' };
  Hint: { props: HintProps; parts: 'root' };
  Menu: { props: MenuProps; parts: 'root' };
  Notice: { props: NoticeProps; parts: 'root' | 'icon' | 'title' | 'body' | 'dismiss' };
  Placeholder: { props: PlaceholderProps; parts: 'root' };
  Progress: { props: ProgressProps; parts: 'root' };
  Radio: { props: RadioProps; parts: 'root' | 'input' | 'dot' | 'label' };
  RadioGroup: { props: RadioGroupProps; parts: 'root' | 'legend' };
  Range: { props: RangeProps; parts: 'root' | 'label' | 'value' | 'control' };
  Search: { props: SearchProps; parts: 'root' | 'icon' | 'control' | 'clear' | 'status' };
  Segmented: { props: SegmentedProps; parts: 'root' | 'item' };
  Sheet: {
    props: SheetProps;
    parts: 'root' | 'header' | 'title' | 'description' | 'body' | 'footer' | 'close';
  };
  Surface: { props: SurfaceProps; parts: 'root' };
  Swatch: { props: SwatchProps; parts: 'root' };
  SwatchGroup: { props: SwatchGroupProps; parts: 'root' };
  Switch: { props: SwitchProps; parts: 'root' | 'input' | 'track' | 'thumb' | 'label' };
  Tabs: { props: TabsProps; parts: 'root' | 'list' | 'tab' | 'indicator' | 'panel' };
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
