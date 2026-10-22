// @slurp/ui — components, theme, provider and hooks of the Slurp design system.
// Subpaths: @slurp/ui/<Component> · @slurp/ui/tokens · @slurp/ui/motion · @slurp/ui/icons · @slurp/ui/styles.css

// Theme and provider
export {
  ColorSchemeScript,
  SlurpProvider,
  useColorScheme,
  useTheme,
  type ColorSchemeScriptProps,
  type ColorSchemeState,
  type SlurpProviderProps,
} from './SlurpProvider';
export {
  createTheme,
  DEFAULT_STORAGE_KEY,
  type AccentInput,
  type ColorSchemeMode,
  type ComponentsConfig,
  type MotionOptions,
  type ResolvedColorScheme,
  type Theme,
  type ThemeOptions,
  type TokenOverrides,
} from './lib/theme';

// Styling
export type { BaseProps, PolymorphicProps } from './lib/polymorphic';
export type {
  ColorValue,
  MaybeResponsive,
  RadiusValue,
  Responsive,
  SlurpCss,
  SpaceValue,
} from './lib/css';
export { alpha, contrast, CONTRAST_MIN, meetsContrast, onColor, vivid } from './lib/color';

// Foundations
export { AccentScope, type AccentScopeProps } from './AccentScope';
export { Cell, type CellProps } from './Cell';
export { Flow, type FlowProps } from './Flow';
export { Frame, type FrameProps } from './Frame';
export { Ground } from './Ground';
export { Surface, type SurfaceProps } from './Surface';
export { Text, type TextProps, type TextTone } from './Text';
