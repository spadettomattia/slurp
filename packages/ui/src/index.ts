// @slurp-ui/react — components, theme, provider and hooks of the Slurp design system.
// Subpaths: @slurp-ui/react/<Component> · @slurp-ui/react/tokens · @slurp-ui/react/motion · @slurp-ui/react/icons · @slurp-ui/react/styles.css

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

// Motion (opt-in): components only register, useSlurp() starts the transitions. Engine: @slurp-ui/react/motion
export { AnimationGroup, type AnimationGroupProps } from './motion/AnimationGroup';
export { useAnimationTarget, type AnimationProps } from './motion/useAnimationTarget';
export { useSlurp, type SlurpControls } from './motion/useSlurp';

// Foundations
export { AccentScope, type AccentScopeProps } from './AccentScope';
export { Cell, type CellProps } from './Cell';
export { Flow, type FlowProps } from './Flow';
export { Frame, type FrameProps } from './Frame';
export { Ground } from './Ground';
export { Surface, type SurfaceProps } from './Surface';
export { Text, type TextProps, type TextTone } from './Text';
