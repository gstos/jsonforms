# Svelte-ShadCN Example Port — Execution Dispatch Guide

Companion to `2026-04-24-svelte-shadcn-example-port.md`. Hand this to a **fresh executor thread** to drive the implementation.

## Prerequisites (verify before starting)

1. **Spec PR merged.** `master` should contain `docs/superpowers/specs/2026-04-24-svelte-shadcn-example-port-design.md`.
   ```bash
   git -C /home/gustavo/Projects/jsonforms checkout master && git pull
   ls /home/gustavo/Projects/jsonforms/docs/superpowers/specs/2026-04-24-svelte-shadcn-example-port-design.md
   ```

2. **Worktree:**
   ```bash
   git -C /home/gustavo/Projects/jsonforms worktree add \
     .worktrees/svelte-shadcn-example-port \
     -b feature/svelte-shadcn-example-port master
   cd /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn-example-port
   ```
   All work happens in `/home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn-example-port`. Do not touch the main checkout.

3. **Install deps:**
   ```bash
   export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
   pnpm --dir /home/gustavo/Projects/jsonforms/.worktrees/svelte-shadcn-example-port install
   ```

## `pnpm` PATH gotcha

`pnpm` comes from corepack shims and is not in the default `PATH` subagents inherit. **Every Bash call that needs `pnpm` must prepend:**

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
```

The `engine: wanted ^22, current v25.x` warning from pnpm is expected; ignore it.

## Parallelism

**This plan is overwhelmingly sequential.** Tasks 2–6 all edit the same single file (`packages/svelte-shadcn/example/src/App.svelte`); each builds on the previous one's state. Do **not** dispatch them in parallel — you'll get merge conflicts on a 150-line file.

The only meaningful parallel opportunity is none. All eight tasks should run in order in a single executor thread (or as one subagent per task, dispatched sequentially).

## Batch plan

| Batch | Task | Subagents | Model | Parallel? | Notes |
|---|---|---|---|---|---|
| 1 | Task 1 (add dep) | 1 | **haiku** | — | Mechanical: edit `package.json`, run install, verify import. No Svelte logic. |
| 2 | Task 2 (skeleton) | 1 | **sonnet** | — | First Svelte 5 file with runes; gets the layout + reactivity foundations right. |
| 3 | Task 3 (selector + reactive example) | 1 | **sonnet** | — | `$derived` + `$effect` interactions; easy to get wrong. |
| 4 | Task 4 (data/schema/uischema viewers) | 1 | **haiku** | — | Three `<details>` blocks, mechanical. |
| 5 | Task 5 (i18n translator) | 1 | **sonnet** | — | Translate-fn swap + JSON parse error handling; small but subtle. |
| 6 | Task 6 (URL hash sync) | 1 | **sonnet** | — | `onMount` + `$effect` interplay, hash invariants. |
| 7 | Task 7 (smoke + build) | 1 | **haiku** | — | Run dev server, click around, run `build`, run `preview`. Mechanical verification. |
| 8 | Task 8 (open PR) | 1 | **haiku** | — | Push branch, run `gh pr create` with the body in the plan. |

**Model rationale:**
- **Sonnet** for Tasks 2, 3, 5, 6 — these touch Svelte 5 runes (`$state`, `$derived`, `$effect`), where reactivity bugs (snapshot vs. live, init-time reads, cross-module reactivity) are easy to introduce. CLAUDE.md flags these as repo-specific sharp edges.
- **Haiku** for Tasks 1, 4, 7, 8 — pure mechanical work: editing JSON, copying boilerplate, running commands, opening a PR with a prepared body.

## Execution prompt (paste into a fresh thread)

```
You are executing the implementation plan at:
/home/gustavo/Projects/jsonforms/docs/superpowers/plans/2026-04-24-svelte-shadcn-example-port.md

Spec it implements:
/home/gustavo/Projects/jsonforms/docs/superpowers/specs/2026-04-24-svelte-shadcn-example-port-design.md

Setup (run once before starting):
1. cd /home/gustavo/Projects/jsonforms
2. git checkout master && git pull
3. git worktree add .worktrees/svelte-shadcn-example-port -b feature/svelte-shadcn-example-port master
4. cd .worktrees/svelte-shadcn-example-port
5. export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
6. pnpm install

Then work through Tasks 1 through 8 in order. Tasks must run sequentially — they all
modify the same single file (packages/svelte-shadcn/example/src/App.svelte). Do not
dispatch tasks in parallel.

Per-task model assignments (use the smallest model that fits):
  Task 1 (add dep)               → haiku
  Task 2 (skeleton)              → sonnet
  Task 3 (selector + reactivity) → sonnet
  Task 4 (data/schema viewers)   → haiku
  Task 5 (i18n translator)       → sonnet
  Task 6 (URL hash sync)         → sonnet
  Task 7 (smoke + build)         → haiku
  Task 8 (open PR)               → haiku

Use the superpowers:subagent-driven-development skill to dispatch one fresh subagent
per task. Review each task's commit before starting the next. The plan's "Self-review
checklist" at the bottom is your final gate before declaring done.

Before declaring complete, confirm:
- All commits land on the feature/svelte-shadcn-example-port branch.
- packages/svelte-shadcn/example/src/App.svelte uses no shadcn primitives in the
  chrome (plain HTML + Tailwind only) and has no outer Card around the form.
- pnpm --filter @jsonforms/svelte-shadcn-example build succeeds.
- The PR is open against master and you have printed its URL.
```

## What to do if something goes wrong

- **`@jsonforms/examples` import fails under Vite.** Don't shim it in the example. Fix the package's `exports` field at `packages/examples/package.json`. The Vue example imports it cleanly today, so this is a low-likelihood failure.
- **A Svelte 5 reactivity warning appears** (`state_referenced_locally` etc.). CLAUDE.md documents these as cosmetic for init-only reads. Decide per-case: silence with `untrack()` if init-only, otherwise fix the reactivity bug.
- **An example throws an uncaught exception.** Don't try to fix the renderer set in this plan. Note the example name + error and surface it as a follow-up issue. The plan accepts rough renders, not crashes — but if a crash blocks you, switch to a different example to keep verifying the shell works.
- **A task is harder than its model can handle.** Escalate to the next size up (haiku → sonnet → opus). Don't burn time fighting the model.
