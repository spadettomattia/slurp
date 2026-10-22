---
'@slurp-ui/react': minor
---

Add opt-in motion: every component accepts `animationId`, `animationGroup`, `animationLead`, `animationDisabled` and `animationGhost` and only registers its root (nothing is allocated without them). `useSlurp()` starts collapse / expand transitions with the theme defaults (`createTheme({ motion })` now covers duration, stagger, curve, swell, drop, goo, ghost, order, reduced motion and interruptions), `<AnimationGroup>` groups descendants, `useAnimationTarget()` registers custom elements. The engine is re-exported from `@slurp-ui/react/motion`.
