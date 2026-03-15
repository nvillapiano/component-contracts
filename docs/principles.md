# Design System Principles

The guiding principles behind how this design system is built and maintained. These inform every decision — from schema design to component implementation to agent workflows.

---

## 1. Contracts first

A component does not exist until its contract exists. The contract defines what a component *is* — its interface, its tokens, its behavior, its accessibility requirements. The implementation is a consequence of the contract, not the other way around.

This means:
- You can reason about a component before any code is written
- Agents have an unambiguous source of truth to generate from
- Platform parity is enforceable, not aspirational

---

## 2. Atomic Design

Components are organized by complexity and dependency:

- **Atoms** are indivisible. They have no component dependencies. Button, Icon, Badge.
- **Molecules** are composed of atoms. They have a single, clear responsibility. Accordion, FormField, SearchInput.
- **Organisms** are complex sections composed of molecules and atoms. They may have opinions about layout.

This isn't taxonomy for its own sake — it enforces a dependency direction. Atoms never import molecules. Molecules never import organisms. Violations of this hierarchy are bugs.

---

## 3. Tokens are the only source of values

No component ever contains a raw color, spacing value, or timing value. Every value is a CSS custom property generated from `@ds/tokens`. This means:

- A brand color change touches one token, not dozens of component files
- Platform implementations (iOS, Android) consume the same semantic token values
- Tokens are auditable — you can always ask "what uses `brand.500`?"

---

## 4. Accessibility is structural, not cosmetic

WCAG AA compliance is declared in the contract and enforced in the story. It is not a post-launch audit item. Every component ships with:

- A declared ARIA role
- Keyboard interaction patterns documented in the contract
- Zero a11y violations in Storybook before merge

---

## 5. Stories are the spec, not the docs

Storybook stories are not documentation written after the fact. They are the living specification of the component. Every contract variant has a story. Every story has an interaction test. The docs page is generated from contract metadata — never written by hand.

---

## 6. Use primitives for complexity

For components with complex interaction models — focus trapping, keyboard navigation, ARIA state management — use Radix UI primitives. We style them; we don't re-implement them. Rolling your own accordion or dialog is how you ship inaccessible components.

---

## 7. Agents are collaborators, not oracles

The MCP server exists to give agents structured access to contracts. Agents can read contracts, propose updates, and generate implementations — but a human reviews and merges. Agent-generated code is held to the same standards as human-written code: contracts must be valid, tokens must be used, stories must pass.

---

## 8. The system grows deliberately

A component at `status: draft` is a promise, not a delivery. Components are not promoted to `stable` until they are implemented, tested, and accessible. The backlog of draft contracts is intentional — it represents the roadmap, not the current state.

---

## Future directions

These principles extend naturally to:

- **Figma** — contracts → Figma variables and component properties, kept in sync via the API
- **Native platforms** — iOS and Android implementations consume the same contracts and tokens
- **Visual regression** — Chromatic as a CI gate on implementation PRs
- **Doc site** — contract data drives a documentation site; nothing is written by hand
