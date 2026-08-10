---
name: cc-figma-tokens
description: Create Figma variable collections from W3C Design Token Community Group token files. Upload primitive and semantic token files, then use /cc-figma-tokens to build Primitives and Semantic variable collections in Figma.
---

# cc-figma-tokens — Build Design Tokens in Figma

Create Figma variable collections (Primitives and Semantic) from W3C DTCG token files. This skill reads your design token definitions and materializes them as native Figma variables with proper modes, types, and aliases.

## What this skill does

- Reads primitive token files (color, space, motion, shape, typography)
- Reads semantic token file (role-based aliases to primitives)
- Creates two Figma variable collections: **Primitives** and **Semantic**
- Binds all tokens to the correct variable types (COLOR, FLOAT, STRING)
- Creates variable aliases (semantic tokens → primitive tokens)
- Reports what was created and any issues

## How to use

1. **Prepare your token files**
   - Collect `primitives/color.tokens.json`, `primitives/space.tokens.json`, etc.
   - Collect `semantic/semantic.tokens.json`
   - Export as files or prepare to paste the JSON

2. **Upload the files to this chat**
   - You can upload individual files or a directory
   - Must include at least one primitive file and the semantic file

3. **Run the skill**
   ```
   /cc-figma-tokens
   ```

4. **Approve the plan**
   - The skill will show you what collections and tokens will be created
   - Confirm whether to create new collections, update existing ones, or skip

5. **Verify the results**
   - The skill reports how many variables were created per collection
   - Open the Variables panel in Figma to inspect the collections

## Token file format

Tokens must follow W3C Design Token Community Group format:

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#2563eb",
        "$type": "color"
      }
    }
  },
  "space": {
    "md": {
      "$value": 16,
      "$type": "dimension"
    }
  }
}
```

Supported `$type` values:
- `color` → Figma COLOR variable
- `dimension` → Figma FLOAT variable
- `fontFamily` → Figma STRING variable
- `fontSize` → Figma FLOAT variable
- `fontWeight` → Figma STRING variable
- `duration` → Figma FLOAT variable (milliseconds)
- `cubicBezier` → Figma STRING variable

Semantic tokens can reference primitives using `{path.notation}`:

```json
{
  "brand": {
    "500": {
      "$value": "{color.blue.500}",
      "$type": "color"
    }
  }
}
```

## Important notes

- **Collection naming**: Collections are named `Primitives` (for all primitive tokens) and `Semantic` (for role-based aliases)
- **Existing collections**: If collections already exist, you'll be asked whether to skip, update, or recreate them
- **Variable limits**: If you have more than 80 tokens in a single collection, the skill will create them in batches automatically
- **Fonts**: Custom fonts may not be available in Figma's environment. Common fonts (Inter, Roboto, etc.) work reliably
- **No undo**: All changes from a single skill run undo as one block. Run the skill carefully if your file already has variables

## Troubleshooting

**"Collection already exists"**
→ Choose to update (adds new tokens, keeps existing ones) or recreate (deletes and rebuilds)

**"Variable type not supported"**
→ Check the `$type` field. Only the types listed above are supported

**"Token reference not found"**
→ Semantic tokens reference primitives by path (e.g., `{color.blue.500}`). Make sure the primitive exists before creating the semantic token

**"Script timed out"**
→ The file has too many tokens. The skill will split creation into batches automatically

## After tokens are created

- Use **cc-figma-components** skill to build components that reference these variables
- Tokens are now available to bind to component properties
- Changes to token values automatically propagate to all components using them
