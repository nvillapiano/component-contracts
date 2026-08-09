---
name: cc-figma-tokens
description: "Build or update Figma variable collections (Primitives and Semantic) from component-contracts token files. Use when the user wants to sync their design token definitions into Figma as native variables — e.g. 'build the token library', 'sync tokens to Figma', 'create Figma variables from tokens', 'update the variable collections'. PREREQUISITE for cc-figma-component — tokens must exist in Figma before components can be built."
---

# cc-figma-tokens — Component Contracts Token Skill

Build Figma variable collections from component-contracts token files.

## Workflow

1. **Configuration**: Read `.component-contracts` from the project root
   - Verify `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`, `TOKENS_DIR`, `CONTRACTS_DIR` are set
   - If missing, tell user to copy `.component-contracts.example` and fill in values
   - **Never output `FIGMA_ACCESS_TOKEN` in any response**

2. **Inspect**: Check what token files exist
   - List all primitive token files (color, motion, shape, space, typography)
   - List semantic token file
   - Show token counts per tier
   - **Await user approval before proceeding**

3. **Build**: Run the token builder
   ```bash
   pnpm run build:figma-tokens
   ```
   - This creates/updates Primitives and Semantic variable collections in Figma
   - Phases handled by the builder:
     - Phase 0: Load and validate tokens
     - Phase 1: Create Primitives collection with all raw token values
     - Phase 2: Create Semantic collection with aliases into Primitives
     - Phase 3: Apply explicit variable modes to all nodes
     - Phase 4: Validate both collections exist with correct counts

4. **Verify**: After successful build
   - Token coverage is displayed (percentage of tokens used by contracts)
   - Both Primitives and Semantic collections should exist in the Figma file
   - All tokens are available for component binding

## What Gets Created

| Collection | Mode | Purpose |
|-----------|------|---------|
| `Primitives` | `Value` | Raw token values (color/blue/500, space/4, etc.) — hidden from property panels |
| `Semantic` | `Value` | Aliases into Primitives (brand/500, surface/default, etc.) — components bind to these |

Variable names use `/` as group separator matching W3C DTCG format:
- Primitives: `color/blue/500`, `space/4`, `radius/md`
- Semantic: `brand/500`, `surface/default`, `text/primary`

## Token Architecture (Tiers)

**Tier 1 — Primitives** (raw values)
- Color scales (color/red/50, color/red/100, etc.)
- Spacing scale (space/1, space/2, space/4, etc.)
- Motion (duration, easing)
- Shape (radius values)
- Typography (font sizes, weights)

**Tier 2 — Semantic** (aliases)
- Design roles (brand/500, surface/default, text/primary)
- Component-independent (used across all components)
- Single `Value` mode

## Next Step

After building tokens, use **cc-figma-component** skill to generate Figma components that bind to these variables.
