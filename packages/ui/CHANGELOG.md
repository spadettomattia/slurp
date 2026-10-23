# @slurp-ui/react

## 1.0.0

### Major Changes

- da26ea0: First stable release: the Slurp design system's tokens, icons, collapse / expand engine and React components, with a documentation page per component (props, accessibility, classes, variables and states). From here on the public API follows semver.

### Minor Changes

- 56e94d4: First release of the Slurp design tokens: `--slurp-*` custom properties for the light and dark themes (`tokens.css`, inside `@layer slurp.base`), Poppins `@font-face` rules (`fonts.css`) and typed TS constants (`color`, `hue`, `space`, `radius`, `font`, `vars`, `cssVar()`, `COMPACT_QUERY`). `@slurp-ui/react` re-exports them from `@slurp-ui/react/tokens`, `@slurp-ui/react/tokens.css` and `@slurp-ui/react/styles.css`.
- 3b1c343: Add `AccentScope`: scopes `accent`, `on-accent`, `accent-soft`, `accent-ink` and `focus` to a `hue-*` preset or any colour (through `vivid()`), with a 0.9s cross-fade.
- 5e42219: Add `Avatar`: round photo with initials as fallback.
- cec612b: Add `Bento` (12 fluid columns, two below 860px) and `bentoLayout()`: with `layout="auto"` the children's `weight` shapes the spans, the first section tall on the left.
- 5e42219: Add `Bloom`: the button becomes the panel. One surface grows from the trigger (width, height, radius) and shrinks back, flipping when there is no room; built on `useDismiss` and `focusFirst`.
- 5e42219: Add `Bubble`, the round icon-only button with a required `label`.
- 5e42219: Add `Button`: `fill`, `soft`, `outline` or `plain` appearance, `accent` or `neutral` tone, sizes `sm`/`md`/`lg` (44px minimum), icons and `href`.
- cec612b: Add `Card` (one tinted surface, title and description pills inside, link or button) and `Shelf`, the auto-fill list of cards.
- 3b1c343: Add `Cell`, the base primitive: any element (`as`) styled with `css`.
- 5e42219: Add `Checkbox` on a native input, with the indeterminate state.
- 5e42219: Add `Chip`, a toggle with `aria-pressed`: selected is an accent fill plus a check.
- 5e42219: Add `Choice`, the select whose trigger becomes the list (Bloom), with full keyboard support and a hidden form input.
- 551769e: Add the colour utilities of the design system: `vivid()`, `contrast()`, `meetsContrast()`, `onColor()`, `alpha()`.
- 5e42219: Add `Count`, a badge whose `label` joins the accessible name of the control around it.
- 3b1c343: Add the `css` prop runtime: design tokens (`p: 4`, `bg: 'accent-soft'`, `radius: 'card'`, `font: 'title-l'`), nested selectors and `{ base, compact, wide }` breakpoints, compiled to hashed atomic classes in `@layer slurp.utilities` and hoisted with React 19 `<style>` (SSR included).
- 5e42219: Add `Dialog` (native modal `<dialog>`, grows out of the control that opened it) and `Sheet` (from the bottom edge).
- cec612b: Add `Dock`, the single navigation: `Dock.Crumbs` with `Dock.Back` and `Dock.Crumb` drawn as interlocking SVG pieces (`crumbPath()`), `Dock.Search` with the find-in-page counter, `Dock.Actions` / `Dock.Action`, and panels that grow above the bar. On phones earlier crumbs become icons and search becomes an action.
- cec612b: Add `Empty`: a message and a single way out, announced politely.
- cec612b: Add `Fact` (label and value as one pill) and `Score` (one decimal in an accent-ink ring, fully named for assistive tech).
- 5e42219: Add `Field`: label, input or textarea with a 3:1 boundary, hint and error wired with aria-describedby.
- cec612b: Add `Filters` and `Filters.Group`: the filter panel with "Azzera filtri", off when nothing is active.
- 3b1c343: Add `Flow`: column or row with a gap from the space scale; `direction`, `gap`, `align`, `justify` accept breakpoints.
- 5e42219: Add `Fold`, a disclosure that grows in height; closed content is inert.
- 3b1c343: Add `Frame`: centred page column, max 1280px, gutter 24px (16px on phones).
- 3b1c343: Add `Ground`: opt-in page baseline (box-sizing, Poppins body text, `bg` tinted 7% by the accent, 2px focus ring) in `@layer slurp.reset`.
- 5e42219: Add `Hint`, a tooltip in the top layer: hover (with delay) and focus, Escape, stays while hovered.
- cec612b: Add `List` and `ListRow`: mark, title with a highlight tag (with a check), meta, value and one action link named after its row; `Link` for text links.
- cec612b: Add `Mark` and `useFindInPage()` for find in page (case- and accent-insensitive, the active match filled and scrolled to the middle), with `matchesAll`, `matchRanges` and `focusHit`.
- 5e42219: Add `Menu` and `MenuItem` on Bloom: looping arrow keys, items close the menu and give focus back.
- f8991cf: Add opt-in motion: every component accepts `animationId`, `animationGroup`, `animationLead`, `animationDisabled` and `animationGhost` and only registers its root (nothing is allocated without them). `useSlurp()` starts collapse / expand transitions with the theme defaults (`createTheme({ motion })` now covers duration, stagger, curve, swell, drop, goo, ghost, order, reduced motion and interruptions), `<AnimationGroup>` groups descendants, `useAnimationTarget()` registers custom elements. The engine is re-exported from `@slurp-ui/react/motion`.
- 4b675d4: Add `useSlurpNavigate` and `useSlurpEnter` for transitions across routes: the first wraps any router's navigate function (no router is imported) and measures the source before navigating, the second plays the transition in the route that mounts and, with `content`, fades the rest of the page in while the droplets land. A stale handoff or missing targets fade; a direct visit or the browser's history only render the route.
- 5e42219: Add `Notice`: icon plus word for each tone, optional close button.
- 5e42219: Add `Placeholder`, rounded loading shapes (circle, capsule, soft square).
- 5e42219: Add `VisuallyHidden` and `Portal`.
- 5e42219: Add `Progress` as a bar or a ring, with value or indeterminate.
- 5e42219: Add `Radio` and `RadioGroup` (fieldset and legend, native arrow keys).
- 5e42219: Add `Range`, a slider on a native range input with a 44px target and a formatted value text.
- cec612b: Add `ResultRow`, a search result whose rows move with the arrow keys.
- 5e42219: Add `Search`: contextual placeholder, result count in a polite live region, clear button, Enter to search.
- 5e42219: Add `Segmented`, a single choice among a few: one tab stop, arrow keys move and select, the selected segment is filled and checked.
- cec612b: Add `Settings`: the round button that grows into its panel, with Tema always and Lingua when configured; `RadioGroup` gains `appearance="rows"` and `Radio` an `icon`.
- cec612b: Add `Stage`, the media stage with one breathing glow and one ring.
- 3b1c343: Add `Surface`: floating surface with `level` (`surface`, `dock`, `solid`) and `radius`.
- 5e42219: Add `Swatch` and `SwatchGroup`: colour choices with a ring for the selected one, arrow keys in the group.
- 5e42219: Add `Switch` (`role="switch"`): on shows the thumb at the end with a check.
- 5e42219: Add `Tabs`: the pill indicator moves on a spring (CSS `linear()` easing), arrow keys move and select.
- 3b1c343: Add `Text`: the 13 type styles of the design system (`font`), element chosen from the style, `tone` and `muted`.
- 3b1c343: Add `createTheme()`, `SlurpProvider`, `useTheme()`, `useColorScheme()` and `ColorSchemeScript`: accent, token overrides, per-component defaults and `css`, light / dark / system colour scheme remembered in localStorage. Nested providers theme only their subtree.
- cec612b: Add `Tile`, the entry grid cell tinted by its colour, with a drifting blob and container-scaled text and media; a collapse saturates toward its colour.
- 5e42219: Add `ToastProvider` and `useToast()`: toasts in a polite live region above the Dock, paused while hovered or focused.
- 5e42219: Add the shared behaviour of the components, also at `@slurp-ui/react/utils`: `useDismiss` (press outside, Escape, Tab out, focus back), `focusFirst`, `moveFocus`, `useRovingFocus`, `useControlled`, `useForkRef`, `useMediaQuery` with `COMPACT_QUERY`.

### Patch Changes

- Updated dependencies [5cac9b1]
- Updated dependencies [201df15]
- Updated dependencies [878fd91]
- Updated dependencies [8b092aa]
- Updated dependencies [da26ea0]
- Updated dependencies [56e94d4]
- Updated dependencies [228b034]
  - @slurp-ui/icons@1.0.0
  - @slurp-ui/motion@1.0.0
  - @slurp-ui/tokens@1.0.0
