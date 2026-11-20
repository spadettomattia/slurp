---
'@slurp-ui/react': patch
---

Take every transition curve and duration from the new motion tokens (`--slurp-ease-settle`, `--slurp-duration-*`), in the stylesheets and in Dialog and Bloom. Timings are unchanged except where they snap to the scale (for example 0.3s → 350ms, 0.4s and 0.5s → 450ms, 0.7s → 600ms).
