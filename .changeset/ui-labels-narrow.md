---
'@slurp-ui/react': minor
---

Texts in other languages and components that hold up in narrow spaces:

- `SlurpProvider` takes `labels`: `'en'` switches every component's texts to English, `'it'` keeps the Italian defaults, or pass your own texts by component (`{ Dialog: { close: 'Dismiss' } }`). The string presets can be passed from a server component. A component's own `labels` prop still wins. `labelsEn` and `labelsIt` are exported to build on.
- Dock: on phones, a bar with only the search shows it as a pill with its placeholder instead of a lone round icon (`Dock.Action` takes `text`).
- Steps: below 480px of its own width (not only on phones) the other steps keep only their marker, so labels never collide in a narrow card.
- Tile: long titles break with a hyphen where the page language allows it, instead of anywhere.
