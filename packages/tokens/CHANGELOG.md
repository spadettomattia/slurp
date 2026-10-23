# @slurp-ui/tokens

## 1.0.1

### Patch Changes

- 9aec3d3: The package now includes its CHANGELOG.md.

## 1.0.0

### Major Changes

- da26ea0: First stable release: the Slurp design system's tokens, icons, collapse / expand engine and React components, with a documentation page per component (props, accessibility, classes, variables and states). From here on the public API follows semver.

### Minor Changes

- 56e94d4: First release of the Slurp design tokens: `--slurp-*` custom properties for the light and dark themes (`tokens.css`, inside `@layer slurp.base`), Poppins `@font-face` rules (`fonts.css`) and typed TS constants (`color`, `hue`, `space`, `radius`, `font`, `vars`, `cssVar()`, `COMPACT_QUERY`). `@slurp-ui/react` re-exports them from `@slurp-ui/react/tokens`, `@slurp-ui/react/tokens.css` and `@slurp-ui/react/styles.css`.

### Patch Changes

- 228b034: Wrap every selector of `tokens.css` in `:where()` (zero specificity), so theme overrides win whatever the stylesheet order.
