---
'@slurp-ui/react': patch
---

Finish the motion of panels and notifications:

- Dialog and Sheet now play their way out (200ms: back toward the control that opened them, a sheet back down) before closing; reopening during the exit keeps them open. Dialog grows from its opener with a uniform scale, so its text no longer stretches. Reduced motion: a 150ms fade in and out.
- Toast leaves with a short exit and the stack closes the gap instead of jumping; its entrance is now a transition, so a toast dismissed while it appears turns back from where it is.
- Hint: after one hint closes, the next one within 300ms shows at once and without its entrance, so moving along a row of icons only waits once.
- Reduced motion keeps colour, opacity and shadow transitions in every component and drops only movement and size changes.
