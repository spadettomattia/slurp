# Changesets

Every change to a published package (`@slurp-ui/react`, `@slurp-ui/motion`, `@slurp-ui/tokens`, `@slurp-ui/icons`) comes with a changeset:

```bash
pnpm changeset
```

Prereleases go on the `next` channel: `pnpm changeset pre enter next`, then `pnpm changeset pre exit` before the stable release.
