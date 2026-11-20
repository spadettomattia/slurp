---
'@slurp-ui/react': minor
---

- `ListRow` with `href` and no `actionLabel` is a link as a whole: its title becomes the link and covers the row (one target, one focus stop, no extra "Open" button). A router link goes in `parts={{ link: … }}`.
- `Code`: the scrollable block is a named group instead of a region, so a page with many code blocks keeps unique landmarks.
- Dock: the phone search pill's accessible name includes its visible placeholder (WCAG 2.5.3).
