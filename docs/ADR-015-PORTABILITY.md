# ADR-015: Making Component Contracts Portable & Productizable

**Date:** 2026-08-10  
**Status:** Proposed  
**Author:** Claude Code  
**Relates to:** #30 (Epic: Make Component Contracts Portable & Productizable)

---

## Context

Component Contracts is currently an internal tool at One North for managing a design system. The skills shipped in PR #38 (cc-figma-tokens, cc-figma-components) prove the system works, and there's clear demand to make this reusable by other teams.

**The challenge:** How do we transform component-contracts from an internal monorepo into a product that a solo designer OR a small embedded design team can clone, configure, and use immediately?

**The constraint:** Support flexibility without creating maintenance debt. Every configuration option, platform support, or workflow is a surface to maintain and document.

**The target users:**
- Solo designer prototyping a new design system
- Small agency (Charter) embedded as a design team in an org
- Internal One North usage (as one customer among many)

---

## Decisions & Rationale

### 1. Config Format: YAML with JSON fallback

**Decision:** Use YAML as the primary config format (`.component-contracts.yaml`), with programmatic support for `.component-contracts.json` and `.component-contracts.js`.

**Rationale:**
- YAML is human-readable and requires minimal syntax to learn
- Solves the "what goes in the file" problem — team members who aren't developers can read and edit it
- JSON fallback for programmatic generation (CI/CD scripts, automation)
- JS option for teams who want computed values or conditional logic
- Aligns with Astro, Remix, and other modern tooling precedents

**Counterpoint considered:** JSON is more universal, but YAML's readability wins for this use case. The fallback support keeps flexibility without forcing all users into JSON.

**Implementation:**
```yaml
# .component-contracts.yaml
name: My Design System
description: Component contracts for my org
version: 0.0.1

# Directory configuration (relative to project root)
paths:
  contracts: packages/contracts/src
  tokens: packages/tokens/src
  output: dist

# Figma integration (optional)
figma:
  accessToken: ${FIGMA_ACCESS_TOKEN}  # from .env
  fileKey: ${FIGMA_FILE_KEY}

# Token system configuration
tokens:
  format: w3c-dtcg  # only supported format initially
  tiers:
    - primitive
    - semantic
    - component

# Target platforms (which code generators to run)
platforms:
  web: true
  ios: false
  android: false
```

**Consequences:**
- Must parse YAML + JSON + potentially execute `.js` files
- `.component-contracts.js` could be a security concern if users load untrusted repos
- External teams might have different directory layouts; config must support this

---

### 2. CLI Command: `pnpm create @ds/component-contracts@latest`

**Decision:** Primary entry point is `pnpm create @ds/component-contracts@latest [project-name]`. Secondary: `npm create @ds/component-contracts@latest` for npm users.

**Rationale:**
- `pnpm create` / `npm create` is the modern standard (no `npx`, no global installs)
- It's what Create React App users expect
- Scaffolds directly into a new directory with one command
- Works for all package managers (npm, pnpm, yarn, bun all support `create`)
- Single source of truth for the scaffolder package
- Easy to update: users just re-run `pnpm create` to get the latest template

**Secondary commands for convenience:**
```bash
# If user wants to initialize in an existing repo
pnpm cc init

# If user wants to generate a new component
pnpm cc component create button
```

**Counterpoint considered:** Should there be a `@ds/cli` package? No—keep it simple. The scaffolder package IS the CLI. Future micro-services (component generator, token sync) can be separate tools.

**Consequences:**
- Must publish `@ds/component-contracts` to npm (public)
- Each release updates the template, so scaffolding always gets the latest
- Directory naming matters; scaffold with sensible defaults

---

### 3. What Gets Scaffolded: Minimal + Opinionated

**Decision:** Scaffold:
- `.component-contracts.yaml` (configured)
- `.env.example` with Figma keys
- `packages/contracts/src/button.contract.json` (reference example)
- `packages/tokens/src/primitive/` and `packages/tokens/src/semantic/` (minimal token set)
- `packages/mcp-server/src/` (MCP setup)
- `package.json` with core scripts (validate, build:tokens, dev:mcp)
- `pnpm-workspace.yaml` with package definitions

**Do NOT scaffold:**
- `apps/web`, `apps/web-components`, `apps/ios`, `apps/android` — let users add what they need
- Full contract library — one example is enough to show structure
- Full token system — give them starter primitives (colors, spacing, typography) they'll customize

**Rationale:**
- Minimal is faster to set up and easier to understand
- Button example shows "this is how you write a contract"
- Starter tokens are enough to build first components without starting from zero
- Users who want full React/Web Components can add apps incrementally
- Reduces cognitive load: you're not learning Storybook, iOS, AND Android at once

**Consequences:**
- Users need guidance on "what to do next" — docs/README must be excellent
- Scaffold size stays small (<1MB zipped)
- If we add new features, scaffold template must be updated (maintenance surface)

