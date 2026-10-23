---
'@slurp-ui/motion': patch
---

A transition whose first frame comes late (a busy device) is no longer cut short: the watchdog that settles transitions in hidden tabs now waits while the timeline still moves.
