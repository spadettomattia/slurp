---
'@slurp-ui/react': patch
---

Fix motion on touch screens and on narrow Docks:

- Button, Chip, Tile, Card and Rating lift, grow or tilt on hover only with a fine pointer (`(hover: hover) and (pointer: fine)`), so they no longer stay raised after a tap. Colour changes on hover are unchanged.
- Button, Tile and Card press in 120ms and release more softly (240ms for Button and Chip, 300ms for Tile and Card) instead of using one slow transition both ways.
- On phones, Dock crumbs before the current one shrink first (to a 44px target), so the current page keeps its name instead of collapsing to a letter.
