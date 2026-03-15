# Architecture Decision Records

A log of meaningful decisions made during the design and build of this system. Format loosely follows [ADR](https://adr.github.io/) conventions: context, decision, rationale, consequences.

---

## ADR-001: Contracts as source of truth

**Date:** 2025-03  
**Status:** Accepted

### Context
Design systems typically drift: React, iOS, and Android implementations diverge over time, docs go stale, and there's no authoritative definition of what a component *should* be. Storybook stories capture some of this but are implementation-coupled and not machine-readable in a useful way.

### Decision
Define a platform-agnostic JSON contract for each component. The contract owns the component's tokens, props, variants, behavior, accessibility requirements, and usage rules. All implementations are derived from or validated against the contract.

### Rationale
- Single place to update when a component changes
- Machine-readable by AI agents
- Can drive code generation, documentation, and Figma sync from one source
- Makes parity between platforms enforceable, not aspirational

### Consequences
- Contracts must be kept up to date — they're only useful if they're accurate
- Adds authoring overhead for new components
- Contract schema must be strict enough that agents can't hallucinate structure

---

## ADR-002: Monorepo with pnpm workspaces

**Date:** 2025-03  
**Status:** Accepted

### Context
The system has multiple related packages (schema, contracts, tokens, MCP server) and apps (validator, web, ios, android). These need to share types and depend on each other during development.

### Decision
Single monorepo managed with pnpm workspaces. No Turborepo or Nx.

### Rationale
- pnpm workspaces handle the dependency graph with no extra tooling
- Turborepo/Nx adds complexity that isn't justified at this scale
- `workspace:*` protocol makes cross-package dependencies explicit and cheap
- Native platform codebases (iOS, Android) can live here without issue since they don't participate in the Node build graph

### Consequences
- All packages share a root `node_modules`
- Extracting a package into its own repo later is clean: swap `workspace:*` for a published version
- CI must be aware of the workspace structure

---

## ADR-003: JSON Schema for contract validation

**Date:** 2025-03  
**Status:** Accepted

### Context
Contracts need to be validated — both in CI and before agents consume them. The schema also needs to generate TypeScript types so implementations have compile-time safety.

### Decision
Define the contract shape as a JSON Schema (draft-07). Use AJV for validation in CI. Use `json-schema-to-typescript` to generate TypeScript types from the schema.

### Rationale
- JSON Schema is the standard for this; tooling is mature
- AJV is the fastest JSON Schema validator in the Node ecosystem
- Single schema definition drives both validation and types — no drift between them
- Schema can be referenced by contract files directly (`"$schema": "..."`) for editor autocomplete

### Consequences
- Schema changes require a `pnpm types:generate` run to sync TypeScript types
- `additionalProperties: false` throughout means schema must be updated before new fields can be used

---

## ADR-004: Style Dictionary for tokens

**Date:** 2025-03  
**Status:** Accepted

### Context
Contracts reference design tokens by semantic path (e.g. `brand.500`, `space.md`). Those values need to exist somewhere and be transformable into platform-specific formats (CSS custom properties, Swift constants, Kotlin constants).

### Decision
Use Style Dictionary with W3C DTCG token format. Tokens are organized into primitive and semantic tiers. Semantic tokens alias primitives.

### Rationale
- Style Dictionary is the industry standard for this transformation
- W3C DTCG format is becoming the cross-tool standard (Figma, Tokens Studio, etc.)
- Two-tier (primitive + semantic) approach means brand changes touch one token
- Same token source can target CSS, Swift, Kotlin, and JSON from a single build

### Consequences
- Token paths used in contracts must exist in `@ds/tokens` — the validator should eventually check this
- Figma variable sync becomes straightforward when using DTCG format

---

## ADR-005: Class Variance Authority for React variant mapping

**Date:** 2025-03  
**Status:** Accepted

### Context
React components need to map contract props (variant, size, state) to CSS classes or styles. This mapping needs to be explicit, typed, and maintainable.

### Decision
Use `class-variance-authority` (CVA) for variant-to-class mapping in React components.

### Rationale
- CVA's API maps almost 1:1 to how contracts describe variants and props
- Produces TypeScript types from the variant definition automatically
- Lightweight, no runtime overhead beyond string concatenation
- Works with any CSS approach — token-driven custom properties in our case

### Consequences
- Component prop types are derived from CVA definitions, not from contracts directly — there's a manual sync step here until we have code generation
- No Tailwind dependency; components consume CSS custom properties from `@ds/tokens`

---

## ADR-006: Storybook as test harness (not just docs)

**Date:** 2025-03  
**Status:** Accepted

### Context
Components need interaction testing and accessibility testing. The options are Vitest + Testing Library (separate from Storybook) or Storybook's native testing tools.

### Decision
Use Storybook as the primary test harness. Stories mirror contract variants 1:1. Testing via `@storybook/test` (interactions), `@storybook/addon-a11y` (accessibility), and `@storybook/test-runner` (CI).

### Rationale
- Stories are already written to reflect contract variants — no duplication
- `@storybook/addon-a11y` directly validates the `wcagLevel` requirement in contracts
- `@storybook/test-runner` runs all stories as tests in CI via Playwright
- Chromatic (future) slots in as visual regression on top of the same stories

### Consequences
- Pure logic/utility unit tests would need Vitest — acceptable since component libraries have little of this
- Stories must be kept in sync with contract variants — this is a feature (forces accuracy) but also a maintenance surface

---

## ADR-007: MCP server for agent integration

**Date:** 2025-03  
**Status:** Accepted

### Context
AI agents (in Cursor, Claude Desktop, or custom) need to read and write contracts as part of automated workflows. Without a structured interface, agents must be given raw file contents as context manually.

### Decision
Build an MCP (Model Context Protocol) server that exposes the contract registry via structured tools. Runs as a local stdio process.

### Rationale
- MCP is Anthropic's open standard for tool use; supported natively in Claude Desktop and Cursor
- Stdio transport means no hosting required for local/team use
- Tool interface (`get_contract`, `find_by_token`, `update_contract`, etc.) gives agents exactly the operations they need without exposing raw filesystem access
- Can be promoted to an SSE/HTTP server for org-wide deployment later with minimal changes

### Consequences
- Agents read live contract files — changes made by the agent are immediately reflected in the repo
- No authentication on the local stdio server — acceptable for local use, needs to be addressed for hosted deployment

---

## ADR-008: Defer Chromatic to post-PoC

**Date:** 2025-03  
**Status:** Accepted

### Context
Visual regression testing is important for a component library, especially when implementations may be agent-generated.

### Decision
Chromatic is noted as a planned addition but deferred until after the proof-of-concept is validated.

### Rationale
- Chromatic requires a working Storybook with stable stories before it's useful
- Adding it now adds CI complexity before the value is proven
- The intended PR flow (contract change → agent generates implementation → Chromatic catches regressions) needs the full pipeline to exist first

### Consequences
- Visual regressions are possible during PoC — acceptable at this stage
- Architecture is designed to accept Chromatic as a CI step with no structural changes

---

## ADR-009: Figma sync deferred

**Date:** 2025-03  
**Status:** Accepted

### Context
Contracts contain exactly the data needed to keep Figma variables and component properties in sync. The Figma API already supports reading/writing variables.

### Decision
Figma sync is a named future direction but not part of the PoC or MVP scope.

### Rationale
- Figma's AI canvas writing capabilities are still maturing
- The value of the contract→Figma direction increases once contracts are stable and proven
- W3C DTCG token format (already adopted) makes the token sync path straightforward when ready
- Figma REST API + Make/Scripter integrations can be explored without changing the core architecture

### Consequences
- None for current implementation
- Token format choice (DTCG) is already aligned with what Tokens Studio and Figma Variables expect

---

## ADR-010: JSON Schema cannot enforce conditional prop logic

**Date:** 2026-03  
**Status:** Accepted

### Context
The accordion contract has a semantic rule: the `collapsible` prop only applies when `type` is `"single"`. In `multiple` mode, `collapsible` is meaningless. This kind of conditional constraint — "prop A is only valid when prop B has value X" — is a common pattern in compound components.

### Decision
Do not attempt to encode conditional prop logic in the JSON Schema. Document the constraint in the prop's `description` field only.

### Rationale
JSON Schema draft-07 supports `if/then/else` for conditional validation, but applying it to interdependent props produces schemas that are difficult to read, maintain, and extend. The complexity cost outweighs the validation benefit, especially since:
- The MCP server and agents read prop descriptions as natural language context
- TypeScript's type system can enforce this at the implementation layer via function overloads or discriminated unions
- Runtime validation (if needed) belongs in the component implementation, not the contract schema

### Consequences
- Contracts may contain props that are technically valid per schema but semantically invalid in combination — e.g. `{ type: "multiple", collapsible: true }`
- Implementation layers (React, SwiftUI, Compose) are responsible for enforcing conditional prop logic
- Agents consuming contracts must read prop descriptions carefully, not just type/values fields
- A future `constraints` field could be added to the schema to express these rules in a structured but non-validating way (documentation only)

---

## ADR-011: Figma as visual source of truth

**Date:** 2026-03  
**Status:** Accepted

### Context
The system has multiple platform implementations (React, Web Components, iOS, Android) that must maintain visual parity. Initially React was treated as the visual reference because it was the first implementation. This is a pragmatic shortcut, not a principled decision.

### Decision
Figma is the designated visual source of truth for all platform implementations. Until Figma token sync is implemented, the React implementation serves as the interim visual reference for web targets only. Native targets follow platform conventions.

### Rationale
- Figma is where design decisions are made — it should be authoritative, not derivative
- Using React as the reference couples visual truth to a specific technology, which is wrong
- W3C DTCG token format (already adopted) is compatible with Figma variables and Tokens Studio
- Chromatic has a Figma integration that enables direct story-to-frame comparison
- This decision is consistent with the broader principle that implementations are derived from specs, not from each other

### Consequences
- Figma variable sync (`@ds/tokens` ↔ Figma API) becomes a required milestone before this decision is fully realized
- In the interim, visual drift between React and Web Components is acceptable if both match the Figma design
- The `.cursor/rules` visual reference rule is scoped to web targets only — native targets are exempt
- A token change in Figma that isn't reflected in `@ds/tokens` is a bug

---

## ADR-012: Separate Storybook instances per web target

**Date:** 2026-03  
**Status:** Accepted

### Context
The system has two web implementations (`apps/web` React and `apps/web-components`), each with their own Storybook. There was consideration of merging them into a single Storybook to simplify visual comparison.

### Decision
Each web target maintains its own separate Storybook instance. They are not merged. Chromatic tracks both as separate projects under the same organization.

### Rationale
- Merging Storybooks creates build coupling — a React-specific dependency could break the web components build and vice versa
- Separate instances make it clear which implementation a story belongs to
- Chromatic supports multiple projects and can display them alongside each other without requiring a merged Storybook
- As native targets are added (iOS, Android), their visual testing tools are entirely separate — establishing the pattern of "one test harness per target" is correct

### Consequences
- Visual comparison across implementations is a manual step until Chromatic baselines are established
- CI must maintain parallel test jobs — one per Storybook instance
- Story structure and variant naming must be consistent across implementations so human comparison is straightforward

---

## ADR-013: 90% parity definition and PR gate criteria

**Date:** 2026-03  
**Status:** Accepted

### Context
The system targets four platforms (React, Web Components, iOS, Android). "Parity" is a vague goal without a concrete definition. We needed a clear, enforceable gate that determines when a component implementation is ready for human review.

### Decision
"90% parity" means a component is accurate and complete enough to send to PR for human-in-the-loop review. It does not mean pixel-perfect cross-platform matching. A component meets the PR gate when all five criteria pass:

1. All contract variants are implemented
2. Behavioral tests pass (interactions, states, keyboard navigation)
3. Zero accessibility violations (WCAG AA)
4. Visual snapshot baseline established (Chromatic for web; platform snapshot tests for native)
5. Token values match contract (no unresolved token paths)

### Rationale
- "Ready for PR" is a more useful definition than "perfect" — it acknowledges that human review is part of the process
- The five criteria map directly to the contract's structure: variants → props/variants, behavioral tests → behavior block, a11y → accessibility block, visual → Figma/Chromatic, tokens → tokens block
- This definition works across all four platforms by substituting the appropriate tooling per platform
- 10% tolerance accounts for intentional platform-convention deviations that are correct but different

### Consequences
- CI must enforce criteria 1–3 automatically; criteria 4–5 require tooling to be in place
- Until Chromatic is active, criterion 4 is a manual check
- Until the validator checks token existence, criterion 5 is a manual check via ContractTokenTable
- Platform-specific deviations that fail criterion 1–3 must be documented in `platformNotes` in the contract