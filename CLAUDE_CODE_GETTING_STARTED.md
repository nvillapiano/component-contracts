# Using Figma Skills in Claude Code

Quick start guide for generating Figma components from the component-contracts repository.

## Prerequisites

- Figma access token with file access permissions
- Figma file key (from your Figma file URL)
- Node.js 20+ with pnpm installed

## Setup (1 minute)

### 1. Configure Access

Create `.component-contracts` in the project root:

```bash
cp .component-contracts.example .component-contracts
```

Edit `.component-contracts` and add your values:

```
FIGMA_ACCESS_TOKEN=figd_xxxxx...
FIGMA_FILE_KEY=BAmrNaBBA6pqnFKVFOD7Bk
TOKENS_DIR=packages/tokens/src
CONTRACTS_DIR=packages/contracts/src
```

### 2. Build Dependencies

```bash
# Install and build all packages
pnpm install
pnpm build

# Or just build the Figma packages
pnpm --filter @ds/figma-tokens build
pnpm --filter @ds/figma-component build
```

## Usage

### Option A: CLI Runners (Simplest)

```bash
# Build token collections
pnpm run build:figma-tokens

# Build components
pnpm run build:figma-component --component=button
pnpm run build:figma-component --component=accordion

# Or both at once
pnpm run build:figma-component --component=button --component=accordion
```

Progress output will show each phase as it runs.

### Option B: TypeScript Script

Create `scripts/generate-design-system.ts`:

```typescript
import { FigmaTokenBuilder } from '@ds/figma-tokens';
import { FigmaComponentBuilder } from '@ds/figma-component';

async function main() {
  // Build tokens
  console.log('Building tokens...');
  const tokenBuilder = new FigmaTokenBuilder({
    configPath: '.component-contracts'
  });
  const tokenResult = await tokenBuilder.buildTokens();
  console.log(tokenResult);

  // Build components
  console.log('\nBuilding components...');
  const componentBuilder = new FigmaComponentBuilder({
    configPath: '.component-contracts'
  });
  
  const components = ['button', 'accordion'];
  for (const component of components) {
    const result = await componentBuilder.buildComponent(component);
    console.log(`${component}: ${result.status}`);
  }
}

main().catch(console.error);
```

Run with:
```bash
pnpm exec tsx scripts/generate-design-system.ts
```

## What Gets Created

### Token Collections

Two Figma variable collections are created:

- **Primitives** - Raw token values (color, space, typography, etc.)
- **Semantic** - Aliases into Primitives (brand, text, surface, etc.)

All tokens are fully variable-bound and ready for component use.

### Components

For each component contract (button, accordion, etc.):

- **Component Sets** - One per primary variant (Button/Primary, Button/Secondary, etc.)
- **Variants** - All size × state combinations
- **Variable Bindings** - All colors, spacing, typography bound to Semantic tokens
- **Component Properties** - Proper prop definitions (label, iconStart, etc.)
- **Generation Notes** - Documentation of assumptions and limitations

## Debugging

### Check Configuration

```bash
# Verify your token counts
cat .component-contracts | grep TOKENS_DIR
ls $(cat .component-contracts | grep TOKENS_DIR | cut -d= -f2)
```

### Validate Before Building

```bash
# Validate component without creating
pnpm run build:figma-component --component=button --validate-only
```

### Enable Debug Mode

```bash
# Stop between phases for approval
pnpm run build:figma-tokens --debug
pnpm run build:figma-component --component=button --debug
```

### View Detailed Errors

```bash
# Show stack traces on errors
pnpm run build:figma-tokens --dev
```

## Troubleshooting

### "Configuration file not found"

Create `.component-contracts`:
```bash
cp .component-contracts.example .component-contracts
```

### "FIGMA_ACCESS_TOKEN not found"

Verify your `.component-contracts` file:
```bash
cat .component-contracts | grep FIGMA_ACCESS_TOKEN
```

### "Module not found: @ds/figma-tokens"

Ensure packages are built:
```bash
pnpm build
```

### "Failed to parse contract"

Check contract file format:
```bash
cat packages/contracts/src/button.contract.json | head -20
```

## Next Steps

After generating components:

1. **Review in Figma** - Open your Figma file to see the generated components
2. **Export references** - Compare against Storybook:
   ```bash
   pnpm run export-figma-references
   ```
3. **Validate fidelity** - Check colors, spacing, typography match
4. **Generate more components** - Repeat for accordion, dialog, etc.

## Architecture

The implementation uses three layers:

1. **TypeScript Libraries** (`packages/figma-tokens/`, `packages/figma-component/`)
   - Core logic extracted into reusable, testable modules
   - No client-specific dependencies
   - Full type safety with IDE support

2. **CLI Runners** (`scripts/build-figma-*.ts`)
   - Command-line entry points
   - Progress reporting and error handling
   - Works in any Node.js environment

3. **Figma Plugin API**
   - Executed via `use_figma` MCP in Claude Code
   - Handles all Figma operations (create collections, bind variables, etc.)

## See Also

- [REFACTORING.md](../tmp/component-contracts-figma/REFACTORING.md) - Architecture overview
- [CLAUDE_CODE_USAGE.md](../tmp/component-contracts-figma/CLAUDE_CODE_USAGE.md) - Detailed API reference
- [Figma Skills Repository](https://github.com/nvillapiano/component-contracts-figma) - Original markdown skills

## Questions?

Check the main [README.md](README.md) or the skills documentation for workflow details.
