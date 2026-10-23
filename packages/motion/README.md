# @slurp-ui/motion

The collapse / expand ("slurp") transition of the Slurp design system, in plain TypeScript: n elements collapse into one to go forward, one bursts back into n to go back. No framework, no dependencies.

```bash
npm i @slurp-ui/motion
```

With React, use it through `@slurp-ui/react/motion` (`useSlurp`, `useSlurpNavigate`, `useSlurpEnter`).

## Use

```ts
import { collapse, expand, registry } from '@slurp-ui/motion';

// Register elements under an id, optionally in a group.
for (const el of document.querySelectorAll<HTMLElement>('.tile')) {
  registry.register(el.id, el, { group: 'tiles' });
}

const run = collapse({ items: { group: 'tiles' }, target: 'crumb', lead: 'tile-audio' });
await run.finished; // 'finished' | 'reversed' | 'cancelled'

expand({ source: 'crumb', items: { group: 'tiles' } });
```

`slurp({ from, to })` picks the shape by itself (n → 1, 1 → n, 1 → 1). Every transition can be `reverse()`d, `cancel()`led or `finish()`ed; a transition started on elements still moving reverses, cancels or queues (`interrupt`).

## How it works

Elements are measured into nodes (rect, radius, fill), a fixed overlay of droplets travels on Bézier paths with Web Animations, an SVG goo filter joins them, and everything is cleaned up at the end. Nodes measured before an element unmounts stay animatable, which is how transitions cross routes (`registry.handoff`).

- `prefers-reduced-motion`: a 150 ms fade.
- Up to 40 droplets; the goo filter turns itself off above 24 or on low-end devices.
- A hidden tab never leaves elements hidden: a watchdog settles the transition.

## License

MIT
