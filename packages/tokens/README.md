# @slurp-ui/tokens

The design tokens of the Slurp design system: colours (light and dark, WCAG 2.2 AA), the accent presets (`hue-*`), type, space, radii, depth and the phone breakpoint.

```bash
npm i @slurp-ui/tokens
```

`@slurp-ui/react` already includes them (`@slurp-ui/react/styles.css`, `@slurp-ui/react/tokens`); install this package alone to use the tokens without React.

## CSS

```css
@import '@slurp-ui/tokens/tokens.css';
@import '@slurp-ui/tokens/fonts.css'; /* Poppins, self-hosted */

.card {
  padding: var(--slurp-space-5);
  border-radius: var(--slurp-radius-card);
  background: var(--slurp-surface);
  color: var(--slurp-fg);
}
```

The dark theme follows `prefers-color-scheme`, or `data-theme="light" | "dark"` on any element.

## TypeScript

```ts
import { COMPACT_QUERY, cssVar, hue } from '@slurp-ui/tokens';

cssVar('space-5'); // 'var(--slurp-space-5)'
hue.violet; // '#8b6fff', the default accent preset
matchMedia(COMPACT_QUERY); // phones: (max-width: 640px)
```

## License

MIT