---

### 4. Package Manager Flexibility: Support all, default to pnpm

**Decision:** 
- Default to pnpm in scaffolds and docs
- Support npm/yarn/bun by swapping `pnpm` with `$PKG_MANAGER` in scripts
- Detect user's preference during `pnpm create` and generate `package.json` scripts accordingly

**Implementation:**
```bash
$ pnpm create @ds/component-contracts
? Which package manager do you use? (pnpm/npm/yarn/bun) [pnpm]
$ npm create @ds/component-contracts  # auto-selects npm if invoked this way
```

**Rationale:**
- pnpm is our choice (faster, better monorepo support), but external teams may have other constraints
- `workspace:*` protocol only works with pnpm, so internal monorepo stays pnpm-only
- External teams might use npm for simplicity — we should support them
- Detecting the user's choice makes scripts "just work"
- No extra maintenance: scripts are shell-agnostic; only the package manager invocation changes

**Counterpoint considered:** Force pnpm? No—creates friction for adoption. Small flexibility here is worth it.

**Consequences:**
- Must test scaffolds with npm, yarn, and bun (CI time investment)
- Internal One North workflow stays pnpm; external teams can pick their tool
- No Turborepo/Nx for now—pnpm workspaces handle multi-package workflows fine

---

### 5. Token System: W3C DTCG only, with escape hatches

