# Component Contracts — Figma Session Context
> Paste this into a new chat to resume without losing context. Last updated: 2026-03-22.

---

## What this project is

**Component Contracts** — a contract-driven design system pipeline. A structured JSON contract file is the authoritative definition for a component. Everything downstream — Figma, React, Web Components, iOS, Android — is derived deterministically from the contract. The contract is source code. Figma is a build target.

- **Repo:** `github.com/nvillapiano/component-contracts` (private monorepo, pnpm workspaces)
- **Public repo:** To be created (same URL slug)
- **Figma test file:** `https://www.figma.com/design/sV4av2QFgdOcJqKnkx4w4X`
- **Config:** `.component-contracts` at repo root (gitignored) — holds `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`, `TOKENS_DIR`, `CONTRACTS_DIR`

---

## What's been built (Figma pipeline)

### Skills — written, tested, validated
Both live at `~/.cursor/plugins/local/figma-use/skills/`:
- `cc-figma-tokens/SKILL.md` — reads W3C DTCG token files, creates Primitive + Semantic variable collections in Figma
- `cc-figma-component/SKILL.md` — reads a contract, generates fully variable-bound component sets

### Figma file state
| Layer | Count | Notes |
|-------|-------|-------|
| Primitives collection | 87 vars | Color, motion, shape, space, typography |
| Semantic collection | 68 vars | Aliases + radius/*, border/width/*, duration/*, easing/* |
| Button page | 72 variants | 4 sets × 18 variants (Primary/Secondary/Ghost/Destructive × Size × State) |
| Accordion page | 30 variants | 3 sets × 10 variants (Non-collapsible/Collapsible/Multiple × Expanded × State) |
| README page | ⏳ In progress | Script written, needs to run via `use_figma` MCP |

### Contract versions in Cursor outputs (NOT yet committed to repo)
| Contract | Version | Key changes |
|----------|---------|-------------|
| button.contract.json | v2.2.0 | Explicit destructive tokens, slot composition with `childOrder` and `figma` hints |
| accordion.contract.json | v0.2.2 | Slot composition, trailing chevron with fixed 16×16 square, rotation values |

Repo currently has button v2.0.0 and accordion v0.1.0 — the updated versions need to be committed.

---

## Open threads (do these in order)

1. **Build README page in Figma** — script is `figma-readme-console.js` in Cursor outputs. Can't run from Figma console (no async plugin context). Run via Cursor:
   ```
   Read .component-contracts. Load figma-use skill.
   Run the following plugin script in the Figma file. Do not modify it —
   pass it exactly as the code parameter to use_figma. Create a README
   page if it doesn't exist, clear it, and build the frame.
   ```
   Attach `figma-readme-console.js`. Agent will chunk via `new Function` + `setSharedPluginData` (sandbox has no `atob`, `eval` blocked).

2. **Add hyperlinks in README footer** — Plugin API can't set hyperlinks. After frame builds: manually add prototype links in Figma for LinkedIn (Nick) and One North URL.

3. **Commit updated contracts** — button v2.2.0 and accordion v0.2.2 from Cursor outputs into `packages/contracts/src/`.

4. **Clean scripts folder** — `rimraf scripts/` before publishing.

5. **Create public repo** — Structure:
   ```
   README.md
   .component-contracts.example
   skills/
     cc-figma-tokens/SKILL.md
     cc-figma-component/SKILL.md
   examples/
     contracts/button.contract.json
     contracts/accordion.contract.json
     tokens/primitive/  (color, motion, shape, space, typography)
     tokens/semantic/semantic.tokens.json
   ```

6. **Publish Figma community file** — Button + Accordion + README pages. Credit: Nick Villapiano / One North.

7. **Submit to Figma team** — repo link + community file link + `figma-team-feedback.md` (14 API issues documented).

---

## Run command for any component

```
Read .component-contracts. Load cc-figma-component, cc-figma-tokens,
figma-use, and figma-generate-library skills.

The Primitives and Semantic variable collections already exist in
the Figma file — do not recreate them.

Build the [Component] Figma component from the [component] contract.
Verify your Phase 0 plan to yourself, then run straight through to completion.
```

**Model: Composer 2 + MAX Mode** — resets every new chat, check before every run.

---

## Critical technical rules (all learned the hard way)

### Sizing — the #1 source of bugs
- Every frame: `layoutSizingHorizontal = 'HUG'` AND `layoutSizingVertical = 'HUG'` — both lines, always
- Set sizing AFTER `appendChild` — `FILL` throws if set before parent relationship exists
- Figma defaults new frames to 100px FIXED height — never rely on this
- Exception: `sizing: "fixed"` in contract `figma` hints = explicit fixed dimensions (e.g. chevron 16×16)

### Rotation
- Always **degrees**, never radians. Pass `-90` not `-Math.PI/2`. Agent passes radians → Figma shows `-1.57°`.

### Plugin sandbox
- `atob`/`btoa` undefined — no native base64
- `eval` blocked — use `new Function` for dynamic execution
- 20k char limit on `use_figma` `code` parameter — forces minification which can silently drop lines
- Do NOT call `figma.closePlugin()` in console — kills plugin mid-run

### Data
- `setSharedPluginData` namespace: `component_contracts` (underscore — hyphens silently fail)
- States: always read from contract `states[]`, never hardcode
- Child order: always read from `composition.slots[slot].figma.childOrder`

### Scripts
- All generated scripts are disposable — `rimraf scripts/` after every run, never reuse

---

## Token architecture (3 tiers)

| Tier | Location | Example |
|------|----------|---------|
| Primitive | `packages/tokens/src/primitive/` | `color.blue.500 = #3B82F6` |
| Semantic | `packages/tokens/src/semantic/semantic.tokens.json` | `brand.500 → {color.blue.500}` |
| Component | Derived at runtime by skill | `button.background.primary → brand.500` |

Figma has Primitive + Semantic collections. Component tokens bind directly to Semantic vars — no third collection.

---

## Contract `figma` hints schema (for composition slots)

```json
{
  "position": "trailing",
  "defaultGlyph": "▾",
  "defaultRotation": 0,
  "expandedRotation": -90,
  "rotateOnExpand": true,
  "width": 16,
  "height": 16,
  "sizing": "fixed",
  "childOrder": ["label", "chevron"]
}
```

Slots with `sizing: "fixed"` are explicit exceptions to the global HUG rule.

---

## Architecture decisions

- **Contract as source of truth** — ADR-001. All implementations are derived from the contract, not from each other.
- **Figma as visual source of truth** — ADR-011. React is interim reference for web only until Figma sync is live.
- **Skill vs contract placement** — component-specific rendering rules belong in the contract (`figma` hints, `childOrder`, `sizing`). Generic rendering rules belong in the skill. Workspace-wide conventions belong in `.cursor/rules`.
- **Contract-driven = spec-driven** — the agent is a compiler, not a creative tool. The contract is source code. No guessing, no silent decisions — everything flagged in Generation Notes.

---

## Figma team feedback (14 items, ready to send)

1. `HORIZONTAL_PADDING`/`VERTICAL_PADDING` not valid VariableScope values
2. `setPluginData` uses debug UUID — data permanently unretreivable; `setSharedPluginData` should be default
3. Hyphens not allowed in shared plugin data namespaces — undocumented, silent failure
4. `componentPropertyReferences` can't drive `layoutSizingHorizontal`
5. 20k char limit forces minification → silently drops required lines
6. `atob`/`btoa` undefined in sandbox
7. `eval` blocked in sandbox
8. Ghost mode auto-created on every new collection — requires full-file cleanup pass
9. Letter-spacing: FLOAT vars are unitless, incompatible with em values
10. `cornerRadius` rejects `setBoundVariable` — silent failure, four-corner workaround required
11. `FILL` sizing throws if set before `appendChild` — undocumented ordering dependency
12. New frames default to 100px FIXED — no global default available
13. `rotation` accepts degrees but no guard against radians — silent wrong value
14. Performance: Composer 2 Fast = 40+ min for 84 variables; model selection matters a lot

Positive signal to lead with: `use_figma` + skill pattern works end-to-end. Button (72 variants) and Accordion (30 variants) generated successfully with full Semantic variable bindings.

---

## README page design spec (light theme)

Sections in order:
1. Badge ("Figma MCP Beta — March 2026") + eyebrow ("One North — Open Source")
2. Hero: "Component / Contracts" (two-line, blue accent on "Contracts")
3. The idea — spec-driven vs prompt-driven, contract = source code, Figma = build target
4. Pipeline — 4-step numbered list: contract.json → Primitives + Semantic → cc-figma-component → This file
5. What's in this file — Button card (v2.2.0 stable) + Accordion card (v0.2.2 draft)
6. Generation Notes callout — explains yellow ⚠️ frames, not bugs, transparency layer
7. How to use — contracts/tokens can live anywhere (CMS, DB, Figma vars), file structure is reference impl
8. Getting started — 7 steps, step 1 links to GitHub
9. Agent settings — Composer 2 + MAX Mode, model resets every chat
10. Troubleshooting — 5 items
11. Footer — Nick Villapiano → LinkedIn, One North → onenorth.com, GitHub → (repo URL)

Footer hyperlinks must be added manually via Figma prototype links — Plugin API can't set them.
