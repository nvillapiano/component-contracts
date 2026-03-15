# Changesets

This directory is managed by [Changesets](https://github.com/changesets/changesets).

## Adding a changeset

When you make a change to a package that should be versioned:

```bash
pnpm changeset
```

Follow the prompts to select which packages changed and describe the change.
Changesets live here as markdown files until you're ready to version and release:

```bash
pnpm changeset version  # bumps versions, updates changelogs
pnpm changeset publish  # publishes to registry (future)
```

## What gets versioned

- `@ds/schema` — when the contract shape changes
- `@ds/contracts` — when contracts are added, updated, or deprecated
- `@ds/tokens` — when token values or names change
- `@ds/web` — when component implementations change

`@ds/mcp-server` and `@ds/validator` are internal tools and are excluded from versioning.
