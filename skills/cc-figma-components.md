---
name: cc-figma-components
description: Build Figma component sets from component contract JSON files. Upload a contract that defines props, variants, and token bindings, then use /cc-figma-components to generate a production-ready component with all variants bound to design tokens.
---

# cc-figma-components — Build Components from Contracts

Build Figma component sets from component contract definitions. This skill reads a contract that specifies variants, properties, and token bindings, then generates a complete component set with all variants bound to semantic design tokens.

## Prerequisites

- **Semantic and Primitive variable collections must exist in the file** (use cc-figma-tokens first)
- The component contract must reference tokens that exist as Figma variables

## What this skill does

- Reads a component contract JSON file
- Validates that all referenced tokens exist as Figma variables
- Creates a component with auto-layout and proper sizing
- Generates all variant combinations
- Binds each variant to the appropriate semantic variables (colors, spacing, typography, etc.)
- Adds component properties (text props, boolean props for show/hide)
- Reports what was created and highlights any missing dependencies

## How to use

1. **Prepare your component contract**
   - Define component structure: variants, properties, token bindings
   - Reference tokens that exist in Semantic collection
   - See contract format below

2. **Upload the contract file**
   - Export or prepare the contract JSON

3. **Run the skill**
   ```
   /cc-figma-components
   ```

4. **Approve the plan**
   - The skill will report how many variants will be created
   - Confirm that all referenced tokens exist
   - Approve before building

5. **Verify the results**
   - The component appears on your canvas
   - All variants are available in the "Design" panel
   - Variable bindings are shown in the right panel

## Component contract format

```json
{
  "id": "button",
  "displayName": "Button",
  "description": "Primary action button for user interactions",
  "tokens": {
    "color": {
      "background.primary": "brand.600",
      "text.primary": "neutral.0"
    },
    "spacing": {
      "padding.x": "space.md",
      "padding.y": "space.sm"
    },
    "border": {
      "radius": "radius.md"
    }
  },
  "props": {
    "variant": {
      "type": "enum",
      "description": "Visual style",
      "values": ["primary", "secondary", "ghost"],
      "default": "primary"
    },
    "size": {
      "type": "enum",
      "description": "Button size",
      "values": ["sm", "md", "lg"],
      "default": "md"
    },
    "disabled": {
      "type": "boolean",
      "description": "Disables the button",
      "default": false
    },
    "label": {
      "type": "string",
      "description": "Button text",
      "default": "Click me"
    }
  },
  "states": ["default", "hover", "active", "disabled", "loading"]
}
```

**Required fields:**
- `id` — component identifier (e.g., "button", "accordion")
- `displayName` — human-readable name shown in Figma
- `tokens` — token references organized by category (color, spacing, border, typography, motion)
- `props` — component properties that will be configurable in Figma

**Token path format:**
- Contracts reference semantic tokens using dot notation: `brand.600`, `space.md`, `radius.md`
- The skill converts these to Figma variable paths: `brand/600`, `space/md`, `radius/md`
- All referenced tokens must exist in the Semantic collection

**Variant structure:**
- Create a variant for each `enum` prop (e.g., `variant`, `size`, `state`)
- Total variants = product of all enum values
- Example: 3 variants × 3 sizes × 2 states = 18 total component variants

## Token binding reference

Common token categories and what they map to in Figma:

| Token category | Maps to | Figma binding |
|---|---|---|
| `color.background.*` | Fill color | `setBoundVariableForPaint` on fills |
| `color.text.*` | Text color | `setBoundVariableForPaint` on text fill |
| `spacing.padding.*` | Auto-layout padding | `setBoundVariable` on padding |
| `spacing.gap` | Auto-layout gap | `setBoundVariable` on itemSpacing |
| `border.radius` | Corner radius | `setBoundVariable` on radius |
| `border.width` | Stroke width | `setBoundVariable` on stroke width |
| `typography.size` | Font size | `setBoundVariable` on fontSize |
| `motion.transition` | Duration | Metadata (not bound, informational) |

## Important notes

- **Auto-layout**: Components are created with auto-layout (HORIZONTAL) by default. Adjust in Figma if needed
- **Sizing**: Components use HUG sizing (size to content) for flexible layouts
- **Variant naming**: Variants are named by their prop values (e.g., "primary/md/default")
- **Batch creation**: If you have more than 20 variants, the skill creates them in batches automatically
- **Existing components**: If a component with the same name exists, you'll be asked whether to skip or recreate
- **Missing tokens**: If a token doesn't exist as a Figma variable, that binding is skipped (but the component is still created)
- **Fonts**: Text uses Inter Semi Bold by default. Custom fonts may not be available

## Troubleshooting

**"Token not found: brand/600"**
→ The Semantic collection doesn't have this token. Run cc-figma-tokens first or add the missing token

**"Variable count exceeds 100"**
→ You're creating too many variants (product of all enum values). Reduce the number of variant values or confirm you want to proceed

**"Font 'Custom Font' not available"**
→ The font isn't loaded in Figma. Use a standard font (Inter, Roboto, etc.) or load the custom font manually first

**"Component not created"**
→ Check that the contract JSON is valid and has all required fields (`id`, `displayName`, `tokens`, `props`)

## After components are created

- Components appear on your canvas with all variants
- Use the component by clicking the component button in the assets panel
- All variants and properties are available for instances
- Changes to Semantic token values automatically update all component instances
- Customize variant styling by editing the main component

## Advanced: Multiple contracts

You can run this skill multiple times with different component contracts to build a full design system. Each component is independent, but all share the same Semantic token collection.

Example workflow:
1. `/cc-figma-tokens` → creates Primitives and Semantic collections
2. `/cc-figma-components` with button.contract.json → creates Button component
3. `/cc-figma-components` with accordion.contract.json → creates Accordion component
4. All components reference the same token collections
