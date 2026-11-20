---
'@slurp-ui/react': minor
---

New components for content and navigation, for any site:

- `Prose`: typography for long text that arrives as HTML (Markdown, MDX, a CMS), on the design system's scale.
- `Code`: a code block with an optional file name and a copy button that confirms; takes plain text or HTML from any highlighter (`--slurp-code-*` colours, shiki variables mapped).
- `Contents`: "on this page" links that follow the section being read.
- `Rail` (`Rail.Group`, `Rail.Link`): vertical navigation in groups for wide screens, the current page highlighted.
- `PageNav`: previous and next page at the end of a sequence, with your router's link.
- `SkipLink`: "skip to content", visible on keyboard focus.
- `Hairline`: a 1px separator, decorative by default.
- Hooks `useClipboard` and `useScrollSpy`. English texts for the new components in `labelsEn`.
