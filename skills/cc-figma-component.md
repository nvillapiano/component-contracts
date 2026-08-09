---
name: cc-figma-component
description: "Generate a Figma component set from a component contract. Use when the user wants to build or update a Figma component from a contract definition — e.g. 'build the Button Figma component', 'generate Figma component from contract', 'sync the Accordion to Figma', 'create component variants in Figma'. PREREQUISITE: cc-figma-tokens must have been run first — Primitive and Semantic variable collections must exist in the target Figma file."
---

# cc-figma-component — Component Contracts Component Skill

Generate Figma component sets from component contracts. This skill reads a contract, derives component-scoped (Tier 3) tokens, and builds a fully variable-bound component set in Figma.

## Prerequisites

- **cc-figma-tokens** must have been run first — `Primitives` and `Semantic` variable collections must exist in the Figma file
- Configuration (`.component-contracts`) must be set up with valid Figma credentials

## Workflow

1. **Configuration**: Read `.component-contracts` from the project root
   - Verify `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`, `TOKENS_DIR`, `CONTRACTS_DIR` are set
   - **Never output `FIGMA_ACCESS_TOKEN` in any response**

2. **Select Component**: Ask user which component to build
   - List available contracts: `{CONTRACTS_DIR}/*.contract.json`
   - User specifies component ID (e.g., "button", "accordion", "text-input")

3. **Validate Contract**: Read the contract file
   - Verify contract structure (tokens, props, variants, states)
   - Check that all referenced semantic tokens exist
   - Show component summary: display name, platforms, variant structure
   - **Await user approval before proceeding**

4. **Build Component**: Run the component builder
   ```bash
   pnpm run build:figma-component --component={componentId}
   ```
   - This generates a complete component set with all variants
   - Phases handled by the builder:
     - Phase 0: Load and validate contract
     - Phase 1: Create page for component
     - Phase 2: Build base component frame
     - Phase 3: Build variant matrix
     - Phase 4: Bind semantic variables to component properties
     - Phase 5: Define component properties (variant, size, state, custom props)
     - Phase 6: Create Generation Notes with any issues or constraints
     - Phase 7: Final validation and summary

5. **Verify**: After successful build
   - Component set appears in Figma with all variants
   - Each variant is properly bound to semantic variables
   - Component properties are exposed for design system usage

## What Gets Built

**Component Sets** — one per primary variant value:
```
Button/Primary
Button/Secondary
Button/Ghost
Button/Destructive

Accordion/Single
Accordion/Multiple

TextInput/Default
```

**Variants** within each set:
- Size axis (Small, Medium, Large — or custom values from contract)
- State axis (Default, Hover, Focus, Active, Disabled, Loading — or contract-defined states)
- Combined: Size=Small + State=Default, Size=Small + State=Hover, etc.

**Properties** (exposed on component):
- `variant` — primary variant axis
- `size` — secondary axis (if present in contract)
- `state` — secondary axis (from contract's states array)
- Custom boolean/text props from contract (e.g., `disabled`, `iconOnly`, `fullWidth`)

**Token Binding**:
- Each token category (color, spacing, typography, border, motion) from the contract binds to the corresponding semantic variable
- Tier 3 token naming: `--ds-{componentId}-{role}-{qualifier}` (e.g., `--ds-button-fill-brand`)
- All bindings go to Tier 2 (Semantic) variables, never directly to Tier 1 (Primitives)

## Component Contract Structure

A contract defines:

```json
{
  "id": "button",
  "displayName": "Button",
  "tokens": {
    "color": {
      "background.primary": "brand.600",
      "text.primary": "neutral.0"
    },
    "spacing": {
      "padding.x.md": "space.md",
      "padding.y.sm": "space.sm"
    },
    "border": {
      "radius": "radius.md",
      "width": "border.width.sm"
    },
    "motion": {
      "transition": "duration.fast"
    }
  },
  "props": {
    "variant": {
      "type": "enum",
      "values": ["primary", "secondary", "ghost", "destructive"]
    },
    "size": {
      "type": "enum",
      "values": ["sm", "md", "lg"]
    }
  },
  "states": ["default", "hover", "focus", "active", "disabled", "loading"]
}
```

**Tokens** — Tier 3 bindings to semantic variables
**Props** — Variant axes and custom properties
**States** — State values for component behavior

## Tier 3 Tokens (Component-Scoped)

Tier 3 tokens are derived at runtime from the contract's `tokens` section. They are NOT stored as files — only Tier 1 (Primitives) and Tier 2 (Semantic) are persisted as JSON.

Token binding example:
```
Contract: "background.primary": "brand.600"
↓
Tier 3 token: --ds-button-fill-brand
↓
Binds to Tier 2 variable: semantic/brand/600
↓
Which aliases to Tier 1: primitive/color/blue/600
```

Role translation:
- `color.background.*` → `fill` role
- `color.text.*` → `text` role
- `spacing.*` → `spacing` role
- `typography.*` → `typography` role
- `border.radius` → `border` role
- `border.width` → `border` role
- `motion.*` → `transition` role

## Generation Notes

After building, the component will have a "Generation Notes" frame documenting:
- Any manual steps required (Figma Plugin API limitations)
- Token resolution summary
- Variant count
- Known constraints

## Example: Building Button

1. User: "Build the Button component"
2. Agent reads `packages/contracts/src/button.contract.json`
3. Shows preview: "Button • 4 variant values × 3 sizes × 6 states = 72 variants"
4. User confirms
5. Agent runs: `pnpm run build:figma-component --component=button`
6. Result: Button/Primary, Button/Secondary, Button/Ghost, Button/Destructive appear in Figma with all variants bound to semantic variables

---

## Troubleshooting

- **"Missing semantic variables"** — One or more contract token references don't exist in the Semantic collection. Run cc-figma-tokens first or add missing tokens.
- **"Component not found"** — Contract file doesn't exist at `{CONTRACTS_DIR}/{componentId}.contract.json`. List available contracts with the configuration check.
- **Variants not appearing** — Ensure `props.variant` is defined in the contract with `type: "enum"` and `values` array.
