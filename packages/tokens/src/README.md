Slurp is a content-agnostic design system for interfaces that guide people through a set of choices: an entry grid of tiles, lists of cards, detail pages, and one floating Dock that carries all navigation. Its signature is the **collapse / expand** transition: n elements collapse into one, like cells fusing, to go forward — and one bursts back into n to go back. Light and dark themes, both WCAG 2.2 AA.

## Principles

- **Colour comes from content.** The interface has no fixed brand hue: any source colour becomes the accent through `vivid()` (OKLCH chroma ×1.6 within 0.17–0.26, lightness 0.64–0.74) and is applied with `AccentScope`. The `hue-*` tokens are ready-made presets; `hue-violet` is the default.
- **Accessible by construction.** Every text pair is ≥ 4.5:1 and every control boundary, focus ring and meaningful mark ≥ 3:1, in both themes, for every `hue-*` and on the accent-tinted ground. States are never shown by colour alone.
- **One place to navigate.** The `Dock` at the bottom carries the path as a breadcrumb — back button first, then each level — plus search and filters. Every crumb triggers the transition. Scrolling only scrolls: it never drives transitions or navigation.
- **Floating and fluid.** Content sits on translucent `Surface`s; every corner is rounded; decorative shapes are slow drifting blobs (radial gradients moved only with `transform`, never blurred or reshaped per frame, so they cost no repaint); motion is spring-like and organic.

## Themes

- Two themes, `light` and `dark`. Default: follow `prefers-color-scheme`. People choose in the `SettingsMenu` (top right; Tema: Automatico / Chiaro / Scuro); `setTheme()` writes `data-theme` on the root, which always wins over the system setting, and remembers the choice.
- Grounds: `bg` (tinted 7% by the accent at runtime), `surface` (translucent panels), `surface-dock` (near-opaque Dock), `surface-2` (opaque base for tints).
- Text: `fg` primary, `muted` secondary. `line` is a decorative hairline only; interactive boundaries use `border-control`.
- Accent: `accent` fills always carry `on-accent` content; `accent-ink` is the accent as text, marks and focus ring; `accent-soft` is the 16% tint. Status: `success`, `warning`, `danger` as text/icon colours, always with an icon or a word.

## Accessibility rules

