# Getting started: local Figma builders

Generate Figma variable collections and component sets from this repo's tokens and contracts, using the local builders.

> **Last verified:** 2026-11-19, from a fresh clone of `main`. The local steps (install, build, config, validation, error paths) were run. The Figma steps were **not** run against a live file, because the verification had no Figma token. See [Known issues](#known-issues).

For the Figma Community skills (which run inside Figma Agent, not from the command line), see [skills/](./skills/).

## Prerequisites

- Node.js 20+ and pnpm 9+
- A Figma personal access token with edit access to the target file
- The target file key: the part of the file URL after `/design/`

## Setup

### 1. Install and build the Figma packages

```bash
pnpm install
pnpm --filter "@ds/figma-tokens..." --filter "@ds/figma-component..." build
```

The `...` suffix builds each package together with its workspace dependencies, which is required from a clean checkout.

> Don't use `pnpm build` at the root yet. It fails in `apps/web-components` (see [Known issues](#known-issues)).

### 2. Configure access

```bash
cp .component-contracts.example .component-contracts
```

Edit `.component-contracts` with your values:

```
FIGMA_ACCESS_TOKEN=figd_your_token_here
FIGMA_FILE_KEY=your_file_key_here
TOKENS_DIR=packages/tokens/src
CONTRACTS_DIR=packages/contracts/src
```

`.component-contracts` is gitignored. Never commit it.

## Usage

### Validate a contract (no Figma calls)

```bash
pnpm run build:figma-component --component=button --validate-only
```

This loads the contract, runs its checks, derives its component tokens, and stops before any Figma call. It currently prints "All components generated successfully!" even though nothing was generated (see [Known issues](#known-issues)).

### Build token collections

```bash
pnpm run build:figma-tokens
```

Progress output shows each phase as it runs.

### Build components

```bash
pnpm run build:figma-component --component=button
pnpm run build:figma-component --component=accordion

# Or both at once
pnpm run build:figma-component --component=button --component=accordion
```

Build tokens before components. Components bind to the Semantic collection, so it must exist.

### Calling the builders from your own script (not yet supported)

The packages export `FigmaTokenBuilder` and `FigmaComponentBuilder`, but `@ds/figma-tokens` and `@ds/figma-component` are not declared as root dependencies. A script in `scripts/` that imports them by package name does not resolve. Until that is fixed, import the compiled output by relative path, as the CLI runners do:

```typescript
import { FigmaTokenBuilder } from '../packages/figma-tokens/dist/index.js';
import { FigmaComponentBuilder } from '../packages/figma-component/dist/index.js';

const tokens = await new FigmaTokenBuilder({ configPath: '.component-contracts' }).buildTokens();
console.log(tokens);

const component = await new FigmaComponentBuilder({ configPath: '.component-contracts' })
  .buildComponent('button');
console.log(`button: ${component.status}`);
```

Run it with `pnpm exec tsx scripts/<your-file>.ts`.

## Debugging

```bash
# Confirm the token directory exists and has files
ls "$(grep TOKENS_DIR .component-contracts | cut -d= -f2)"

# Pause between phases for approval
pnpm run build:figma-tokens --debug
pnpm run build:figma-component --component=button --debug

# Print stack traces on errors
pnpm run build:figma-tokens --dev
```

## Troubleshooting

**"Configuration file not found"**
Create it: `cp .component-contracts.example .component-contracts`

**"FIGMA_ACCESS_TOKEN not found"**
Check that the line exists and is filled in: `grep FIGMA_ACCESS_TOKEN .component-contracts`

**"Module not found: @ds/figma-tokens" (or "Cannot find module '@ds/schema'")**
Build the packages with their dependencies, as in [Setup step 1](#1-install-and-build-the-figma-packages).

**"Phase 1 failed: Figma API error 404: Not Found"**
Usually the file key is wrong, or the token has no access to that file. Check `FIGMA_FILE_KEY` first. The error does not say this yet (see [Known issues](#known-issues)).

**"Failed to parse contract"**
Check the contract is valid JSON: `head -20 packages/contracts/src/button.contract.json`

## What gets created

These are the intended results. They were **not** checked against a live Figma file in this verification.

- **Primitives** and **Semantic** variable collections, bound to the token files.
- For each contract: component sets with variants for each size and state combination, variable bindings to Semantic tokens, component properties from the contract, and a "Generation Notes" frame.

## Next steps

1. Open the Figma file and review the generated components.
2. Compare against Storybook, if you use it: `pnpm run export-figma-references` (not yet verified).

## Architecture

1. **Libraries** (`packages/figma-tokens/`, `packages/figma-component/`): builder logic. They call the Figma REST API directly through `FigmaClient` (`figma-api.ts`).
2. **CLI runners** (`scripts/build-figma-*.ts`): command-line entry points that read `.component-contracts`, run the libraries, and report progress.
3. **Token and contract inputs**: `packages/tokens/src` and `packages/contracts/src`.

## Known issues

Found while verifying this guide on 2026-11-19. Each one is a bug in the code or the tooling, not a step you should work around.

1. **Root `pnpm build` fails** in `apps/web-components` with 26 TypeScript errors in the story files. CI does not run this command, so it has not been caught.
2. **The `@ds/figma-*` packages are not root dependencies**, so scripts outside the packages can't import them by name.
3. **`--validate-only` prints "All components generated successfully!"** even though nothing was generated.
4. **A bad file key produces a bare 404** from Phase 1. The message doesn't name the setting to check.
5. **Token coverage output contradicts itself.** It reports "68%" next to "(all tokens defined)".
6. **Phase 0 prints the placeholder file key** as if it had been checked.

## Questions

See the [README](./README.md). The design rationale is in [docs/architecture.md](./docs/architecture.md) and [docs/decisions.md](./docs/decisions.md).
