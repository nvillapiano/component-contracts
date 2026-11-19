# Goals

This is the one-page statement of what Component Contracts is for, what "done" means at each stage, and what is deliberately out of scope. When a task doesn't serve one of these goals, question it before doing it.

---

## Why this exists

Understanding. The author wants to build the Component Contracts idea end to end (contracts, tokens, implementations, Figma, agents) well enough to understand it deeply. Publishing and portability come after that, not before.

The original trigger was the Figma MCP launch. That deadline has passed. It no longer sets priorities.

---

## Two things, kept separate

**Project**: the realization of the idea in one design system. Today this is One North's system: `apps/web`, `apps/web-components`, the token values, the contracts for Button, Accordion, and Text Input.

**Product**: the reusable part that another design system could adopt. The contract format and schema, the validator, the token pipeline, the MCP server, and the Figma skills and builders.

**Boundary (proposed, not yet enforced):** the product lives in `packages/` and is free of One North values. The project supplies its own tokens, contracts, and apps. Nothing in the product should require a One North-specific value to run.

Enforcing this boundary is part of the portability milestone, not the current one.

---

## Goals and milestones

Each goal maps to a GitHub milestone. Milestones are the source of truth for what's in flight.

### M1: Realized PoC (understanding)
Done when:
- Button and Accordion are at visual parity across React and Web Components (ADR-013's 90% gate), tracked in #22.
- Text Input is either implemented in both targets (#17, #18) or set back to `draft`, so contracts match what exists (principle 8).
- The bootstrapper example runs end to end from a clean clone (#39).
- Open decisions are closed: font loading (#40).

### M2: Portable core (product)
Done when:
- A clean clone builds and runs the Figma builders and the MCP server without the maintainer's local files.
- The product boundary above is enforced, meaning no One North values in `packages/`.
- Another team could adopt the contracts, tokens, and validator with a documented setup (#30).
- Contracts can be reverse-engineered from existing designs (#29) and agents can read everything they need in one call (#16).

### M3: Later
Platforms and tooling, pursued only after M1 and M2:
- Native iOS and Android (#28, #14, #15)
- Visual regression (#27, #11, #12)
- Icons, doc site, Figma sync (#23, #19, #10, #4)

---

## Sequencing

The order of work, and why. Live status is on the [project board](https://github.com/users/nvillapiano/projects/1).

1. **Finish M1 first.** It is the smallest step that makes the PoC true. Demote Text Input to `draft` so the repo matches principle 8. Decide #40. Write the bootstrapper guide (#39). Fix the Button and Accordion drift (#22) by comparing the two implementations by hand. Visual regression can wait for Chromatic.
2. **Then M2, starting with the clean-clone fix.** Everything else in M2 assumes a fresh clone builds. Decide the product boundary before writing any portability code. #16 is small and useful for agents, so it is a good early M2 task. Consider deferring #36.
3. **M3 only after M1 and M2.** Chromatic and native work depend on the parity and product-boundary decisions.

---

## Non-goals (for now)

- No SaaS dashboard or hosted service.
- No support for token formats other than W3C DTCG.
- No native platform work until web parity (M1) is done.
- No Chromatic until there is parity to protect (ADR-008).
- No new components beyond Button, Accordion, and Text Input until M1 is done.
- No publishing to npm or a public repo until M2 is done.

---

## Deferred decisions

Decided to wait, with the reason. Revisit when the stated condition holds.

- **One config file** (merge `.component-contracts` and `.env.example`). Agreed in principle. Deferred because there are not yet enough adopting users for it to matter, and the project is pre-1.0. Revisit at 1.0, or when ADR-020 is accepted.
- **Release tooling** (changesets). Open. Installed but unused. Decide before the first publish.
- **Text Input.** Demote to `draft` now (see Sequencing), and implement in M1 when parity work is done.

---

## How to tell we're on track

- Open issues in M1 are shrinking, not growing.
- Each new ADR records a decision actually made, not a future plan.
- The repo's docs match the code. If they disagree, fix the docs in the same PR.