**Decision:**
- Require W3C DTCG format (`$value`, `$type`)
- No support for Style Dictionary custom format or other token systems initially
- Provide clear docs on how to migrate from other formats
- Leave the door open for future format adapters (don't hard-code DTCG everywhere)

**Rationale:**
- W3C DTCG is becoming the industry standard (used by Figma, Tokens Studio, Design Tokens Community Group)
- Supporting multiple formats adds complexity (validators, transformers, docs)
- One North, Charter, and most design teams use or are moving to W3C DTCG
- If an external team uses Tokens Studio or Figma Tokens, they already have DTCG-compatible exports
- Future: we can add adapters (`--token-format=tokens-studio`) without breaking current workflows

**Migration path for non-DTCG teams:**
1. Export from their current system (Tokens Studio, custom JSON, etc.)
2. Use a converter to map to W3C DTCG (we can provide examples)
3. Add custom config if needed: `tokens.format: w3c-dtcg-with-custom-metadata` (reserved for future)

**Consequences:**
- Teams currently using Tokens Studio or other systems must convert — friction, but one-time
- If we add format support later, it's a breaking change to config schema
- Validator and token builder are tightly coupled to DTCG structure; future formats need careful design

---

### 6. Onboarding UX: Interactive CLI + HTML .env generator

**Decision:**
- Interactive CLI wizard during `pnpm create` that prompts for:
  - Project name
  - Description
  - Package manager
  - Figma integration (yes/no) and credentials if yes
  - Initial token scope (colors, spacing, typography; all on by default)
- After scaffold: offer an HTML `.env` helper file in the repo root that generates `.env` from a browser form

**Implementation (CLI phase):**
```bash
$ pnpm create @ds/component-contracts
✨ Creating component-contracts project...
? Project name: my-design-system
? Description: Design system for Acme Corp
? Package manager: (pnpm/npm/yarn/bun) [pnpm]
? Set up Figma integration? (y/n) [n] y
  ? Figma access token: ●●●●●●
  ? Figma file key: ●●●●●●
? Initial token scopes: (select with space, enter to confirm)
  ◉ Colors
  ◉ Spacing
  ◉ Typography
  ○ Shadows
  ○ Motion
✨ Done! Run 'pnpm install' and 'pnpm validate' to get started.
```

**Implementation (HTML .env helper):**

A file `setup-env.html` in the repo root opens in the browser. User fills in:
- Figma access token
- Figma file key
- (later: token system URL, CI/CD secrets, etc.)

Clicking "Generate" shows the `.env` file content. User copies it, creates `.env` in repo root, pastes it. One-click onboarding.

**Rationale:**
- Interactive wizard removes ambiguity ("what goes in my config?")
- HTML helper is cute, memorable, and makes onboarding feel polished
- Non-developers can follow the flow without reading docs
- Figma keys are sensitive; prompting lets users decide whether to set it up
- Aligns with Nick's "eventually nice touches" request

**Consequences:**
- CLI must be interactive and clear (error handling matters)
- HTML generator is a small file but adds a visual "wow" factor (maintenance is minimal)
- Users might skip Figma setup initially; docs must explain how to add it later

---

### 7. Design Posture: External-focused, One North as one customer

**Decision:**
- All architectural decisions prioritize external team adoption over internal One North workflow
- One North's workflow remains supported but not privileged
- Template and config defaults assume a standalone team, not a monorepo

**Examples:**
- Default `CONTRACTS_DIR=packages/contracts/src` works for standalone repos
- One North can override via `.component-contracts.yaml` without friction
- Figma integration is optional; doesn't assume all teams have a Figma file
- Token tiers (primitive/semantic/component) are documented as One North's convention, not mandatory

**Rationale:**
- If the system works for external teams first, it will definitely work for One North
- Forces us to strip away internal-only assumptions
- One North adoption is a feature, not the primary use case
- Makes component-contracts a real product, not just an internal tool

**Consequences:**
- Some One North workflows might be slightly less optimal (e.g., monorepo conveniences)
- Documentation must cover both "standalone team" and "one north enterprise" setups
- Configuration flexibility increases maintenance surface; we must be disciplined

---

## Alternative Approaches Considered & Rejected

### Config Format: JSON only
**Rejected because:** YAML's readability wins for cross-functional teams. JSON fallback keeps tooling simple.

### CLI Structure: Dedicated `@ds/cli` package
**Rejected because:** Overkill for initial launch. The scaffolder IS the CLI. Future tools (component generator, sync-to-figma) can be separate.

### Token System: Support multiple formats
**Rejected because:** Maintenance debt. W3C DTCG is the standard; migration path exists for other systems.

### Scaffolding: Full monorepo with all apps
**Rejected because:** Overwhelming for new users. Minimal scaffold + examples is clearer.

### Force pnpm only
**Rejected because:** npm/yarn/bun support is low-friction and increases adoption.

---

## Implementation Plan

### Phase 1: Config System (2–3 hours)
- Parse `.component-contracts.yaml` + `.component-contracts.json` + `.component-contracts.js`
- Build a `Config` class that handles path resolution, validation, defaults
- Test with sample configs

### Phase 2: Scaffolder CLI (4–5 hours)
- Create `@ds/component-contracts/scaffold/` with template files
- Build interactive CLI using `prompts` or `enquirer`
- Detect package manager and generate scripts accordingly
- Test `pnpm create` and `npm create` workflows

### Phase 3: HTML .env Helper (1–2 hours)
- Write simple HTML form (no dependencies)
- Generate `.env` snippet on submit
- Place `setup-env.html` in scaffold template

### Phase 4: Documentation (2–3 hours)
- Update README with scaffolding instructions
- Write "Getting Started for External Teams" guide
- Document config schema and examples

### Phase 5: Release & One North Test (1–2 hours)
- Publish `@ds/component-contracts` to npm (public, semver)
- Test Charter project adoption
- Iterate on UX based on feedback

**Total effort:** ~12–16 hours of focused work

---

## Success Criteria

- [ ] External team can clone and run `pnpm create @ds/component-contracts` → working design system in <10 minutes
- [ ] Config file is readable by non-developers
- [ ] Figma integration is optional but easy to add
- [ ] One North's workflow remains supported (can use existing monorepo as-is)
- [ ] Published to npm with clear docs
- [ ] Tested on Charter project (real external adoption)
- [ ] No config footguns — sensible defaults work for 90% of use cases

---

## Open Questions for Review

1. **Monorepo for external teams?** Should the scaffold include pnpm-workspace.yaml if user has multiple platforms (web + iOS), or start simpler?
   - *Tentative:* Start simpler. Add workspace support as a second `pnpm cc scaffold-monorepo` command if needed.

2. **Token coverage validation.** Should scaffolds include a starter token set, or start with empty primitives?
   - *Tentative:* Starter set (colors 0–900, spacing xs–2xl, typography sm–lg). Users customize from there.

3. **Versioning strategy.** Should we major-bump when config schema changes, or use migration tooling?
   - *Tentative:* Major bump. Config schema changes are rare; migration docs suffice for early users.

4. **Platform scaffolds.** When user runs `pnpm cc app add ios`, should it scaffold a full iOS project or just the app structure?
   - *Tentative:* Just the structure. Let users integrate per their workflow. Add docs linking to existing examples.

---

## Consequences & Commitments

**Positive:**
- Opens component-contracts to external adoption
- Forces clean architecture (less internal-specific magic)
- Creates a repeatable product workflow
- Aligns with market demand (Charter, others)

**Maintenance:**
- Template updates need CI testing across package managers
- Config schema is part of the public API; changes require planning
- Documentation burden increases (external users need more hand-holding)
- Will get feature requests ("support Yarn Berry", "use TypeScript config", etc.)

**Timeline:**
- Ready for Charter pilot in ~1 week of focused work
- Public launch post-Charter validation

---

## Related Issues

- #39: Bootstrapper example (document skill testing)
- #36: Token consolidation (v2 refactoring)
- #30: This epic

---

## Status

- **Date proposed:** 2026-08-10
- **Status:** Awaiting review & feedback before implementation
- **Next:** Nick reviews decisions, approves/modifies, then implementation starts
