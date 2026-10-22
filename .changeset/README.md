# Changesets

Every change to a published package (`@slurp/ui`, `@slurp/motion`, `@slurp/tokens`, `@slurp/icons`) comes with a changeset:

```bash
pnpm changeset
```

Prereleases go on the `next` channel: `pnpm changeset pre enter next`, then `pnpm changeset pre exit` before the stable release.
