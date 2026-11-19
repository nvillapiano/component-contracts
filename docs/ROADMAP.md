# Roadmap

Where the project stands, what's open, and the order I'd work in. The goals behind it are in [GOALS.md](./GOALS.md). Live status lives on the [Component Contracts project board](https://github.com/users/nvillapiano/projects/1). This file is the narrative: what exists, what's open in each milestone, and the order to work in. Update it when a milestone changes state, not when an issue moves.

Status as of 2026-11-19. This date is when the narrative was last checked against the repo and the board, in `YYYY-MM-DD` format. Update it whenever this file changes, even if only one section does.

---

## 1. What exists

### Contracts and validation
- Schema: `packages/schema` (JSON Schema plus generated TypeScript types). Validated with AJV in `apps/validator`.
- Three contracts in `packages/contracts/src`:

| Contract | Version | Status field | Implemented |
|---|---|---|---|
| Button | 2.3.0 | stable | React and Web Components |
| Accordion | 0.2.2 | draft | React and Web Components |
| Text Input | 1.2.0 | **stable** | **Neither** (see open problems) |

### Tokens
- `packages/tokens` in W3C DTCG format, with three tiers:
  - Primitive: color, space, shape, typography, motion
  - Semantic: one file, `semantic/semantic.tokens.json`
  - Component: `button` and `accordion` (ADR-018)
- Style Dictionary builds CSS and JSON. CI runs `tokens:build` on every PR.

### Web implementations
- `apps/web` (React, Vite, Storybook 8.6.18): Button (CVA) and Accordion (CVA plus Radix). Stories cover each variant. Playwright and the Storybook test runner run in CI. `ContractTokenTable` and `FigmaReference` render docs from contract data.
- `apps/web-components` (Storybook 8.6.18 with `@storybook/web-components-vite`): Button and Accordion, with stories.

### Agent tooling
- MCP server, `packages/mcp-server`, with 11 tools:
  - Contract tools: `get_contract`, `list_contracts`, `update_contract`, `diff_contract`, `find_by_token`, `get_platform_context`
  - Token and validation tools: `read_token_file`, `list_token_files`, `validate_contract`
  - Build tools: `build_tokens` and `build_component`, which run the Figma builders locally
- Figma builders: `packages/figma-tokens` and `packages/figma-component`, driven by five scripts in `scripts/`.
- Figma Agent skills in `skills/`: `cc-figma-tokens` and `cc-figma-components`. These are the published, Community-facing skills. Figma Agent can upload files but cannot run the `pnpm` builders.

### Process
- 19 ADRs in `docs/decisions.md`. The Figma-generation ADRs are 015 through 019.
- CI (`.github/workflows/ci.yml`): commit lint, contract validation, token build, and web tests. Runners are pinned to `ubuntu-24.04` (#44).
- AI review on every PR (`review.yml`).
- Commit scopes are restricted in `commitlint.config.cjs`.

### History, briefly
- March 2026: scaffold, contracts, tokens, Storybook, MCP.
- May 2026: Button and Accordion built out, contrast fixes, validator token-path checks.
- August 2026: Figma API builders and skills (#34 through #38), then cleanup, goals, and CI fixes (#41 through #46).

---

## 2. What's open, by milestone

Issues, status, and areas live on the project board. Milestones are M1 (PoC), M2 (portable core), and M3 (later). Definitions are in [GOALS.md](./GOALS.md).

- **M1: Realized PoC (5 open).** Text Input in both targets or back to draft; visual parity for Button and Accordion (#22); bootstrapper guide (#39); font-loading decision (#40).
- **M2: Portable core (5 open).** Portability and product boundary (#30, ADR-020 pending); reverse-engineering contracts (#29); `get_agent_context` (#16); token consolidation (#36, proposed to defer); platform-aware generation (#37).
- **M3: Later (10 open).** Native (#28, #14, #15); Chromatic (#27, #11, #12); Figma sync (#10, #4); icons and doc site (#23, #19).

## 3. Open problems I found, not yet tracked as issues

These were found by reading the repo, not by running it. Each one needs confirming before it becomes an issue. You asked me to flag before creating issues.

1. **A fresh clone can't run the Figma builders.** `scripts/build-figma-*.ts` import `packages/*/dist/index.js`. `dist/` is gitignored, and the root scripts don't build packages first. Likely fix: a `prebuild` step, or a `build:figma` script that builds the two packages first. Blocks the M2 "clean clone" criterion. I haven't confirmed this in a clean clone.
2. **Text Input is `stable` with no implementation.** Principle 8 says draft contracts aren't promoted until they're implemented. Demoting it to `draft` is a one-line change that makes the repo accurate. Implementing it can wait for M1.
3. **Stale remote branches.** Several merged branches are still on origin, and `docs/adr-015-portability` is unmerged with no PR. Deleting merged branches needs your OK.
4. **Pre-existing type error** in `scripts/generate-figma-components.ts`. The file is superseded (#45), so this is low priority.
5. **Dependency currency is unverified.** Storybook is pinned at 8.6.18 and Playwright resolves to 1.60. I haven't run `pnpm outdated`.

---

## 4. Recommended order

1. **Finish M1 first.** It's the smallest step that makes the PoC true.
   - Demote Text Input to `draft` (problem 2). Quick, and it makes the repo honest.
   - Decide #40 and close it, with the decision recorded in the issue.
   - Write `docs/BOOTSTRAPPER.md` for #39 using the tracked test data.
   - Fix the Button and Accordion drift in #22 by comparing the two implementations by hand. Chromatic (#27) comes later, so visual parity doesn't wait on it.
2. **Then M2, starting with the clean-clone fix** (problem 1). Everything else in M2 assumes a fresh clone works.
   - Renumber the portability ADR to ADR-020 and open its PR.
   - Decide the product boundary (see GOALS.md) before writing any portability code.
   - #16 is small and useful for agents, so it's a good early M2 task.
   - Consider deferring #36. It's a refactor with little current payoff.
3. **M3 only after M1 and M2.** Chromatic and native work depend on the parity and product-boundary decisions.

---

## 5. Decisions only you can make

- **Which skill name to publish.** PR #46 kept `cc-figma-components` to match the Community listing. Confirm, or reverse it.
- **Whether Text Input should be demoted now or implemented in M1.** My recommendation is to demote it.
- **Whether to publish the Figma skills.** I don't know whether the Community submission happened. Nothing in the repo records it.
- **Whether to close #36** rather than carry it as M2 work.
- **Whether the product is publicly available eventually**, and when that becomes a goal. Currently it's an M2 criterion but not a commitment.
