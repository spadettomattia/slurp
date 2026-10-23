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
export {
  useSlurpEnter,
  useSlurpNavigate,
  type ContentRef,
  type SlurpEnterOptions,
  type SlurpNavigate,
  type SlurpNavigateOptions,
} from './motion/navigation';

// Foundations
export { AccentScope, type AccentScopeProps } from './AccentScope';
export { Cell, type CellProps } from './Cell';
export { Flow, type FlowProps } from './Flow';
export { Frame, type FrameProps } from './Frame';
export { Ground } from './Ground';
export { Surface, type SurfaceProps } from './Surface';
export { Text, type TextProps, type TextTone } from './Text';
export { VisuallyHidden, type VisuallyHiddenProps } from './VisuallyHidden';
export { Portal, type PortalProps } from './Portal';

// Actions and display
export {
  Button,
  type Appearance,
  type ButtonProps,
  type ButtonTone,
  type ControlSize,
} from './Button';
export { Bubble, type BubbleProps } from './Bubble';
export { Chip, type ChipProps } from './Chip';
export { Segmented, type SegmentedOption, type SegmentedProps } from './Segmented';
export { Count, type CountProps } from './Count';
export { Avatar, type AvatarProps } from './Avatar';
export {
  Swatch,
  SwatchGroup,
  type SwatchGroupProps,
  type SwatchOption,
  type SwatchProps,
} from './Swatch';
export { Progress, type ProgressProps } from './Progress';
export { Placeholder, type PlaceholderProps } from './Placeholder';
export {
  Notice,
  NOTICE_LABELS,
  type NoticeLabels,
  type NoticeProps,
  type StatusTone,
} from './Notice';

// Form controls
export { Field, type FieldProps } from './Field';
export { Search, SEARCH_LABELS, type SearchLabels, type SearchProps } from './Search';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Radio, RadioGroup, type RadioGroupProps, type RadioProps } from './Radio';
export { Switch, type SwitchProps } from './Switch';
export { Range, type RangeProps } from './Range';
export {
  Choice,
  CHOICE_LABELS,
  type ChoiceLabels,
  type ChoiceOption,
  type ChoiceProps,
} from './Choice';

// Disclosure and overlays: the trigger becomes the panel (Bloom)
export { Tabs, type TabItem, type TabsProps } from './Tabs';
export { Fold, type FoldProps } from './Fold';
export { Hint, type HintProps } from './Hint';
export { Bloom, type BloomPlacement, type BloomProps } from './Bloom';
export { Menu, MenuItem, type MenuItemProps, type MenuProps } from './Menu';
export { Dialog, DIALOG_LABELS, type DialogLabels, type DialogProps } from './Dialog';
export { Sheet, type SheetProps } from './Sheet';
export {
  TOAST_LABELS,
  ToastProvider,
  useToast,
  type ToastLabels,
  type ToastOptions,
  type ToastProviderProps,
} from './Toast';

// Signature components: entry grid, lists, detail pages, navigation
export { Tile, type TileProps } from './Tile';
export { Bento, type BentoProps } from './Bento';
export { Card, type CardProps } from './Card';
export { Shelf, type ShelfProps } from './Shelf';
export { Stage, type StageProps } from './Stage';
export { Fact, type FactProps } from './Fact';
export { Score, type ScoreProps } from './Score';
export { List, ListRow, type ListProps, type ListRowProps } from './ListRow';
export { ResultRow, type ResultRowProps } from './ResultRow';
export { Mark, type MarkProps } from './Mark';
export { Empty, type EmptyProps } from './Empty';
export { Link, type LinkProps } from './Link';
export {
  Dock,
  DOCK_LABELS,
  type DockActionProps,
  type DockBackProps,
  type DockCrumbProps,
  type DockCrumbsProps,
  type DockLabels,
  type DockProps,
  type DockSearchProps,
} from './Dock';
export {
  Settings,
  SETTINGS_LABELS,
  type SettingsLabels,
  type SettingsLanguage,
  type SettingsProps,
} from './Settings';
export {
  Filters,
  FILTERS_LABELS,
  type FiltersGroupProps,
  type FiltersLabels,
  type FiltersProps,
} from './Filters';
export { bentoLayout, type BentoItem, type BentoSpan } from './lib/layout';
export { crumbPath, type CrumbEnd } from './lib/crumb';

// Behaviour shared by the components (also at @slurp-ui/react/utils)
export {
  COMPACT_QUERY,
  FOCUSABLE,
  focusFirst,
  focusHit,
  matchesAll,
  matchRanges,
  moveFocus,
  normalizeText,
  useControlled,
  useDismiss,
  useFindInPage,
  useForkRef,
  useMediaQuery,
  useRovingFocus,
  type ControlledOptions,
  type DismissOptions,
  type FindInPage,
  type MoveFocusOptions,
  type RovingFocusOptions,
} from './utils';
