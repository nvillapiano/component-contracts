# component-contracts

A design system monorepo built around **component contracts** as the source of truth. Contracts are platform-agnostic JSON describing a component's tokens, props, variants, behavior, and usage. Implementations (React, SwiftUI, Compose) are derived from and validated against them. An MCP server exposes contracts to AI agents in Cursor or Claude Desktop for parity checks and code generation.

---

## Quick start

```bash
pnpm install
pnpm validate        # contracts pass schema
pnpm tokens:build    # generate token CSS/JSON
pnpm dev:web         # Storybook at http://localhost:6006
```

Use `pnpm kill:web` to stop stale Storybook instances on port 6006.

---

## Repo structure

| Location | Purpose |
|----------|---------|
| `packages/schema` | JSON Schema + TypeScript types for `ComponentContract` |
| `packages/contracts` | Contract files (`.contract.json`) — source of truth |
| `packages/tokens` | Design tokens (W3C DTCG), built by Style Dictionary |
| `packages/mcp-server` | MCP server for Cursor / Claude Desktop |
| `apps/validator` | CI: validates contracts against schema |
| `apps/web` | React component library (Vite + Storybook) |
| `docs/` | [Architecture](./docs/architecture.md), [Decisions](./docs/decisions.md) |

---

## Commands

| Command | Description |
|---------|-------------|
| `pnpm validate` | Validate all contracts against schema |
| `pnpm tokens:build` | Build token CSS + JSON |
| `pnpm dev:web` | Start Storybook (port 6006) |
| `pnpm kill:web` | Kill process on port 6006 |
| `pnpm dev:mcp` | Run MCP server in dev mode |
| `pnpm test` | Run Storybook component tests |
| `pnpm build` | Build all packages |
| `pnpm types:generate` | Regenerate TypeScript types from schema |

---

## Paths and env

Paths are **relative to the repo root**. No absolute paths needed.

- **MCP** (`.cursor/mcp.json`): `packages/mcp-server/src/server.ts`, `CONTRACTS_DIR=packages/contracts/src`. Cursor runs with workspace root as cwd.
- **Override**: set `COMPONENT_CONTRACTS_ROOT` (and optionally `CONTRACTS_DIR`) in `.env` or your environment for custom CI or non-root cwd. See [.env.example](.env.example).

---

## MCP tools (Cursor / Claude Desktop)

Configure MCP with the repo's `.cursor/mcp.json`. In Cursor: Settings → Features → MCP; confirm `component-contracts` has a green dot.

| Tool | Description |
|------|-------------|
| `get_contract` | Fetch a contract by ID |
| `list_contracts` | List/filter contracts |
| `update_contract` | Patch a contract, optional version bump + changelog |
| `diff_contract` | Changelog between versions |
| `find_by_token` | Which components use a token |
| `get_platform_context` | Contract filtered for web / ios / android |

---

## Adding a component

1. Add `packages/contracts/src/{id}.contract.json`
2. Import and export it in `packages/contracts/src/index.ts`
3. Run `pnpm validate`
4. Implement in `apps/web/src/components/{id}/` (use tokens from `@ds/tokens`, CVA for variants)
5. Add Storybook stories that mirror contract variants
6. Run `pnpm test`

---

## Troubleshooting

- **Storybook: spinner, 404 for vite-app.js, or "Failed to resolve import @storybook/react/..."** — Keep all Storybook packages on the same version (e.g. 8.6.18). **`@storybook/react` must be a direct devDependency** of `apps/web` so Vite can resolve the builder's virtual module. Keep `.storybook/main.ts` and `preview.ts` minimal.
- **Contracts or schema not found** — Run `pnpm install` from the repo root. If MCP still fails, check that Cursor is opened at the repo root and that `.cursor/mcp.json` uses the relative paths above.

---

## Docs

- [Architecture](./docs/architecture.md) — structure, contract loop, tokens, MCP
- [Decisions](./docs/decisions.md) — ADRs (contracts as source of truth, pnpm, schema, tokens, CVA, Storybook, MCP, etc.)
