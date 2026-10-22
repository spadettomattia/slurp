# Slurp UI

React component library of the Slurp design system: ready-made components, per-instance styling, and the optional collapse / expand ("slurp") transition.

```bash
npm i @slurp-ui/react
```

```tsx
import '@slurp-ui/react/styles.css';
import { cssVar, COMPACT_QUERY } from '@slurp-ui/react/tokens';
```

## Packages

| Package            | Contents                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `@slurp-ui/react`  | components, theme, provider, hooks; re-exports `@slurp-ui/react/tokens`, `@slurp-ui/react/motion`, `@slurp-ui/react/icons` |
| `@slurp-ui/tokens` | `tokens.json` → `--slurp-*` CSS custom properties (light/dark) + TS constants                                              |
| `@slurp-ui/motion` | collapse/expand engine (vanilla TS) + React bindings                                                                       |
| `@slurp-ui/icons`  | stroke SVG icons, `currentColor`, tree-shakable                                                                            |

Apps: `apps/docs` (Storybook 9), `apps/playground` (Vite, real-world motion test bed).

## Development

Requires Node ≥ 22.18 and pnpm (`corepack enable`).

```bash
pnpm install
pnpm build       # every package + Storybook
pnpm docs        # Storybook on http://127.0.0.1:6006
pnpm test
pnpm lint && pnpm typecheck
pnpm check:pkg   # publint + attw
pnpm size        # size budget
pnpm changeset   # describe a change to a published package
```

## License

MIT
