# Architecture

## Overview

`component-contracts` is a design system monorepo built around a central idea: **component contracts as the source of truth**. A contract is a platform-agnostic JSON document describing a component's tokens, props, variants, behavior, accessibility requirements, and usage rules. Everything else — React implementations, SwiftUI, Compose, documentation, Figma — is derived from or validated against those contracts.

This inverts the typical design system workflow. Instead of implementations drifting apart over time and docs becoming stale, the contract is the thing you change first. Agents and tooling maintain parity across layers.

---

## Monorepo Structure

```
component-contracts/
├── packages/
│   ├── schema/          # JSON Schema + TypeScript types for ComponentContract
│   ├── contracts/       # The contract files (.contract.json) — the source of truth
│   ├── tokens/          # Design token values in W3C DTCG format, transformed by Style Dictionary
│   └── mcp-server/      # MCP server exposing contracts to AI agents (Cursor, Claude Desktop)
├── apps/
│   ├── validator/       # CI script — validates all contracts against schema
│   ├── web/             # React component library (Vite + Storybook)
│   ├── ios/             # SwiftUI component library (future)
│   └── android/         # Jetpack Compose component library (future)
├── docs/
│   ├── architecture.md  # This file
│   └── decisions.md     # Architecture Decision Records
```

---

## Package Responsibilities

### `@ds/schema`
Owns the `ComponentContract` JSON Schema and the TypeScript types derived from it. Everything else that deals with contract data imports types from here. Running `pnpm types:generate` regenerates the TypeScript types from the schema using `json-schema-to-typescript`.

### `@ds/contracts`
The contract registry. Contains one `.contract.json` per component, validated against `@ds/schema`. This package has no logic — it's pure data. It's what agents read, what the doc site consumes, and what CI validates.

### `@ds/tokens`
Design token values in W3C DTCG format. Style Dictionary transforms these into platform-specific outputs:
- CSS custom properties → consumed by `apps/web`
- Swift constants → consumed by `apps/ios` (future)
- Kotlin constants → consumed by `apps/android` (future)
- JSON → consumed by anything else

Token paths referenced in contracts (e.g. `brand.500`, `space.md`) must exist in this package.

### `@ds/mcp-server`
An MCP (Model Context Protocol) server that exposes the contract registry to AI agents. Provides tools for querying contracts, finding token usage, diffing versions, and writing patches back to disk. Runs as a local stdio process in Cursor or Claude Desktop.

### `apps/validator`
A CI script that validates every `.contract.json` against the JSON Schema using AJV. Exits non-zero on failure. Runs in CI on every PR that touches `packages/contracts/`.

### `apps/web`
The React component library. Each component:
- Imports token CSS custom properties from `@ds/tokens`
- Uses `class-variance-authority` to map contract variants/props to classes
- Has Storybook stories that mirror contract variants 1:1
- Is tested via `@storybook/test` (interactions) and `@storybook/addon-a11y` (accessibility)

---

## The Contract Loop

```
1. Author/update contract in packages/contracts/
        ↓
2. CI validates contract against schema (apps/validator)
        ↓
3. MCP agent reads contract diff via mcp-server
        ↓
4. Agent generates/updates platform implementations
        ↓
5. Storybook stories (derived from contract variants) run as tests
        ↓
6. Chromatic catches visual regressions on PR (future)
```

---

## Token Architecture

Tokens follow the W3C Design Token Community Group (DTCG) format. They are organized into two tiers:

- **Primitive tokens** — raw values (`color.blue.500: #3B82F6`, `space.4: 16px`)
- **Semantic tokens** — role-based aliases that reference primitives (`brand.500: {color.blue.500}`, `space.md: {space.4}`)

Contracts reference semantic tokens only. This means a brand color change touches one token, and every component that references it updates automatically.

---

## AI Agent Integration

The MCP server exposes six tools:

| Tool | Purpose |
|------|---------|
| `get_contract` | Fetch a full contract |
| `list_contracts` | List/filter contracts |
| `update_contract` | Patch a contract, bump version, append changelog |
| `diff_contract` | Show what changed between versions |
| `find_by_token` | Blast-radius analysis — which components use a token |
| `get_platform_context` | Contract filtered for a specific platform |

The intended agentic workflow: when a contract changes, an agent calls `get_platform_context` for each target platform, reads the current implementation, diffs them, and either proposes or applies updates to bring them into parity.

---

## Future Directions

- **Figma sync** — contracts → Figma variables and component properties via the Figma API. Two-way sync when Figma's AI canvas writing matures.
- **Visual regression** — Chromatic in CI as a gate on implementation PRs.
- **Native implementations** — `apps/ios` (SwiftUI) and `apps/android` (Compose), using `get_platform_context` to drive generation.
- **Doc site** — contract data piped into a Storybook-based or custom doc site so documentation is always contract-derived, never manually written.
- **Published packages** — when the system is stable, `@ds/tokens` and `@ds/contracts` get published to a private registry so consuming apps can depend on them directly.
