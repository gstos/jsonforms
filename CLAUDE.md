# This fork (read first)

This is `gstos/jsonforms` — a fork of [`eclipsesource/jsonforms`](https://github.com/eclipsesource/jsonforms). `master` here tracks upstream's alpha branch and is rebased/merged forward from time to time.

## What this fork adds beyond upstream

| Subsystem | Status | Location |
|---|---|---|
| `@jsonforms/svelte` — Svelte 5 framework binding | ✅ Merged (PR #1) | `packages/svelte/` |
| `@jsonforms/svelte-shadcn` — shadcn-svelte renderer set | ✅ Merged (PR #3) | `packages/svelte-shadcn/` |

The Svelte binding was ported 1:1 from `@jsonforms/vue`. If in doubt about binding behavior, consult `packages/vue/src/` — the Svelte counterpart mirrors it.

## Where to find design + plans

- **Specs:** `docs/superpowers/specs/` — brainstormed designs (e.g. `2026-04-24-svelte-shadcn-binding-design.md`)
- **Plans:** `docs/superpowers/plans/` — TDD implementation plans (e.g. `2026-04-24-svelte-binding.md`) and their companion `*-execution.md` dispatch guides

Read the spec before touching Svelte code; read the plan before writing new code for a pending subsystem.

## How we work in this repo

- **Worktrees:** create one per feature branch under `.worktrees/<branch-name>` (gitignored). Use `git worktree add .worktrees/<name> -b feature/<name>`. Install deps via `pnpm --dir /abs/path/to/worktree install`.
- **Node:** project `engines` wants `^22`; `v25.x` works but prints an engine warning — ignore it.
- **pnpm PATH gotcha:** `pnpm` comes from corepack shims and is **not** in the default shell `PATH` subagents inherit. Prepend this to every Bash call that needs `pnpm`:
  ```bash
  export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
  ```
- **Git auth:** `gh auth setup-git` is configured; `~/.git-credentials` should stay empty for github.com (it previously leaked a stale token). Fine-grained PAT must have **Contents: Read and write** and **Pull requests: Read and write** on `gstos/jsonforms`.

## Svelte 5 conventions (learned the hard way)

Applies when editing `packages/svelte/` or planning `packages/svelte-shadcn/`:

1. **File extensions:** rune-using modules must be `.svelte.ts` or `.svelte.js`. Plain `.ts` can't use `$state`/`$derived`/`$effect`.
2. **Cross-module reactivity:** `$derived` captured into a getter snapshots the value at call time. To expose a live derived across module boundaries, wrap in a **Proxy** (per-access re-reads) rather than a plain getter object. See `useControl` in `packages/svelte/src/compositions.svelte.ts`.
3. **Destructuring gotcha:** `const { x } = getBindings()` where `x` is a getter over `$derived` **snapshots** `x` at call time. Destructuring a Proxy is safe. Prefer reading through the binding object (`bindings.x`) for getter-based APIs.
4. **Init reads trigger `state_referenced_locally` warnings:** `svelte-check` flags reads of props inside `$state(...)` initializers as potential bugs. They're cosmetic for init-only reads. Leave or `untrack()` them — document the choice in code.
5. **Dispatch components:** use `{#if X === UnknownRenderer}...{:else}{@const Comp = X}<Comp .../>{/if}`. `<svelte:component>` is deprecated in Svelte 5.
6. **No `createEventDispatcher`:** use callback props (`onchange` etc.) in Svelte 5.
7. **Build artifacts to gitignore per Svelte package:** `.svelte-kit/`, `dist/`. There's a `packages/svelte/.gitignore` for this — replicate for future packages.
8. **Ports of Vue `use*` composables** use the `get*` prefix (e.g. `useJsonFormsControl` → `getJsonFormsControl`) to follow Svelte naming conventions.
9. **Testing:** Vitest + `@testing-library/svelte` + jsdom. Tests live in `tests/` as `.test.ts` + test-fixture `.svelte` components. Vite plugin needs `{ hot: false }` and `resolve.conditions: ['browser']` in `vitest.config.ts`.
10. **`@sveltejs/vite-plugin-svelte` pinned at `^4`**, not `^5` — Vite 5.4 compat constraint in this monorepo.

## General project information

For information on project setup, architecture, and core principles refer to @.prompts/project-info.prompttemplate

## Build Commands

### Full Repository

```bash
pnpm install                  # Install dependencies
pnpm run build                # Build all packages
pnpm run lint                 # Lint all packages
pnpm run lint:fix             # Lint and auto-fix
pnpm run test                 # Test all packages
pnpm run clean                # Clean build artifacts
```

### Single Package (Preferred for Iterative Development)

```bash
# Build
pnpm lerna run build --scope=@jsonforms/core

# Lint
pnpm lerna run lint --scope=@jsonforms/core

# Test
pnpm lerna run test --scope=@jsonforms/core
```

### Package Names

- `@jsonforms/core` - Core utilities (UI-framework independent)
- `@jsonforms/react`, `@jsonforms/angular`, `@jsonforms/vue` - Framework bindings
- `@jsonforms/material-renderers`, `@jsonforms/vanilla-renderers` - React renderer sets
- `@jsonforms/angular-material` - Angular renderer set
- `@jsonforms/vue-vanilla`, `@jsonforms/vue-vuetify` - Vue renderer sets

### Build Order Dependencies

`core` → `react`/`angular`/`vue` → renderer packages.
Lerna automatically respects the build order dependencies.

## Running Example Applications for UI Testing

Each renderer set has its own example application with a dev server. Before starting any dev server, you **must** first install dependencies and build all packages:

```bash
pnpm install                  # Install dependencies (run from repo root)
pnpm run build                # Build all packages (required before dev servers work)
```

All renderer sets share the same set of examples from `packages/examples/`.

### Individual Dev Servers

Start dev servers from the **repo root** using `cd` into the package directory.
Each renderer set example application can be started by executing `pnpm run dev`.

### Combined Examples App (All Renderer Sets)

The combined examples app aggregates all 5 renderer sets into a single static app at `packages/examples-app/dist/`.
It has an index page with links to each renderer set's sub-app.

**Full build (first time or after `clean`):**

```bash
pnpm install                          # Install dependencies
pnpm run build                        # Build all packages (required first)
pnpm run build:examples-app           # Build all example bundles + aggregate into dist
```

**Rebuild after code changes to a specific renderer set:**

```bash
# 1. Rebuild the changed package (and any dependencies that changed)
pnpm lerna run build --scope=@jsonforms/material-renderers

# 2. Rebuild only that renderer set's example bundle
pnpm lerna run build:examples-app --scope=@jsonforms/material-renderers

# 3. Re-aggregate into the combined app
node packages/examples-app/prepare-examples-app.js
```

**Serving the combined app:**

```bash
# No built-in serve script exists - use any static file server:
python3 -m http.server 9090 --directory packages/examples-app/dist
```
