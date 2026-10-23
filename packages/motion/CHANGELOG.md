# @slurp-ui/motion

## 1.0.0

### Major Changes

- da26ea0: First stable release: the Slurp design system's tokens, icons, collapse / expand engine and React components, with a documentation page per component (props, accessibility, classes, variables and states). From here on the public API follows semver.

### Minor Changes

- 201df15: Add the collapse / expand engine: `slurp()`, `collapse()`, `expand()` and `morph()` animate measured nodes as droplets on a fixed overlay (Web Animations on transform, opacity and border-radius; curved paths, nearer items first and the lead last, liquid bridges through the goo filter, the target swelling). Interruptions reverse, cancel or queue; reduced motion becomes a 150ms fade. Also adds the shared `registry` (ids, groups, `whenMounted`, handoff), `measure()` and a `spring()` solver that returns a CSS `linear()` easing.
- 878fd91: `Handoff.to` is optional: the route that receives the handoff can name the target.

### Patch Changes

- 8b092aa: A transition whose first frame comes late (a busy device) is no longer cut short: the watchdog that settles transitions in hidden tabs now waits while the timeline still moves.
