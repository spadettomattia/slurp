# @slurp-ui/icons

The icons of the Slurp design system as React components: inline stroke SVG (2px, round caps) drawn in `currentColor`, tree-shakable.

```bash
npm i @slurp-ui/icons
```

`@slurp-ui/react` re-exports them from `@slurp-ui/react/icons`.

## Use

```tsx
import { SearchIcon } from '@slurp-ui/icons';

<button type="button" aria-label="Cerca">
  <SearchIcon />
</button>;
```

Without `title` an icon is decorative (`aria-hidden`) and the control around it carries the name; with `title` it becomes an image with that name. `size` sets width and height (default 20).

`createIcon(name, shapes)` makes an icon of your own in the same style.

## License

MIT