- Text ≥ 4.5:1 (≥ 3:1 at 24px+ or 19px bold); boundaries of controls, focus indicators and meaningful graphics ≥ 3:1 (WCAG 1.4.3, 1.4.11). Verified in both themes for every `hue-*`, on `bg`, the tinted ground, `surface`, `surface-dock`, `surface-2`, tile tints and `accent-soft`.
- Focus: 2px solid `focus`, 2px offset, on every control; never removed.
- Targets ≥ 44×44px (Dock 48–60px). Body text 16px with line-height 1.6; paragraphs never below 16px; captions (13px) only for short meta.
- Selected states combine fill + icon (Chip check, Swatch ring, highlighted ListRow with tag and outline).
- Motion: everything has a reduced-motion path; collapse and expand become a short fade.
- Floating panels (the Dock's menu, filters, search, results, and any future popover) close on a click outside, Escape or Tab out; Escape returns focus to the opener; opening a panel moves focus into it; result lists are navigable with the arrow keys. These rules have **one implementation**: `useDismiss()` (closing and focus return), `focusFirst()` (focus into an opened panel), `moveFocus()` (arrow keys in a list), `COMPACT_QUERY` (the phone layout). Build new panels on them instead of re-implementing the rules.
- Icons are `aria-hidden` when decorative; icon-only buttons have names; counts are part of the accessible name.

## Composition

- **Fewer boxes.** Prefer separate soft pieces over containers: a Card is one tinted surface with the media and the title/description pills inside (no frame around separate boxes); a detail page is a large `MediaStage`, a big title, a row of `Fact` pills, plain text sections and `ListRow`s — no panel around each section.
- **Phones.** The Dock keeps every piece readable: actions (search, filters) at the right end, earlier crumbs as icons so the current one shows its full name, gaps between crumbs never squeezed.
- **One boundary per control group.** The Dock bar has the only edge; crumbs, search field and filter button are soft pieces inside it. Outlines are for standalone controls (chips, secondary buttons) that need a 3:1 boundary.
- **Media stages** use simple round geometry: one glow, one thin ring, large radius; placeholder shapes are rounded (circle, capsule, soft square), never polygons.

## Search

- **One field, scoped by context.** The Dock search is the only search input; its placeholder says where it looks: "Cerca prodotti, marche, caratteristiche…" (the entry grid, whole system), "Cerca nel catalogo…" (everything), "Cerca in <section>…" (a section), "Cerca in <item>…" (a detail page).
- **On the entry grid** the Dock is only the search field (`searchOnly`): typing searches everything and shows the results in the Dock panel — matching sections, up to five `ResultRow`s, then "Vedi tutti i N risultati".
- **On phones** search is a round action at the right end of the Dock that opens the field in the panel above, like the filters.
- **In a section** it filters the items of that section as you type: every word of the query, in any order, across name, brand, description, facts and colour names ("apple a19", "moonstone"). The count above the grid updates; with no result, one "Azzera filtri" action.
- **On a detail page** it is find-in-page: every match is marked with `Highlight` (`accent-soft` tint + `accent` underline), the active one is filled `accent` / `on-accent` and scrolled to the middle of the viewport. Enter / Shift+Enter or a tap on the "2/5" counter move between matches; "Nessun risultato" when nothing matches.
- Matching ignores case and accents ("piu" finds "più") — `matchesAll()` for lists, `matchRanges()` for highlighting.

## Languages

- **Italian is the source language**; other languages are translations of the interface copy. Copy lives in one file per language (`locale.it.ts`, `locale.en.ts`, …); the others are typed with the shape of the Italian one, so a missing or extra key fails the build. ICU messages: `{name}` for values, `{count, plural, one {…} other {…}}` for plurals, `<tag>…</tag>` for styled parts (e.g. the accent word of a title).
- The language is chosen in the `SettingsMenu` (Lingua) and remembered; the first visit follows the browser's language, else Italian. URLs do not change.
- Language names are written in themselves ("Italiano", "English") with `lang`; `<html lang>` always matches the current language.
- Numbers and prices are formatted for the language (`1.239 €` in Italian, `€1,239` in English). Category names and taglines are interface copy and are translated; item content (descriptions, reviews) may stay in the source language — say so with a short note in the settings.

## Content

- Italian (source), sentence case, direct second person ("Di cosa hai bisogno?", "Cerca in Smartphone…", "Nessun risultato", "Azzera filtri").
- Numbers: `it-IT` formatting; one decimal for scores ("9.1"); counts "1 elemento" / "2 elementi".
- Labels are short; one primary action per view; no emoji, no exclamation marks.

## Type

- **Poppins** 400–700 for everything; display styles 600–700 with negative tracking.
- Display: `display-xl` 52, `display-l` 48, `title-xl` 40, `figure` 40, `tile-label` 28, `title-l` 24, `title-s` 20.
- Text: `body-l` 18/1.6, `body` 16/1.6, `body-s` 15/1.5, `label` 15, `caption` 13/1.5, `eyebrow` 12 UPPERCASE.
- Phones: `display-xl` 34, `display-l` 36, `title-xl` 32, `tile-label` 22.

## Space, radius, depth

- Spacing `space-1`–`space-10`; `space-48` bottom padding wherever the Dock shows.
- Radii grow with the container: `radius-sm` 16 → `md` 22 → `lg` 26 → `dock` 32 → `card` 34 → `tile` 36 → `panel` 40; controls `radius-full`.
- One shadow, `shadow-float`. Ambient blobs at `blob-opacity-light` / `blob-opacity-dark`.

## Motion

- **Collapse / expand** (signature): `collapse({ items, target, lead })` — n elements collapse into one (about 650ms) to go forward: nearer items first, the chosen one last, curved ease-in paths, droplets fusing through liquid bridges (`blur-goo` + alpha threshold) while the target swells; then navigate. `expand({ items, source })` plays it backwards to go back: the crumb you leave bursts into the items of the level you return to. Started by an action (a tile, a card, a crumb), never by scroll.
- Elsewhere: springs (stiffness 140–260, damping 18–24) or `cubic-bezier(0.2, 0.8, 0.2, 1)` 0.35–0.9s; the Dock grows its panels by animating height.
- **A button that opens a panel becomes the panel**: the `SettingsMenu` icon button grows into its menu (width, height, radius on one surface) and shrinks back into the button — no separate popover appearing beside it.

## Layout

- Max width 1280px, gutter 16–24px.
- Entry grid: `.sp-bento` (12 columns; spans from `bentoLayout()` by priority and weight; fluid rows); 2 columns on phones. Tiles and cards scale with the window (container units).
- Lists: `repeat(auto-fill, minmax(220px, 1fr))` of portrait cards. Detail: hero (MediaStage + info), facts, then panels side by side, wrapping below 900px.

## Iconography and media

- Inline stroke SVG, 2px stroke, round caps/joins, `currentColor`. No icon font, no emoji.
- Media sits on a `MediaStage` tinted by its colour; photos replace placeholders on the same stage.
