---
'@slurp/tokens': patch
---

Wrap every selector of `tokens.css` in `:where()` (zero specificity), so theme overrides win whatever the stylesheet order.
