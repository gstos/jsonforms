# @jsonforms/svelte-shadcn — Execution Dispatch Guide

Companion to `2026-04-24-svelte-shadcn-plan.md`. Hand this to a **fresh executor thread** to drive the implementation.

## Prerequisites (verify before starting)

1. **Phase 1 merged.** `@jsonforms/svelte` must be on `master` (PR #1). Check:
   ```bash
   git -C /home/gustavo/Projects/jsonforms checkout master && git pull
   ls /home/gustavo/Projects/jsonforms/packages/svelte/src/index.ts
   ```
   If `packages/svelte/` is missing, stop — Phase 1 isn't merged yet.

2. **Worktree setup:**
   ```bash
   git -C /home/gustavo/Projects/jsonforms worktree add .worktrees/svelte-shadcn -b feature/svelte-shadcn master
   cd /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn
   ```
   All execution happens in `/home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn`. Do not touch the main checkout.

3. **Install deps into the worktree:**
   ```bash
   export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
   pnpm --dir /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn install
   ```

4. **Confirm binding tests still pass (smoke check):**
   ```bash
   pnpm --filter @jsonforms/svelte test
   ```
   Expect: 36 tests pass. If this fails, something's wrong with the Phase 1 merge — stop.

## `pnpm` PATH gotcha

`pnpm` comes from corepack shims and is not in the default `PATH` subagents inherit. **Every Bash call that needs `pnpm` must prepend:**

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
```

The `engine: wanted ^22, current v25.x` warning from pnpm is expected; ignore it.

## Batch plan

11 batches. The plan's 33 tasks roll up as follows.

| Batch | Tasks | Subagents | Models | Parallel? |
|---|---|---|---|---|
| 1 | Task 1 | 1 | sonnet | — |
| 2a | Task 2 primitives | 11 | haiku × 11 | yes (11-way) |
| 2b | Task 2 barrel | 1 | haiku | after 2a |
| 3 | Task 3 | 1 | sonnet | — |
| 4 | Task 4 | 1 | sonnet | — |
| 5 | Tasks 5–14 (controls) | 10 | haiku × 8, sonnet × 2 | yes (10-way) |
| 6 | Tasks 15–18 (layouts) | 4 | haiku × 3, sonnet × 1 | yes (4-way) |
| 7 | Tasks 19–24 (complex) | 6 | sonnet × 3, haiku × 3 | yes (6-way) |
| 8 | Tasks 25–30 (label + cells) | 6 | haiku × 6 | yes (6-way) |
| 9 | Task 31 (registry aggregation) | 1 | sonnet | — |
| 10 | Task 32 (example app) | 1 | sonnet | — |
| 11 | Task 33 (final verification) | 1 | sonnet | — |

**Model selection rationale:**
- **Haiku** for mechanical, template-driven tasks where the plan spells out the content verbatim (scaffolding config, primitive wrappers with given Tailwind classes, simple controls/cells/layouts).
- **Sonnet** for anything requiring Svelte 5 reactivity reasoning, dynamic component composition, or managing shared-state invariants (ControlWrapper, OneOf/AnyOf dialog flow, Object with sub-uischema generation, ArrayList with multiple props, Categorization with tabs state, registry aggregation, example app, final integration).
- **Opus** unnecessary — the plan is well-specified.

**Escalation rule:** if a subagent fails twice on a task, re-run it on the next tier up (haiku → sonnet, sonnet → opus).

## Parallelism rules (critical)

1. **No two parallel subagents may edit the same file.** Tasks in Phases B/C/D/E each create their own `.svelte` + `.ts` + test file; they do NOT touch the category `index.ts` aggregator — that's a dedicated task (Task 31) after all renderers exist.

2. **Shared-file tasks must be bundled into one subagent** with sequential commits (e.g. if a future change requires touching both `util/index.ts` and `util/cn.ts`, that's one subagent).

3. **Inter-batch dependencies:** must wait for the previous batch's commits to land. Use `git log --oneline -N` to verify.

4. **Number of concurrent agents:** cap at ~11 (Batch 2a is the biggest). Claude Code handles this fine; no throttling needed.

## Shared preamble (prepend to every subagent prompt)

> You are implementing a task from the plan at `/home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn/docs/superpowers/plans/2026-04-24-svelte-shadcn-plan.md`. **Read that file first** — it is the authoritative spec.
>
> Work inside the worktree at `/home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn`. Do NOT touch the main checkout at `/home/gustavo/Projects/jsonforms/`.
>
> For every Bash call that needs `pnpm`, prepend: `export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH" && `
>
> The `engine: wanted ^22, current v25.x` pnpm warning is expected; ignore it.
>
> Your scope is strictly what's listed below. Do not start later tasks. Do not fix unrelated issues. Do not edit files outside `packages/svelte-shadcn/`. If something you need is missing or broken, stop and report — do NOT improvise outside the plan.
>
> Every commit message ends with a `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.

---

## Batch 1 — Task 1 (scaffolding)

**Model:** sonnet
**Parallel:** no
**Prior state:** master HEAD.

### Prompt

> [Shared preamble]
>
> **Your scope:** Task 1 only (package scaffolding through Task 1 Step 8).
>
> Verification commands (worktree root):
> 1. `pnpm install`
> 2. `pnpm lerna run build --scope=@jsonforms/svelte-shadcn`
> 3. `pnpm lerna run test --scope=@jsonforms/svelte-shadcn` — expect "No test files found"
>
> Commit message: `feat(svelte-shadcn): scaffold @jsonforms/svelte-shadcn package`.
>
> Report back: each step's status, commit SHA, warnings.

### Verify before Batch 2a

```bash
cd /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn
git log --oneline -1
ls packages/svelte-shadcn/dist/index.js packages/svelte-shadcn/src/styles/tokens.css packages/svelte-shadcn/src/util/cn.ts
```

---

## Batch 2a — Task 2 UI primitives (11 parallel)

**Models:** haiku × 11
**Parallel:** yes — **dispatch all 11 subagents in the same message**

Each subagent handles one primitive group. Each creates its own files under `packages/svelte-shadcn/src/ui/<group>/` with no overlap. No test files (primitives are covered transitively by renderer tests).

### Prompt template — adapt `<GROUP>` and `<FILES>` per row

> [Shared preamble]
>
> **Your scope:** Task 2 primitive group `<GROUP>` only.
>
> Create the following files under `packages/svelte-shadcn/src/ui/<GROUP>/`:
> <FILES>
>
> Each file is a thin wrapper per the plan's Task 2 pattern — `bits-ui` import (or plain element), a typed `$props()`, Tailwind classes applied via `cn()`, `{...rest}` spread onto the underlying element.
>
> Do NOT touch `packages/svelte-shadcn/src/ui/index.ts` (barrel) — that's a separate task (Batch 2b).
>
> Verification:
> ```bash
> pnpm lerna run build --scope=@jsonforms/svelte-shadcn
> ```
> Must succeed (the primitive is importable but not yet in the barrel).
>
> Commit: `feat(svelte-shadcn): add <GROUP> primitive wrapper`.
>
> Report: commit SHA, file count.

### The 11 parallel subagents

Run these 11 in a single message:

| Subagent | GROUP | FILES |
|---|---|---|
| 2a.1 | button | `button.svelte` |
| 2a.2 | input | `input.svelte` |
| 2a.3 | textarea | `textarea.svelte` |
| 2a.4 | label | `label.svelte` |
| 2a.5 | checkbox | `checkbox.svelte` |
| 2a.6 | select | `select.svelte`, `select-trigger.svelte`, `select-content.svelte`, `select-item.svelte` |
| 2a.7 | slider | `slider.svelte` |
| 2a.8 | card | `card.svelte`, `card-header.svelte`, `card-title.svelte`, `card-content.svelte` |
| 2a.9 | tabs | `tabs.svelte`, `tabs-list.svelte`, `tabs-trigger.svelte`, `tabs-content.svelte` |
| 2a.10 | alert-dialog | 8 files per plan Task 2 table |
| 2a.11 | separator | `separator.svelte` |

### Verify before Batch 2b

```bash
cd /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn
git log --oneline -12   # expect 11 new commits from 2a + scaffold from batch 1
ls packages/svelte-shadcn/src/ui | sort   # 11 directories
```

---

## Batch 2b — UI barrel

**Model:** haiku
**Parallel:** no (waits for Batch 2a)

### Prompt

> [Shared preamble]
>
> **Your scope:** create `packages/svelte-shadcn/src/ui/index.ts` per Task 2 Step 2 of the plan — a barrel re-exporting all primitive components.
>
> Verification:
> ```bash
> pnpm lerna run build --scope=@jsonforms/svelte-shadcn
> pnpm --filter @jsonforms/svelte-shadcn lint
> ```
>
> Commit: `feat(svelte-shadcn): add UI primitive barrel export`.

---

## Batch 3 — Task 3 composition utilities

**Model:** sonnet
**Parallel:** no

### Prompt

> [Shared preamble]
>
> **Your scope:** Task 3 only (`useShadcnControl`, `useShadcnLayout`, `useShadcnArrayControl` + test).
>
> **Important:** the plan shows `childUiSchema` in `useShadcnArrayControl` as a placeholder. Replace it with the real implementation using `findUISchema` from `@jsonforms/core` as shown below the placeholder.
>
> Verification:
> ```bash
> pnpm --filter @jsonforms/svelte-shadcn test
> ```
>
> Commit: `feat(svelte-shadcn): add shadcn composition utilities`.
>
> Report: composition test results and the real `findUISchema` invocation you ended up using.

---

## Batch 4 — Task 4 ControlWrapper

**Model:** sonnet
**Parallel:** no

### Prompt

> [Shared preamble]
>
> **Your scope:** Task 4 only (`ControlWrapper.svelte` + test).
>
> Verification: `pnpm --filter @jsonforms/svelte-shadcn test` — both new wrapper tests plus Batch 3's tests must pass.
>
> Commit: `feat(svelte-shadcn): add shared ControlWrapper component`.

---

## Batch 5 — Control renderers (10 parallel)

**Models:** 8 × haiku, 2 × sonnet
**Parallel:** yes — dispatch all 10 in the same message

Each subagent creates `.svelte` + `.ts` + `.test.ts` for one control. None touches `src/controls/index.ts`.

### Prompt template

> [Shared preamble]
>
> **Your scope:** Task <N> (<NAME>ControlRenderer) only.
>
> Follow the plan's template at the top of Phase B. Use the variation details from Task <N>.
>
> Verification: `pnpm --filter @jsonforms/svelte-shadcn test` — your new tests plus all earlier tests must pass.
>
> Commit: `feat(svelte-shadcn): add <NAME>ControlRenderer`.
>
> Do NOT modify `src/controls/index.ts`. Do NOT touch other renderers.

### The 10 parallel subagents

| Subagent | Task | Control | Model |
|---|---|---|---|
| 5.1 | Task 5 | StringControl | haiku |
| 5.2 | Task 6 | NumberControl | haiku |
| 5.3 | Task 7 | IntegerControl | haiku |
| 5.4 | Task 8 | BooleanControl | haiku |
| 5.5 | Task 9 | EnumControl | haiku |
| 5.6 | Task 10 | OneOfEnumControl | haiku |
| 5.7 | Task 11 | MultiStringControl | haiku |
| 5.8 | Task 12 | DateControl | haiku |
| 5.9 | Task 13 | DateTimeControl | haiku |
| 5.10 | Task 14 | SliderControl | sonnet (Slider integration + derived state) |

If any subagent blocks on tester-import naming (e.g. `isRangeControl` not found), report back; upgrade that one to sonnet.

### Verify before Batch 6

```bash
git log --oneline -11   # 10 new commits + Batch 4 commit
ls packages/svelte-shadcn/src/controls/*.svelte | wc -l   # 10
pnpm --filter @jsonforms/svelte-shadcn test   # all new control tests pass
```

---

## Batch 6 — Layout renderers (4 parallel)

**Models:** 3 × haiku (Vertical, Horizontal, Group), 1 × sonnet (Categorization)
**Parallel:** yes — dispatch all 4 in the same message

### Prompts — one per layout (analogous to Batch 5 template)

| Subagent | Task | Layout | Model |
|---|---|---|---|
| 6.1 | Task 15 | VerticalLayout | haiku |
| 6.2 | Task 16 | HorizontalLayout | haiku |
| 6.3 | Task 17 | Group | haiku |
| 6.4 | Task 18 | Categorization | sonnet (tab state binding, `getJsonFormsCategorization`, bits-ui Tabs API verification) |

---

## Batch 7 — Complex renderers (6 parallel)

**Models:** 3 × sonnet (Object, ArrayList, OneOf), 3 × haiku (AnyOf, AllOf, EnumArray)
**Parallel:** yes — dispatch all 6 in the same message

### Prompts — one per complex renderer

| Subagent | Task | Renderer | Model | Notes |
|---|---|---|---|---|
| 7.1 | Task 19 | Object | sonnet | Sub-uischema generation via `Generate.uiSchema` |
| 7.2 | Task 20 | ArrayList + Element | sonnet | ONE subagent handles both files — most complex single renderer |
| 7.3 | Task 21 | OneOf | sonnet | Dialog confirmation flow |
| 7.4 | Task 22 | AnyOf | haiku | Near-copy of OneOf; executor may copy OneOf's commit as reference |
| 7.5 | Task 23 | AllOf | haiku | Simple — no selection, just dispatch each sub-schema |
| 7.6 | Task 24 | EnumArray | haiku | Checkbox group over enum options |

**Coordination risk:** 7.4 (AnyOfRenderer) is nearly identical to 7.3 (OneOfRenderer). If 7.3 lands before 7.4 starts, 7.4's subagent can reference it. If they run truly concurrent, 7.4 works independently from the plan's Task 22 spec without reading 7.3's output — slightly less efficient but correct. Accept this.

### Verify before Batch 8

```bash
git log --oneline -7   # 6 new commits from Batch 7
ls packages/svelte-shadcn/src/complex/*.svelte packages/svelte-shadcn/src/array/*.svelte
pnpm --filter @jsonforms/svelte-shadcn test
```

---

## Batch 8 — Label + Cells (6 parallel)

**Models:** haiku × 6
**Parallel:** yes — dispatch all 6 in the same message

| Subagent | Task | Renderer | Model |
|---|---|---|---|
| 8.1 | Task 25 | LabelRenderer | haiku |
| 8.2 | Task 26 | TextCell | haiku |
| 8.3 | Task 27 | NumberCell | haiku |
| 8.4 | Task 28 | IntegerCell | haiku |
| 8.5 | Task 29 | BooleanCell | haiku |
| 8.6 | Task 30 | EnumCell | haiku |

### Verify before Batch 9

```bash
git log --oneline -7
ls packages/svelte-shadcn/src/labels/*.svelte packages/svelte-shadcn/src/cells/*.svelte
pnpm --filter @jsonforms/svelte-shadcn test
```

---

## Batch 9 — Registry aggregation

**Model:** sonnet
**Parallel:** no

### Prompt

> [Shared preamble]
>
> **Your scope:** Task 31 only (aggregate registries).
>
> Create the six category `index.ts` files, `src/renderers.ts`, `src/cells.ts`, and rewrite `src/index.ts` per plan Task 31.
>
> Verification:
> ```bash
> pnpm --filter @jsonforms/svelte-shadcn test
> pnpm lerna run build --scope=@jsonforms/svelte-shadcn
> pnpm --filter @jsonforms/svelte-shadcn lint
> ```
> All must pass.
>
> Commit: `feat(svelte-shadcn): aggregate renderers and cells into public registries`.

---

## Batch 10 — Example app

**Model:** sonnet
**Parallel:** no

### Prompt

> [Shared preamble]
>
> **Your scope:** Task 32 only (example app).
>
> Note: Step 7 (running the dev server) is optional during automated execution — if the subagent's environment can't run a long-lived dev server, skip the interactive check and rely on `pnpm example:build` (Step 8) to verify the app compiles end-to-end.
>
> Commit: `feat(svelte-shadcn): add example app`.

---

## Batch 11 — Final verification

**Model:** sonnet
**Parallel:** no

### Prompt

> [Shared preamble]
>
> **Your scope:** Task 33 only (final verification) + report.
>
> Run:
> 1. `pnpm lerna run build --scope=@jsonforms/svelte-shadcn`
> 2. `pnpm --filter @jsonforms/svelte-shadcn test`
> 3. `pnpm --filter @jsonforms/svelte-shadcn lint`
> 4. `pnpm run build` (full monorepo)
> 5. Inspect `packages/svelte-shadcn/dist/` contents
>
> All must succeed. Report: test count, lint status, publint status, full `dist/` listing, last 20 lines of the monorepo build output, any warnings worth reviewing.
>
> If a cleanup commit is needed, apply it with message `fix(svelte-shadcn): <what>`.

---

## Final-branch state

After Batch 11, the branch should contain ~36–40 commits on top of `master`:

```
(optional) fix(svelte-shadcn): ...            ← Batch 11 cleanup if any
feat(svelte-shadcn): add example app          ← Batch 10
feat(svelte-shadcn): aggregate renderers ...  ← Batch 9
feat(svelte-shadcn): add TextCell             ← Batch 8 × 6
...
feat(svelte-shadcn): add LabelRenderer
feat(svelte-shadcn): add EnumArrayRenderer    ← Batch 7 × 6
...
feat(svelte-shadcn): add ObjectRenderer
feat(svelte-shadcn): add CategorizationRenderer ← Batch 6 × 4
...
feat(svelte-shadcn): add VerticalLayoutRenderer
feat(svelte-shadcn): add SliderControlRenderer ← Batch 5 × 10
...
feat(svelte-shadcn): add StringControlRenderer
feat(svelte-shadcn): add shared ControlWrapper ← Batch 4
feat(svelte-shadcn): add shadcn composition utilities ← Batch 3
feat(svelte-shadcn): add UI primitive barrel export ← Batch 2b
feat(svelte-shadcn): add separator primitive wrapper ← Batch 2a × 11
...
feat(svelte-shadcn): add button primitive wrapper
feat(svelte-shadcn): scaffold @jsonforms/svelte-shadcn package ← Batch 1
```

## Branch to PR

After Batch 11 finishes:

```bash
cd /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn
git push -u origin feature/svelte-shadcn
gh pr create --base master --head feature/svelte-shadcn --title "feat(svelte-shadcn): add @jsonforms/svelte-shadcn renderer set" --body "..."
```

Then return to the manager thread (`manager:jsonforms-svelte`) for final review, just like Phase 1.

## Known escape hatches

- **bits-ui API drift:** if a primitive's API differs from what the plan expects, stop that one subagent, report the diff, and update the plan (bump to sonnet if needed).
- **Tailwind v4 class-not-recognized errors at runtime:** usually means the consumer (example app) didn't `@import "tailwindcss"`. Verify the example's `app.css` loads before debugging further.
- **`$props()` typing failures on intersection types:** fall back to a plain `let { x, y } = $props()` with runtime `any` cast in a small number of spots, rather than fighting `svelte-check`. Note the workaround in the commit message.
- **Test flakes on AlertDialog:** bits-ui dialogs portal their content. `@testing-library/svelte`'s `getByText` should work without extra config, but if the test fails, use `screen.findByRole('alertdialog', ...)` or `within(document.body)`.

## Handoff to review

When Batch 11 is done:
1. Post the PR URL back in the manager thread
2. Summarize any plan deviations (agents should surface them in their reports — aggregate them in the PR description)
3. Flag the `svelte-check` warning count (expect ~30–50 `state_referenced_locally` cosmetic warnings, same class as Phase 1)
