---
'@slurp-ui/react': minor
---

Add `useSlurpNavigate` and `useSlurpEnter` for transitions across routes: the first wraps any router's navigate function (no router is imported) and measures the source before navigating, the second plays the transition in the route that mounts and, with `content`, fades the rest of the page in while the droplets land. A stale handoff or missing targets fade; a direct visit or the browser's history only render the route.
