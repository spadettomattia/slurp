# @slurp-ui/react

Ready-made React components of the Slurp design system: an entry grid of tiles, lists of cards, detail pages and one floating Dock that carries all navigation, with the optional collapse / expand ("slurp") transition between them. Light and dark themes, WCAG 2.2 AA.

```bash
npm i @slurp-ui/react
```

React 19 or later. ESM only.

## Use

```tsx
import '@slurp-ui/react/styles.css';
import { Button, createTheme, Ground, SlurpProvider } from '@slurp-ui/react';

const theme = createTheme({ accent: 'hue-violet' });

export function App() {
  return (
    <SlurpProvider theme={theme}>
      <Ground />
      <Button>Aggiungi al carrello</Button>
    </SlurpProvider>
  );
}
```

`styles.css` holds the tokens (`--slurp-*`), the fonts and every component's CSS inside `@layer slurp.*`: your own CSS wins without `!important`.

## Customise

1. **Theme**: `createTheme({ accent, tokens, components, motion })` for the accent, token overrides, per-component defaults and the motion defaults.
2. **`css` prop**: tokens (`p: 4`, `bg: 'accent-soft'`, `radius: 'card'`), selectors (`'&:hover'`) and breakpoints (`{ base, compact }`) on any component.
3. **CSS variables and classes**: every component documents its `.slurp-*` classes, `--slurp-*` variables and `data-*` states.

## Motion

Components only register (`animationId`, `animationGroup`); transitions start from `useSlurp()`:

```tsx
const { collapse, expand } = useSlurp();
collapse({ items: { group: 'tiles' }, target: 'crumb', lead: 'tile-audio' });
```

Across routes, `useSlurpNavigate(navigate)` measures before navigating and `useSlurpEnter()` plays the transition in the next route. No router is imported: it works with Next.js, React Router or your own. With `prefers-reduced-motion` every transition becomes a short fade.

## Next.js (App Router)

Component modules carry `'use client'`, so server components can render them; `createTheme` runs on the server. Put the colour scheme script in `<head>` to avoid a flash of the wrong theme:

```tsx
// app/layout.tsx
import '@slurp-ui/react/styles.css';
import { ColorSchemeScript, Ground, SlurpProvider } from '@slurp-ui/react';

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <SlurpProvider>
          <Ground />
          {children}
        </SlurpProvider>
      </body>
    </html>
  );
}
```

## Entry points

| Import                       | Contents                                                            |
| ---------------------------- | ------------------------------------------------------------------- |
| `@slurp-ui/react`            | components, theme, provider, hooks                                  |
| `@slurp-ui/react/styles.css` | tokens, fonts and component styles                                  |
| `@slurp-ui/react/motion`     | the collapse / expand engine (`@slurp-ui/motion`) and hooks         |
| `@slurp-ui/react/tokens`     | token values, `cssVar()`, `COMPACT_QUERY`                           |
| `@slurp-ui/react/icons`      | the icon set (`@slurp-ui/icons`)                                    |
| `@slurp-ui/react/utils`      | shared behaviours: `useDismiss`, `useRovingFocus`, `useFindInPage`… |

## License

MIT
