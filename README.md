# component-contracts

A design system component contract repository. Contracts are platform-agnostic JSON documents describing a component's tokens, props, variants, behavior, and usage rules. An MCP server exposes them to AI agents in Cursor or Claude Desktop.

## Structure

```
packages/
  schema/        # JSON Schema + TypeScript types
  contracts/     # The contract files (.contract.json)
  mcp-server/    # MCP server that exposes contracts to agents
apps/
  validator/     # CI validator — checks contracts against schema
```

## Setup

```bash
pnpm install
```

## Running the MCP server (dev)

```bash
pnpm dev:mcp
```

## Validating contracts

```bash
pnpm validate
```

## Cursor integration

Create `.cursor/mcp.json` at the repo root:

```json
{
  "mcpServers": {
    "component-contracts": {
      "command": "npx",
      "args": ["tsx", "/Users/nico/sites/component-contracts/packages/mcp-server/src/server.ts"],
      "env": {
        "CONTRACTS_DIR": "/Users/nico/sites/component-contracts/packages/contracts/src"
      }
    }
  }
}
```

Then open Cursor Settings → Features → MCP and verify the server shows a green dot.

## Available MCP tools

| Tool | Description |
|------|-------------|
| `get_contract` | Fetch a full contract by component ID |
| `list_contracts` | List all contracts, filter by status / platform / token |
| `update_contract` | Patch a contract and write to disk |
| `diff_contract` | Show changelog between versions |
| `find_by_token` | Blast-radius analysis — find all components using a token |
| `get_platform_context` | Contract filtered for a specific platform (web/ios/android) |

## Adding a new contract

1. Copy an existing contract in `packages/contracts/src/`
2. Rename to `{component-id}.contract.json`
3. Update fields to match your component
4. Add the import to `packages/contracts/src/index.ts`
5. Run `pnpm validate` to confirm it's schema-valid
