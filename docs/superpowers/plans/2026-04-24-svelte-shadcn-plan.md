# @jsonforms/svelte-shadcn Implementation Plan (Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. A companion execution dispatch guide at `2026-04-24-svelte-shadcn-execution.md` contains the parallelization + model-selection strategy.

**Goal:** Add `@jsonforms/svelte-shadcn`, a renderer set built on `bits-ui` + Tailwind CSS v4 that plugs into `@jsonforms/svelte` (Phase 1) and provides full-parity coverage of `@jsonforms/vue-vanilla`'s renderer inventory (~28 component files).

**Architecture:** Self-contained package — ships its own thin wrappers on `bits-ui` primitives (Input, Checkbox, Select, Card, Tabs, AlertDialog, etc.) plus a shadcn-svelte-compatible token stylesheet. Each renderer is a `.svelte` + `.ts` entry pair exporting `{ renderer, tester }`. The top-level `shadcnRenderers` / `shadcnCells` arrays aggregate category sub-arrays.

**Tech Stack:** Svelte 5, TypeScript, Tailwind CSS v4, bits-ui v1.x, `@sveltejs/package`, Vite 5, Vitest + @testing-library/svelte. Peer-deps on `@jsonforms/core`, `@jsonforms/svelte`, `svelte >=5`, `bits-ui`, `clsx`, `tailwind-merge`, `tailwindcss >=4`.

**Reference:**
- Spec: `docs/superpowers/specs/2026-04-24-svelte-shadcn-binding-design.md`
- Phase 1 plan (binding): `docs/superpowers/plans/2026-04-24-svelte-binding.md`
- Phase 1 execution: `docs/superpowers/plans/2026-04-24-svelte-binding-execution.md`
- Phase 1 code on `master` after PR #1 merges

**Prerequisite:** Phase 1 (`@jsonforms/svelte`) must be merged to `master` before Phase 2 execution starts — the binding's composition functions and `JsonForms` component are hard dependencies. The plan assumes `@jsonforms/svelte` is importable via `workspace:*`.

---

## Baked-in tech decisions (resolved upfront so subagents don't have to)

| Decision | Choice | Rationale |
|---|---|---|
| Tailwind major version | v4 (`^4.0.0`) | Spec mandates; modern `@import "tailwindcss"` + `@theme` syntax |
| Tailwind config approach | CSS-first (no `tailwind.config.js`) | Tailwind v4 convention |
| `bits-ui` version | `^1.3.0` (latest stable v1) | Stable API; v2 still pre-release at plan time |
| CSS variable theme | Ship `src/styles/tokens.css` with shadcn defaults (light + dark) | Self-contained; users import it |
| Class utility | `clsx` + `tailwind-merge` via a local `cn()` helper | Standard shadcn-svelte convention |
| UI primitive structure | One file per primitive group under `src/ui/<group>/` (e.g. `src/ui/card/card.svelte`, `card-header.svelte`) | Matches shadcn-svelte source layout |
| Example app bundler | Vite (separate `example/vite.config.ts`) | Standard Svelte app stack |
| Example app Tailwind setup | Import `@jsonforms/svelte-shadcn/styles/tokens.css` + add `@import "tailwindcss"` in app css | User-side setup doc will mirror this |
| Test fixtures | Lean — render `<JsonForms renderers={[underTest, ...]} />` with minimal schema per test | Tests real integration, not unit-mocks |
| Categorization tabs backing | `bits-ui` Tabs primitive | Same primitive used for a generic Tabs UI component |
| Group visual container | `Card` + `CardHeader` + `CardContent` | Per spec inventory |

---

## Package structure (all paths under `packages/svelte-shadcn/`)

```
packages/svelte-shadcn/
├── package.json
├── tsconfig.json
├── svelte.config.js
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.cjs
├── .gitignore
├── README.md
├── src/
│   ├── index.ts                      # Public exports (renderers, cells, util, ui)
│   ├── renderers.ts                  # shadcnRenderers aggregate
│   ├── cells.ts                      # shadcnCells aggregate
│   ├── styles/
│   │   └── tokens.css                # shadcn CSS variables (light+dark)
│   ├── util/
│   │   ├── index.ts                  # re-exports
│   │   ├── cn.ts                     # clsx + tailwind-merge helper
│   │   └── composition.svelte.ts     # useShadcnControl, useShadcnLayout, useShadcnArrayControl
│   ├── ui/                           # bits-ui thin wrappers
│   │   ├── button/button.svelte
│   │   ├── input/input.svelte
│   │   ├── textarea/textarea.svelte
│   │   ├── label/label.svelte
│   │   ├── checkbox/checkbox.svelte
│   │   ├── select/
│   │   │   ├── select.svelte         # root
│   │   │   ├── select-trigger.svelte
│   │   │   ├── select-content.svelte
│   │   │   └── select-item.svelte
│   │   ├── slider/slider.svelte
│   │   ├── card/
│   │   │   ├── card.svelte
│   │   │   ├── card-header.svelte
│   │   │   ├── card-title.svelte
│   │   │   └── card-content.svelte
│   │   ├── tabs/
│   │   │   ├── tabs.svelte
│   │   │   ├── tabs-list.svelte
│   │   │   ├── tabs-trigger.svelte
│   │   │   └── tabs-content.svelte
│   │   ├── alert-dialog/
│   │   │   ├── alert-dialog.svelte
│   │   │   ├── alert-dialog-trigger.svelte
│   │   │   ├── alert-dialog-content.svelte
│   │   │   ├── alert-dialog-title.svelte
│   │   │   ├── alert-dialog-description.svelte
│   │   │   ├── alert-dialog-footer.svelte
│   │   │   ├── alert-dialog-action.svelte
│   │   │   └── alert-dialog-cancel.svelte
│   │   ├── separator/separator.svelte
│   │   └── index.ts                  # barrel re-export
│   ├── ControlWrapper.svelte
│   ├── controls/
│   │   ├── index.ts                  # controlRenderers array
│   │   ├── StringControlRenderer.svelte
│   │   ├── StringControlRenderer.ts
│   │   ├── NumberControlRenderer.svelte
│   │   ├── NumberControlRenderer.ts
│   │   ├── IntegerControlRenderer.svelte
│   │   ├── IntegerControlRenderer.ts
│   │   ├── BooleanControlRenderer.svelte
│   │   ├── BooleanControlRenderer.ts
│   │   ├── EnumControlRenderer.svelte
│   │   ├── EnumControlRenderer.ts
│   │   ├── OneOfEnumControlRenderer.svelte
│   │   ├── OneOfEnumControlRenderer.ts
│   │   ├── MultiStringControlRenderer.svelte
│   │   ├── MultiStringControlRenderer.ts
│   │   ├── DateControlRenderer.svelte
│   │   ├── DateControlRenderer.ts
│   │   ├── DateTimeControlRenderer.svelte
│   │   ├── DateTimeControlRenderer.ts
│   │   ├── SliderControlRenderer.svelte
│   │   └── SliderControlRenderer.ts
│   ├── layouts/
│   │   ├── index.ts
│   │   ├── VerticalLayoutRenderer.svelte
│   │   ├── VerticalLayoutRenderer.ts
│   │   ├── HorizontalLayoutRenderer.svelte
│   │   ├── HorizontalLayoutRenderer.ts
│   │   ├── GroupRenderer.svelte
│   │   ├── GroupRenderer.ts
│   │   ├── CategorizationRenderer.svelte
│   │   └── CategorizationRenderer.ts
│   ├── complex/
│   │   ├── index.ts
│   │   ├── ObjectRenderer.svelte
│   │   ├── ObjectRenderer.ts
│   │   ├── OneOfRenderer.svelte
│   │   ├── OneOfRenderer.ts
│   │   ├── AnyOfRenderer.svelte
│   │   ├── AnyOfRenderer.ts
│   │   ├── AllOfRenderer.svelte
│   │   ├── AllOfRenderer.ts
│   │   ├── EnumArrayRenderer.svelte
│   │   └── EnumArrayRenderer.ts
│   ├── array/
│   │   ├── index.ts
│   │   ├── ArrayListRenderer.svelte
│   │   ├── ArrayListRenderer.ts
│   │   └── ArrayListElement.svelte
│   ├── labels/
│   │   ├── index.ts
│   │   ├── LabelRenderer.svelte
│   │   └── LabelRenderer.ts
│   └── cells/
│       ├── index.ts
│       ├── TextCell.svelte
│       ├── TextCell.ts
│       ├── NumberCell.svelte
│       ├── NumberCell.ts
│       ├── IntegerCell.svelte
│       ├── IntegerCell.ts
│       ├── BooleanCell.svelte
│       ├── BooleanCell.ts
│       ├── EnumCell.svelte
│       └── EnumCell.ts
├── tests/
│   ├── setup.ts
│   ├── testHelper.ts                 # mountWithForm helper, schema builders
│   ├── controls/                     # one .test.ts per control
│   ├── layouts/
│   ├── complex/
│   ├── array/
│   ├── labels/
│   └── cells/
└── example/
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── src/
        ├── main.ts
        ├── App.svelte
        └── app.css
```

---

## Phase overview

| Phase | Tasks | Produces | Parallel within phase? |
|---|---|---|---|
| A | 1–4 | Package scaffold, UI primitives, composition utils, ControlWrapper | Task 2 sub-tasks in parallel |
| B | 5–14 | 10 control renderers | Yes — 10-way |
| C | 15–18 | 4 layout renderers | Yes — 4-way |
| D | 19–24 | 6 complex renderers (Object, ArrayList+Element, OneOf, AnyOf, AllOf, EnumArray) | Partial — array is one unit |
| E | 25–30 | 1 label + 5 cells | Yes — 6-way |
| F | 31–33 | Aggregate registries, example app, full build | Sequential |

Total: 33 tasks. Each task is TDD (tests first) and produces a commit.

**Parallelism rule:** different subagents must not edit the same file. Phase B/C/E render each component as a self-contained unit (`Foo.svelte` + `Foo.ts` + `Foo.test.ts`) and leave the aggregator (`index.ts`) alone until a dedicated assembly task in Phase F. This eliminates merge conflicts.

---

## Phase A: Foundations (sequential)

### Task 1: Package scaffolding

**Files:**
- Create: `packages/svelte-shadcn/package.json`
- Create: `packages/svelte-shadcn/tsconfig.json`
- Create: `packages/svelte-shadcn/svelte.config.js`
- Create: `packages/svelte-shadcn/vite.config.ts`
- Create: `packages/svelte-shadcn/vitest.config.ts`
- Create: `packages/svelte-shadcn/.eslintrc.cjs`
- Create: `packages/svelte-shadcn/.gitignore`
- Create: `packages/svelte-shadcn/README.md`
- Create: `packages/svelte-shadcn/src/index.ts` (placeholder `export {};`)
- Create: `packages/svelte-shadcn/src/styles/tokens.css`
- Create: `packages/svelte-shadcn/src/util/cn.ts`
- Create: `packages/svelte-shadcn/src/util/index.ts`
- Create: `packages/svelte-shadcn/tests/setup.ts`
- Create: `packages/svelte-shadcn/tests/testHelper.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "@jsonforms/svelte-shadcn",
  "version": "3.8.0-alpha.0",
  "description": "Svelte 5 shadcn-style renderer set for JSON Forms",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/eclipsesource/jsonforms.git",
    "directory": "packages/svelte-shadcn"
  },
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "keywords": [
    "svelte",
    "svelte5",
    "shadcn",
    "bits-ui",
    "tailwindcss",
    "form",
    "forms",
    "json",
    "jsonforms",
    "jsonschema"
  ],
  "type": "module",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./styles/tokens.css": "./dist/styles/tokens.css"
  },
  "files": [
    "dist/*",
    "src/*"
  ],
  "scripts": {
    "build": "svelte-package --input src --output dist && publint",
    "clean": "rimraf dist",
    "lint": "eslint . && svelte-check --tsconfig ./tsconfig.json",
    "lint:fix": "eslint --fix .",
    "test": "vitest run",
    "test:watch": "vitest",
    "dev": "cd example && vite",
    "example:build": "cd example && vite build"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@jsonforms/core": "workspace:*",
    "@jsonforms/svelte": "workspace:*",
    "@sveltejs/package": "^2.3.7",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/svelte": "^5.2.4",
    "@types/node": "^22.13.8",
    "@typescript-eslint/eslint-plugin": "^5.54.1",
    "@typescript-eslint/parser": "^5.54.1",
    "bits-ui": "^1.3.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^8.7.0",
    "eslint-plugin-svelte": "^2.46.0",
    "jsdom": "^25.0.1",
    "prettier": "^2.8.4",
    "prettier-plugin-svelte": "^3.3.2",
    "publint": "^0.2.12",
    "rimraf": "^6.1.0",
    "svelte": "^5.16.0",
    "svelte-check": "^4.1.1",
    "tailwindcss": "^4.0.0",
    "tslib": "^2.5.0",
    "typescript": "~5.5.0",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  },
  "peerDependencies": {
    "@jsonforms/core": "3.8.0-alpha.0",
    "@jsonforms/svelte": "3.8.0-alpha.0",
    "bits-ui": "^1.0.0",
    "svelte": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`, `svelte.config.js`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.gitignore`, `README.md`**

Use the exact content from Phase 1's plan Task 1 (packages/svelte) with the package name swapped to `@jsonforms/svelte-shadcn`. `.gitignore` should contain `dist/`, `.svelte-kit/`, `node_modules/`. The `README.md` should briefly describe the renderer set and point to `styles/tokens.css` as required user import.

- [ ] **Step 3: Create `src/styles/tokens.css`** — shadcn-svelte default tokens (light + dark)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 72.2% 50.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5% 64.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}
```

- [ ] **Step 4: Create `src/util/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class lists with de-duplication. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Create `src/util/index.ts`**

```ts
export { cn } from './cn';
```

- [ ] **Step 6: Create `tests/setup.ts` + `tests/testHelper.ts`**

`setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

`testHelper.ts`:
```ts
import type {
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';

export interface MountFormArgs {
  schema: JsonSchema;
  uischema?: UISchemaElement;
  data?: unknown;
  renderers: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

/** Re-export for convenience so test files don't need to know import paths. */
export { JsonForms } from '@jsonforms/svelte';
```

- [ ] **Step 7: Install + verify empty build**

Run from worktree root:
```bash
pnpm install
pnpm lerna run build --scope=@jsonforms/svelte-shadcn
```

Expected: build succeeds (svelte-package emits `dist/`).

- [ ] **Step 8: Commit**

```bash
git add packages/svelte-shadcn pnpm-lock.yaml
git commit -m "feat(svelte-shadcn): scaffold @jsonforms/svelte-shadcn package"
```

---

### Task 2: UI primitives (wrappers on bits-ui)

**Strategy:** One component file per primitive piece. Each is a thin wrapper: accept `class` / other props, apply Tailwind classes via `cn()`, delegate to the corresponding `bits-ui` component.

**Parallelism note:** The 11 primitive groups are independent and can be parallelized (see execution dispatch guide). Within a group (e.g. Select has 4 files), keep them in one subagent since they share conventions.

**Test note:** UI primitives are covered transitively by renderer tests in later phases. No dedicated unit tests for primitives unless behavior is non-trivial (e.g. AlertDialog state handling).

**Files (one per row; `.svelte` only):**

| Group | Files | bits-ui source | Tailwind classes (starter) |
|---|---|---|---|
| button | `button.svelte` | (plain `<button>`, no bits-ui) | `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50` |
| input | `input.svelte` | (plain `<input>`) | `flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50` |
| textarea | `textarea.svelte` | (plain `<textarea>`) | `flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50` |
| label | `label.svelte` | (plain `<label>`) | `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70` |
| checkbox | `checkbox.svelte` | `Checkbox.Root`, `Checkbox.Indicator` | `peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground` |
| select | `select.svelte` + `select-trigger.svelte` + `select-content.svelte` + `select-item.svelte` | `Select.Root`, `Select.Trigger`, `Select.Value`, `Select.Content`, `Select.Item`, `Select.ItemIndicator` | trigger: `flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ...`; content: `relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ...`; item: `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50` |
| slider | `slider.svelte` | `Slider.Root`, `Slider.Range`, `Slider.Thumb` | root: `relative flex w-full touch-none select-none items-center`; track: `relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20`; range: `absolute h-full bg-primary`; thumb: `block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` |
| card | `card.svelte` + `card-header.svelte` + `card-title.svelte` + `card-content.svelte` | (plain divs) | card: `rounded-xl border bg-card text-card-foreground shadow`; header: `flex flex-col space-y-1.5 p-6`; title: `font-semibold leading-none tracking-tight`; content: `p-6 pt-0` |
| tabs | `tabs.svelte` + `tabs-list.svelte` + `tabs-trigger.svelte` + `tabs-content.svelte` | `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content` | list: `inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground`; trigger: `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ... data-[state=active]:bg-background data-[state=active]:text-foreground`; content: `mt-2 ring-offset-background` |
| alert-dialog | 8 files per spec (see package structure above) | `AlertDialog.Root`, `AlertDialog.Trigger`, `AlertDialog.Portal`, `AlertDialog.Overlay`, `AlertDialog.Content`, `AlertDialog.Title`, `AlertDialog.Description`, `AlertDialog.Action`, `AlertDialog.Cancel` | overlay: `fixed inset-0 z-50 bg-black/80 ...`; content: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg ...` |
| separator | `separator.svelte` | `Separator.Root` | `shrink-0 bg-border h-[1px] w-full` |

**Representative primitive example — `src/ui/input/input.svelte`:**

```svelte
<script lang="ts">
  import { cn } from '../../util/cn';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = HTMLInputAttributes & { class?: string };
  let { class: className, ...rest }: Props = $props();
</script>

<input
  class={cn(
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  {...rest}
/>
```

**Representative bits-ui wrapper — `src/ui/checkbox/checkbox.svelte`:**

```svelte
<script lang="ts">
  import { Checkbox as CheckboxPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';

  type Props = CheckboxPrimitive.RootProps & { class?: string };
  let { class: className, checked = $bindable(false), ...rest }: Props = $props();
</script>

<CheckboxPrimitive.Root
  bind:checked
  class={cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    className
  )}
  {...rest}
>
  <CheckboxPrimitive.Indicator class="flex items-center justify-center text-current">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
```

- [ ] **Step 1: Create all primitive files** (one per row in the table above; use the class lists and the bits-ui imports specified)

For compound primitives (Select, Card, Tabs, AlertDialog), each sub-file follows the same pattern:
```svelte
<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';  // or whatever group
  import { cn } from '../../util/cn';

  type Props = TabsPrimitive.ListProps & { class?: string };
  let { class: className, ...rest }: Props = $props();
</script>

<TabsPrimitive.List
  class={cn('inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground', className)}
  {...rest}
/>
```

Re-exports from each sub-directory's implicit index — we'll add a top-level barrel in Step 2.

- [ ] **Step 2: Create `src/ui/index.ts` — barrel export**

```ts
// Primitives — re-exported so consumers import from @jsonforms/svelte-shadcn
export { default as Button } from './button/button.svelte';
export { default as Input } from './input/input.svelte';
export { default as Textarea } from './textarea/textarea.svelte';
export { default as Label } from './label/label.svelte';
export { default as Checkbox } from './checkbox/checkbox.svelte';
export { default as Select } from './select/select.svelte';
export { default as SelectTrigger } from './select/select-trigger.svelte';
export { default as SelectContent } from './select/select-content.svelte';
export { default as SelectItem } from './select/select-item.svelte';
export { default as Slider } from './slider/slider.svelte';
export { default as Card } from './card/card.svelte';
export { default as CardHeader } from './card/card-header.svelte';
export { default as CardTitle } from './card/card-title.svelte';
export { default as CardContent } from './card/card-content.svelte';
export { default as Tabs } from './tabs/tabs.svelte';
export { default as TabsList } from './tabs/tabs-list.svelte';
export { default as TabsTrigger } from './tabs/tabs-trigger.svelte';
export { default as TabsContent } from './tabs/tabs-content.svelte';
export { default as AlertDialog } from './alert-dialog/alert-dialog.svelte';
export { default as AlertDialogTrigger } from './alert-dialog/alert-dialog-trigger.svelte';
export { default as AlertDialogContent } from './alert-dialog/alert-dialog-content.svelte';
export { default as AlertDialogTitle } from './alert-dialog/alert-dialog-title.svelte';
export { default as AlertDialogDescription } from './alert-dialog/alert-dialog-description.svelte';
export { default as AlertDialogFooter } from './alert-dialog/alert-dialog-footer.svelte';
export { default as AlertDialogAction } from './alert-dialog/alert-dialog-action.svelte';
export { default as AlertDialogCancel } from './alert-dialog/alert-dialog-cancel.svelte';
export { default as Separator } from './separator/separator.svelte';
```

- [ ] **Step 3: Build + type-check**

```bash
pnpm lerna run build --scope=@jsonforms/svelte-shadcn
pnpm --filter @jsonforms/svelte-shadcn lint
```

Expected: build succeeds, svelte-check passes (may warn on `$props()` with generic intersection — acceptable).

- [ ] **Step 4: Commit**

```bash
git add packages/svelte-shadcn/src/ui
git commit -m "feat(svelte-shadcn): add bits-ui primitive wrappers"
```

---

### Task 3: Composition utilities

**Files:**
- Create: `packages/svelte-shadcn/src/util/composition.svelte.ts`
- Modify: `packages/svelte-shadcn/src/util/index.ts`
- Test: `packages/svelte-shadcn/tests/util/composition.test.ts`
- Create: `packages/svelte-shadcn/tests/util/CompositionProbe.svelte`

- [ ] **Step 1: Write the failing test**

Create `tests/util/CompositionProbe.svelte`:

```svelte
<script lang="ts">
  import { useShadcnControl } from '../../src/util/composition.svelte';
  import { getJsonFormsControl, type ControlProps } from '@jsonforms/svelte';

  let props: ControlProps = $props();
  const binding = useShadcnControl({
    input: getJsonFormsControl(props),
  });

  (globalThis as any).__compProbe = binding;
</script>

<span data-testid="merged-options">{JSON.stringify(binding.appliedOptions)}</span>
<span data-testid="label">{binding.controlWrapper.label}</span>
<span data-testid="visible">{String(binding.controlWrapper.visible)}</span>
```

Create `tests/util/composition.test.ts` — a minimal host that sets context and mounts probe with a schema declaring `options: { trim: true }` in uischema and a global `config: { showUnfocusedDescription: false }`. Assert `appliedOptions.trim === true && appliedOptions.showUnfocusedDescription === false` (merged).

- [ ] **Step 2: Run tests — verify FAIL**

```bash
pnpm --filter @jsonforms/svelte-shadcn test
```

Expected: module not found.

- [ ] **Step 3: Implement `src/util/composition.svelte.ts`**

```ts
import {
  computeLabel,
  isDescriptionHidden,
  type ControlElement,
} from '@jsonforms/core';

type ControlInput = {
  control: any;
  handleChange: (path: string, value: unknown) => void;
};

export interface UseShadcnControlOptions {
  input: ControlInput;
  adaptValue?: (value: unknown) => unknown;
}

/**
 * Wraps the result of any `getJsonFormsXxxControl(props)` from `@jsonforms/svelte`.
 * Adds: merged options (config + uischema.options), a uniform `controlWrapper`
 * prop bundle for `<ControlWrapper>`, `onChange(value)`, and `isFocused` state.
 */
export function useShadcnControl(opts: UseShadcnControlOptions) {
  const { input, adaptValue } = opts;
  const { control, handleChange } = input;

  const appliedOptions = $derived({
    ...(control.config ?? {}),
    ...((control.uischema as ControlElement)?.options ?? {}),
  });

  let isFocused = $state(false);

  const onChange = (value: unknown) => {
    handleChange(control.path, adaptValue ? adaptValue(value) : value);
  };

  const controlWrapper = $derived({
    id: control.id,
    description: control.description,
    errors: control.errors,
    label: computeLabel(
      control.label,
      control.required,
      !!appliedOptions.hideRequiredAsterisk
    ),
    visible: control.visible,
    required: control.required,
    descriptionHidden: isDescriptionHidden(
      control.visible,
      control.description,
      isFocused,
      !!appliedOptions.showUnfocusedDescription
    ),
  });

  return {
    control,
    handleChange,
    get appliedOptions() { return appliedOptions; },
    get controlWrapper() { return controlWrapper; },
    get isFocused() { return isFocused; },
    set isFocused(v: boolean) { isFocused = v; },
    onChange,
  };
}

export interface UseShadcnLayoutOptions {
  input: { layout: any };
}

export function useShadcnLayout(opts: UseShadcnLayoutOptions) {
  const { layout } = opts.input;
  const appliedOptions = $derived({
    ...(layout.config ?? {}),
    ...(layout.uischema?.options ?? {}),
  });
  return {
    layout,
    get appliedOptions() { return appliedOptions; },
  };
}

export interface UseShadcnArrayControlOptions {
  input: {
    control: any;
    addItem: (path: string, value: unknown) => () => void;
    removeItems?: (path: string, toDelete: number[]) => () => void;
    moveUp?: (path: string, toMove: number) => () => void;
    moveDown?: (path: string, toMove: number) => () => void;
  };
}

export function useShadcnArrayControl(opts: UseShadcnArrayControlOptions) {
  const base = useShadcnControl({ input: opts.input as any });
  const childUiSchema = $derived(
    // placeholder — real implementation uses findUISchema / createDefaultValue
    // from @jsonforms/core; spelled out in implementation step below
    (null as unknown) as any
  );
  const translations = $derived({
    addTooltip: 'Add',
    removeTooltip: 'Remove',
    upTooltip: 'Move up',
    downTooltip: 'Move down',
    noData: 'No data',
  });

  return {
    ...base,
    addItem: opts.input.addItem,
    removeItems: opts.input.removeItems,
    moveUp: opts.input.moveUp,
    moveDown: opts.input.moveDown,
    get childUiSchema() { return childUiSchema; },
    get translations() { return translations; },
    childLabelForIndex(index: number): string {
      return String(index + 1);
    },
  };
}
```

**Note:** the `childUiSchema` placeholder above is incomplete. The real value is:

```ts
import { findUISchema, createDefaultValue } from '@jsonforms/core';

const childUiSchema = $derived(
  findUISchema(
    base.control.uischemas ?? [],
    base.control.schema.items,
    base.control.uischema.scope,
    base.control.path,
    undefined,
    base.control.uischema,
    base.control.rootSchema
  )
);
```

Replace the placeholder with this once you verify the `@jsonforms/core` imports exist at the latest versions.

- [ ] **Step 4: Update `src/util/index.ts`**

```ts
export { cn } from './cn';
export {
  useShadcnControl,
  useShadcnLayout,
  useShadcnArrayControl,
  type UseShadcnControlOptions,
  type UseShadcnLayoutOptions,
  type UseShadcnArrayControlOptions,
} from './composition.svelte';
```

- [ ] **Step 5: Run tests — verify PASS**

```bash
pnpm --filter @jsonforms/svelte-shadcn test
```

- [ ] **Step 6: Commit**

```bash
git add packages/svelte-shadcn/src/util packages/svelte-shadcn/tests/util
git commit -m "feat(svelte-shadcn): add shadcn composition utilities"
```

---

### Task 4: ControlWrapper

**Files:**
- Create: `packages/svelte-shadcn/src/ControlWrapper.svelte`
- Test: `packages/svelte-shadcn/tests/ControlWrapper.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/ControlWrapper.test.ts` — render `<ControlWrapper>` with a label, description, errors, required flag, and a slot body. Assert:
- Required asterisk appears when `required=true` and `hideRequiredAsterisk` is not set
- Description visible when `isFocused=true` or `showUnfocusedDescription=true`
- Error text shown when `errors` non-empty
- Body (slot) renders

- [ ] **Step 2: Run tests — verify FAIL**

- [ ] **Step 3: Implement `src/ControlWrapper.svelte`**

```svelte
<script lang="ts">
  import Label from './ui/label/label.svelte';
  import { cn } from './util/cn';

  type Props = {
    id?: string;
    label?: string;
    description?: string;
    errors?: string;
    visible?: boolean;
    required?: boolean;
    descriptionHidden?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
  };

  let {
    id,
    label,
    description,
    errors,
    visible = true,
    required,
    descriptionHidden,
    class: className,
    children,
  }: Props = $props();
</script>

{#if visible}
  <div class={cn('flex flex-col gap-1.5', className)}>
    {#if label}
      <Label for={id}>
        {label}
        {#if required}
          <span class="text-destructive ml-0.5" aria-hidden="true">*</span>
        {/if}
      </Label>
    {/if}

    {@render children?.()}

    {#if description && !descriptionHidden}
      <p class="text-xs text-muted-foreground">{description}</p>
    {/if}

    {#if errors}
      <p class="text-xs text-destructive" role="alert">{errors}</p>
    {/if}
  </div>
{/if}
```

- [ ] **Step 4: Run tests — PASS**

- [ ] **Step 5: Commit**

```bash
git add packages/svelte-shadcn/src/ControlWrapper.svelte packages/svelte-shadcn/tests/ControlWrapper.test.ts
git commit -m "feat(svelte-shadcn): add shared ControlWrapper component"
```

---

## Phase B: Control renderers (10 tasks, parallelizable)

Each control renderer is one task and one commit. Each task creates THREE files:
- `packages/svelte-shadcn/src/controls/<Name>Renderer.svelte`
- `packages/svelte-shadcn/src/controls/<Name>Renderer.ts`
- `packages/svelte-shadcn/tests/controls/<Name>Renderer.test.ts`

**No task touches `packages/svelte-shadcn/src/controls/index.ts`** — the aggregator is assembled in Phase F.

### Template (read this before Tasks 5–14)

**Renderer `.svelte` pattern** (example for a generic string-like control):

```svelte
<script lang="ts">
  import {
    getJsonFormsControl,
    type ControlProps,
  } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Input
    id={b.control.id}
    type="text"
    value={b.control.data ?? ''}
    disabled={!b.control.enabled}
    oninput={(e) => b.onChange((e.currentTarget as HTMLInputElement).value)}
    onfocus={() => (b.isFocused = true)}
    onblur={() => (b.isFocused = false)}
  />
</ControlWrapper>
```

**Entry `.ts` pattern:**

```ts
import { rankWith, isStringControl } from '@jsonforms/core';
import Component from './StringControlRenderer.svelte';

export const stringControlRendererEntry = {
  renderer: Component,
  tester: rankWith(1, isStringControl),
};
```

**Test pattern:**

```ts
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('StringControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
  };
  const uischema = { type: 'Control', scope: '#/properties/name' } as const;

  it('renders an input with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { name: 'Alice' },
        renderers: [stringControlRendererEntry],
      },
    });
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('Alice');
  });

  it('fires onchange with new value when user types', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { name: 'Alice' },
        renderers: [stringControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input')!;
    await fireEvent.input(input, { target: { value: 'Bob' } });
    expect(events[events.length - 1].data).toEqual({ name: 'Bob' });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [stringControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
```

### Task 5: StringControlRenderer

- [ ] **Step 1:** Test as template above (swap component + entry names)
- [ ] **Step 2:** Verify FAIL
- [ ] **Step 3:** Implement `.svelte` as template above; implement `.ts`:
  ```ts
  import { rankWith, isStringControl } from '@jsonforms/core';
  import Component from './StringControlRenderer.svelte';
  export const stringControlRendererEntry = {
    renderer: Component,
    tester: rankWith(1, isStringControl),
  };
  ```
- [ ] **Step 4:** Verify PASS
- [ ] **Step 5:** Commit `feat(svelte-shadcn): add StringControlRenderer`

### Task 6: NumberControlRenderer

Variation from template:
- Use `Input` with `type="number"`
- `oninput` value converts to `Number(e.currentTarget.value)` before calling `b.onChange`
- Tester: `rankWith(1, isNumberControl)`
- Test uses schema `{ type: 'object', properties: { n: { type: 'number' } } }`

Full steps 1-5 same shape as Task 5.

### Task 7: IntegerControlRenderer

Variation:
- Use `Input` with `type="number"` and `step="1"`
- Value adapter: `Math.trunc(Number(e.currentTarget.value))`
- Tester: `rankWith(1, isIntegerControl)`

### Task 8: BooleanControlRenderer

Variation:
- Use `Checkbox` primitive (with `bind:checked` — Svelte 5 two-way binding)
- `onChange` called in a derived effect or in `onCheckedChange` handler from bits-ui
- Tester: `rankWith(1, isBooleanControl)`
- Template adjustment: Checkbox sits inside ControlWrapper but also has its own label layout (horizontal with label)

```svelte
<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex items-center gap-2">
    <Checkbox
      id={b.control.id}
      checked={!!b.control.data}
      onCheckedChange={(v) => b.onChange(v)}
      disabled={!b.control.enabled}
    />
  </div>
</ControlWrapper>
```

### Task 9: EnumControlRenderer

Variation:
- Import `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
- Iterate `b.control.options` (the enum options array from `mapStateToEnumControlProps`)
- Use `getJsonFormsEnumControl` instead of `getJsonFormsControl`
- Tester: `rankWith(2, isEnumControl)`

```svelte
<script lang="ts">
  import { getJsonFormsEnumControl, type ControlProps } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Select from '../ui/select/select.svelte';
  import SelectTrigger from '../ui/select/select-trigger.svelte';
  import SelectContent from '../ui/select/select-content.svelte';
  import SelectItem from '../ui/select/select-item.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsEnumControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Select
    type="single"
    value={b.control.data ?? ''}
    onValueChange={(v) => b.onChange(v)}
    disabled={!b.control.enabled}
  >
    <SelectTrigger id={b.control.id}>
      {b.control.data ?? 'Select…'}
    </SelectTrigger>
    <SelectContent>
      {#each b.control.options ?? [] as option}
        <SelectItem value={option.value}>{option.label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>
</ControlWrapper>
```

### Task 10: OneOfEnumControlRenderer

Variation from Task 9:
- Use `getJsonFormsOneOfEnumControl`
- Tester: `rankWith(2, isOneOfEnumControl)`
- Otherwise identical

### Task 11: MultiStringControlRenderer

Variation:
- Use `Textarea` primitive
- Tester: `rankWith(2, and(isStringControl, isMultiLineControl))` — import `and`, `isMultiLineControl`
- Template `Input` swapped for `Textarea`

### Task 12: DateControlRenderer

Variation:
- Use `Input` with `type="date"`
- Value: keep ISO-date string (`YYYY-MM-DD`) as-is — no transformation
- Tester: `rankWith(2, isDateControl)`

### Task 13: DateTimeControlRenderer

Variation:
- Use `Input` with `type="datetime-local"`
- Value: ISO-datetime string (`YYYY-MM-DDTHH:mm`) as-is
- Tester: `rankWith(2, isDateTimeControl)`

### Task 14: SliderControlRenderer

Variation:
- Use `Slider` primitive (bits-ui Slider.Root with `bind:value`)
- Apply `min`, `max`, `step` from schema properties
- Tester: `rankWith(2, isRangeControl)` — import `isRangeControl`
- Layout: slider above a small text showing current value

```svelte
<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    <Slider
      type="single"
      value={b.control.data ?? b.control.schema.default ?? b.control.schema.minimum}
      min={b.control.schema.minimum}
      max={b.control.schema.maximum}
      step={b.control.schema.multipleOf ?? 1}
      onValueChange={(v) => b.onChange(v)}
      disabled={!b.control.enabled}
    />
    <span class="text-xs text-muted-foreground">{b.control.data}</span>
  </div>
</ControlWrapper>
```

---

## Phase C: Layout renderers (4 tasks, parallelizable)

Each task creates three files under `layouts/` with matching test under `tests/layouts/`. `layouts/index.ts` is assembled in Phase F.

### Task 15: VerticalLayoutRenderer

```svelte
<script lang="ts">
  import { getJsonFormsLayout, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import { useShadcnLayout } from '../util/composition.svelte';
  import { cn } from '../util/cn';

  let props: LayoutProps = $props();
  const b = useShadcnLayout({ input: getJsonFormsLayout(props) });
</script>

{#if b.layout.visible}
  <div class={cn('flex flex-col gap-4')}>
    {#each b.layout.uischema.elements as el}
      <DispatchRenderer
        schema={b.layout.schema}
        uischema={el}
        path={b.layout.path}
        enabled={b.layout.enabled}
        renderers={b.layout.renderers}
        cells={b.layout.cells}
      />
    {/each}
  </div>
{/if}
```

Entry:
```ts
import { rankWith, uiTypeIs } from '@jsonforms/core';
import Component from './VerticalLayoutRenderer.svelte';
export const verticalLayoutRendererEntry = {
  renderer: Component,
  tester: rankWith(1, uiTypeIs('VerticalLayout')),
};
```

Test: mount `JsonForms` with two child controls and assert both render vertically.

### Task 16: HorizontalLayoutRenderer

Identical to Task 15 but `cn('flex flex-row gap-4 items-start')` and tester uses `uiTypeIs('HorizontalLayout')`.

### Task 17: GroupRenderer

Variation:
- Wrap children in `Card` + `CardHeader` + `CardTitle` + `CardContent`
- Title comes from `b.layout.uischema.label`
- Tester: `rankWith(2, and(uiTypeIs('Group'), isLayout))`

```svelte
<Card>
  <CardHeader>
    <CardTitle>{b.layout.uischema.label}</CardTitle>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    {#each b.layout.uischema.elements as el}
      <DispatchRenderer ... />
    {/each}
  </CardContent>
</Card>
```

### Task 18: CategorizationRenderer

Variation:
- Use `getJsonFormsCategorization` from @jsonforms/svelte
- Render with `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent`
- One tab trigger per category
- Tester: `rankWith(2, and(isCategorization, categorizationHasCategory))` (import `isCategorization`, `categorizationHasCategory`)

```svelte
<script lang="ts">
  import { getJsonFormsCategorization, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import Tabs from '../ui/tabs/tabs.svelte';
  import TabsList from '../ui/tabs/tabs-list.svelte';
  import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';
  import TabsContent from '../ui/tabs/tabs-content.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);
  let active = $state('0');
</script>

{#if layout.visible}
  <Tabs bind:value={active}>
    <TabsList>
      {#each categories as cat, i}
        <TabsTrigger value={String(i)}>{(cat.uischema as any).label}</TabsTrigger>
      {/each}
    </TabsList>
    {#each categories as cat, i}
      <TabsContent value={String(i)}>
        {#each (cat.uischema as any).elements as el}
          <DispatchRenderer
            schema={cat.schema}
            uischema={el}
            path={cat.path}
            enabled={cat.enabled}
          />
        {/each}
      </TabsContent>
    {/each}
  </Tabs>
{/if}
```

---

## Phase D: Complex renderers

### Task 19: ObjectRenderer

**Files:** `src/complex/ObjectRenderer.svelte`, `ObjectRenderer.ts`, `tests/complex/ObjectRenderer.test.ts`

**Behavior:**
- Use `getJsonFormsControlWithDetail(props)`
- Auto-generate a sub-uischema via `Generate.uiSchema(control.schema)` if `control.uischema.options.detail` is not set
- Dispatch-render the sub-uischema

```svelte
<script lang="ts">
  import { getJsonFormsControlWithDetail, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { Generate } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControlWithDetail(props) });

  const detailUiSchema = $derived(
    (b.appliedOptions.detail as any) ??
      Generate.uiSchema(b.control.schema, 'Group', undefined, b.control.schema)
  );
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <DispatchRenderer
    schema={b.control.schema}
    uischema={detailUiSchema}
    path={b.control.path}
    enabled={b.control.enabled}
  />
</ControlWrapper>
```

Entry: `rankWith(2, isObjectControl)`.

Test: mount with nested schema, assert nested controls appear.

### Task 20: ArrayListRenderer + ArrayListElement

**Files:** `src/array/ArrayListRenderer.svelte`, `ArrayListRenderer.ts`, `ArrayListElement.svelte`, `tests/array/ArrayListRenderer.test.ts`

**This is ONE task, not two — the element component is private to the array renderer.**

**Behavior:**
- Use `getJsonFormsArrayControl(props)` → `{ control, addItem, removeItems, moveUp, moveDown }`
- Render a list of items; each item is an `ArrayListElement` (wrapping `DispatchRenderer` + remove/up/down buttons)
- Buttons at top: add (+), translations from `useShadcnArrayControl`
- Empty state: "No data" when `control.data` is empty

Tester: `rankWith(2, schemaTypeIs('array'))`.

This is the most complex single renderer in Phase D. Detailed skeleton:

```svelte
<!-- ArrayListRenderer.svelte -->
<script lang="ts">
  import { getJsonFormsArrayControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { createDefaultValue } from '@jsonforms/core';
  import { useShadcnArrayControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import ArrayListElement from './ArrayListElement.svelte';
  import Button from '../ui/button/button.svelte';

  let props: ControlProps = $props();
  const b = useShadcnArrayControl({ input: getJsonFormsArrayControl(props) as any });

  function handleAdd() {
    b.addItem(b.control.path, createDefaultValue(b.control.schema.items as any, b.control.rootSchema))();
  }
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end">
      <Button type="button" onclick={handleAdd} disabled={!b.control.enabled}>+ {b.translations.addTooltip}</Button>
    </div>
    {#if (b.control.data as unknown[])?.length}
      {#each b.control.data as _item, i (i)}
        <ArrayListElement
          index={i}
          path={b.control.path}
          schema={b.control.schema.items}
          uischema={b.childUiSchema}
          enabled={b.control.enabled}
          removeItems={b.removeItems}
          moveUp={b.moveUp}
          moveDown={b.moveDown}
          translations={b.translations}
        />
      {/each}
    {:else}
      <p class="text-sm text-muted-foreground">{b.translations.noData}</p>
    {/if}
  </div>
</ControlWrapper>
```

```svelte
<!-- ArrayListElement.svelte -->
<script lang="ts">
  import { DispatchRenderer } from '@jsonforms/svelte';
  import Button from '../ui/button/button.svelte';
  import Separator from '../ui/separator/separator.svelte';

  let {
    index,
    path,
    schema,
    uischema,
    enabled,
    removeItems,
    moveUp,
    moveDown,
    translations,
  }: {
    index: number;
    path: string;
    schema: any;
    uischema: any;
    enabled: boolean;
    removeItems: any;
    moveUp: any;
    moveDown: any;
    translations: any;
  } = $props();

  const itemPath = $derived(`${path}.${index}`);
</script>

<div class="flex flex-col gap-2 p-3 rounded-md border border-border">
  <div class="flex gap-1 justify-end">
    <Button type="button" onclick={() => moveUp?.(path, index)()} disabled={!enabled}>↑</Button>
    <Button type="button" onclick={() => moveDown?.(path, index)()} disabled={!enabled}>↓</Button>
    <Button type="button" onclick={() => removeItems?.(path, [index])()} disabled={!enabled}>✕</Button>
  </div>
  <DispatchRenderer {schema} {uischema} path={itemPath} {enabled} />
</div>
```

Entry:
```ts
import { rankWith, schemaTypeIs } from '@jsonforms/core';
import Component from './ArrayListRenderer.svelte';
export const arrayListRendererEntry = {
  renderer: Component,
  tester: rankWith(2, schemaTypeIs('array')),
};
```

Test: mount with array schema, assert list items render, test add/remove/move.

### Task 21: OneOfRenderer

**Behavior:**
- Use `getJsonFormsOneOfControl(props)` → `{ control, handleChange }` where `control.indexOfFittingSchema` indicates current selection
- Render a `Select` for schema choice
- On change, show `AlertDialog` to confirm data erasure if user is switching AND has non-default data
- Dispatch-render the selected sub-schema

**Tester:** `rankWith(3, isOneOfControl)`.

Skeleton:

```svelte
<script lang="ts">
  import { getJsonFormsOneOfControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { createCombinatorRenderInfos, createDefaultValue } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui';
  import {
    AlertDialog, AlertDialogContent, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
  } from '../ui';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsOneOfControl(props) });

  const renderInfos = $derived(
    createCombinatorRenderInfos(
      (b.control.schema as any).oneOf ?? [],
      b.control.rootSchema,
      'oneOf',
      b.control.uischema,
      b.control.path,
      b.control.uischemas ?? []
    )
  );
  let selectedIndex = $state(b.control.indexOfFittingSchema ?? 0);
  let pendingIndex = $state<number | null>(null);
  let dialogOpen = $state(false);

  function requestChange(i: number) {
    if (b.control.data === undefined || b.control.data === null) {
      selectedIndex = i;
      b.onChange(createDefaultValue(renderInfos[i].schema, b.control.rootSchema));
    } else {
      pendingIndex = i;
      dialogOpen = true;
    }
  }

  function confirm() {
    if (pendingIndex !== null) {
      selectedIndex = pendingIndex;
      b.onChange(createDefaultValue(renderInfos[pendingIndex].schema, b.control.rootSchema));
      pendingIndex = null;
    }
    dialogOpen = false;
  }
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Select type="single" value={String(selectedIndex)} onValueChange={(v) => requestChange(Number(v))}>
    <SelectTrigger>{renderInfos[selectedIndex]?.label}</SelectTrigger>
    <SelectContent>
      {#each renderInfos as info, i}
        <SelectItem value={String(i)}>{info.label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>

  {#if renderInfos[selectedIndex]}
    <DispatchRenderer
      schema={renderInfos[selectedIndex].schema}
      uischema={renderInfos[selectedIndex].uischema}
      path={b.control.path}
      enabled={b.control.enabled}
    />
  {/if}
</ControlWrapper>

<AlertDialog bind:open={dialogOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>Clear form?</AlertDialogTitle>
    <AlertDialogDescription>
      Switching the selection will clear the form. Are you sure?
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel onclick={() => (dialogOpen = false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onclick={confirm}>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Entry: `rankWith(3, isOneOfControl)`.

Test: mount with a oneOf schema, assert the select, pick option, confirm dialog flow, verify data change.

### Task 22: AnyOfRenderer

Identical to OneOf but:
- Use `getJsonFormsAnyOfControl`
- Use `(b.control.schema as any).anyOf`
- Combinator keyword `'anyOf'` in `createCombinatorRenderInfos`
- Tester: `rankWith(3, isAnyOfControl)`

### Task 23: AllOfRenderer

Different — no selection. Just dispatch-render every `allOf` schema in sequence under the same path.

```svelte
<script lang="ts">
  import { getJsonFormsAllOfControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { createCombinatorRenderInfos } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsAllOfControl(props) });

  const infos = $derived(
    createCombinatorRenderInfos(
      (b.control.schema as any).allOf ?? [],
      b.control.rootSchema,
      'allOf',
      b.control.uischema,
      b.control.path,
      b.control.uischemas ?? []
    )
  );
</script>

{#if b.control.visible}
  <div class="flex flex-col gap-4">
    {#each infos as info}
      <DispatchRenderer schema={info.schema} uischema={info.uischema} path={b.control.path} enabled={b.control.enabled} />
    {/each}
  </div>
{/if}
```

Tester: `rankWith(3, isAllOfControl)`.

### Task 24: EnumArrayRenderer

**Behavior:** for `array` schemas whose items are `enum`, render a checkbox group.

- Use `getJsonFormsMultiEnumControl(props)` → `{ control, addItem, removeItem, handleChange }`
- Render one Checkbox per enum option; checked state = option present in data array
- Toggle adds/removes via `addItem` / the handleChange
- Tester: `rankWith(3, isMultiEnumControl)`

```svelte
<script lang="ts">
  import { getJsonFormsMultiEnumControl, type ControlProps } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Checkbox from '../ui/checkbox/checkbox.svelte';
  import Label from '../ui/label/label.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsMultiEnumControl(props) as any });
  const selected = $derived(new Set((b.control.data as unknown[]) ?? []));

  function toggle(value: unknown, checked: boolean) {
    const next = new Set(selected);
    if (checked) next.add(value);
    else next.delete(value);
    b.onChange([...next]);
  }
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    {#each b.control.options ?? [] as opt}
      <div class="flex items-center gap-2">
        <Checkbox
          id={`${b.control.id}-${opt.value}`}
          checked={selected.has(opt.value)}
          onCheckedChange={(v) => toggle(opt.value, !!v)}
          disabled={!b.control.enabled}
        />
        <Label for={`${b.control.id}-${opt.value}`}>{opt.label}</Label>
      </div>
    {/each}
  </div>
</ControlWrapper>
```

---

## Phase E: Label + Cells (6 tasks, parallelizable)

### Task 25: LabelRenderer

**Files:** `src/labels/LabelRenderer.svelte`, `LabelRenderer.ts`, `tests/labels/LabelRenderer.test.ts`

```svelte
<script lang="ts">
  import { getJsonFormsLabel, type RendererProps } from '@jsonforms/svelte';
  import type { LabelElement } from '@jsonforms/core';

  let props: RendererProps<LabelElement> = $props();
  const { label } = getJsonFormsLabel(props);
</script>

{#if label.visible}
  <p class="text-base font-medium">{label.text}</p>
{/if}
```

Entry: `rankWith(1, uiTypeIs('Label'))`.

### Tasks 26–30: Cells (5 tasks, parallelizable)

Each cell is minimalist — no ControlWrapper, no label/description/error display; just a compact input.

**Cell template** (e.g. TextCell):

```svelte
<script lang="ts">
  import { getJsonFormsCell, type ControlProps } from '@jsonforms/svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const { cell, handleChange } = getJsonFormsCell(props);
</script>

<Input
  type="text"
  value={cell.data ?? ''}
  disabled={!cell.enabled}
  oninput={(e) => handleChange(cell.path, (e.currentTarget as HTMLInputElement).value)}
/>
```

Entry:
```ts
import { rankWith, isStringControl } from '@jsonforms/core';
import Component from './TextCell.svelte';
export const textCellEntry = {
  cell: Component,
  tester: rankWith(1, isStringControl),
};
```

| Task | Cell | Input Type | Value adapter | Tester |
|---|---|---|---|---|
| 26 | TextCell | `text` | identity | `rankWith(1, isStringControl)` |
| 27 | NumberCell | `number` | `Number(v)` | `rankWith(1, isNumberControl)` |
| 28 | IntegerCell | `number` (step=1) | `Math.trunc(Number(v))` | `rankWith(1, isIntegerControl)` |
| 29 | BooleanCell | Checkbox (not Input) | `!!v` | `rankWith(1, isBooleanControl)` |
| 30 | EnumCell | compact Select | identity | `rankWith(2, isEnumControl)` — use `getJsonFormsEnumCell` |

Each task: write failing test, implement .svelte + .ts, verify pass, commit `feat(svelte-shadcn): add <Name>Cell`.

---

## Phase F: Aggregate registries + example app + final build

### Task 31: Aggregate registries

**Files:**
- Create: `packages/svelte-shadcn/src/controls/index.ts`
- Create: `packages/svelte-shadcn/src/layouts/index.ts`
- Create: `packages/svelte-shadcn/src/complex/index.ts`
- Create: `packages/svelte-shadcn/src/array/index.ts`
- Create: `packages/svelte-shadcn/src/labels/index.ts`
- Create: `packages/svelte-shadcn/src/cells/index.ts`
- Create: `packages/svelte-shadcn/src/renderers.ts`
- Create: `packages/svelte-shadcn/src/cells.ts`
- Modify: `packages/svelte-shadcn/src/index.ts`

- [ ] **Step 1: Create each category `index.ts`**

Example (`controls/index.ts`):
```ts
import { stringControlRendererEntry } from './StringControlRenderer';
import { numberControlRendererEntry } from './NumberControlRenderer';
import { integerControlRendererEntry } from './IntegerControlRenderer';
import { booleanControlRendererEntry } from './BooleanControlRenderer';
import { enumControlRendererEntry } from './EnumControlRenderer';
import { oneOfEnumControlRendererEntry } from './OneOfEnumControlRenderer';
import { multiStringControlRendererEntry } from './MultiStringControlRenderer';
import { dateControlRendererEntry } from './DateControlRenderer';
import { dateTimeControlRendererEntry } from './DateTimeControlRenderer';
import { sliderControlRendererEntry } from './SliderControlRenderer';

export const controlRenderers = [
  stringControlRendererEntry,
  numberControlRendererEntry,
  integerControlRendererEntry,
  booleanControlRendererEntry,
  enumControlRendererEntry,
  oneOfEnumControlRendererEntry,
  multiStringControlRendererEntry,
  dateControlRendererEntry,
  dateTimeControlRendererEntry,
  sliderControlRendererEntry,
];
```

Analogously for `layouts/`, `complex/` (5 entries — Object, OneOf, AnyOf, AllOf, EnumArray), `array/` (1 entry — ArrayList), `labels/` (1 entry), `cells/` (5 entries).

- [ ] **Step 2: Create `src/renderers.ts` and `src/cells.ts`**

```ts
// renderers.ts
import { controlRenderers } from './controls';
import { layoutRenderers } from './layouts';
import { complexRenderers } from './complex';
import { arrayRenderers } from './array';
import { labelRenderers } from './labels';

export const shadcnRenderers = [
  ...controlRenderers,
  ...layoutRenderers,
  ...complexRenderers,
  ...arrayRenderers,
  ...labelRenderers,
];
```

```ts
// cells.ts
import { cellRenderers } from './cells/index';
export const shadcnCells = cellRenderers;
```

(`cells/index.ts` exports `cellRenderers`; `cells.ts` re-exports as `shadcnCells` for naming consistency with the spec's public API.)

- [ ] **Step 3: Rewrite `src/index.ts`**

```ts
export { shadcnRenderers } from './renderers';
export { shadcnCells } from './cells';

// Re-export primitives and composition utilities for consumers building
// custom renderers.
export * from './ui';
export * from './util';
export { default as ControlWrapper } from './ControlWrapper.svelte';

// Re-export individual entries so consumers can pick & choose.
export { controlRenderers } from './controls';
export { layoutRenderers } from './layouts';
export { complexRenderers } from './complex';
export { arrayRenderers } from './array';
export { labelRenderers } from './labels';
export { cellRenderers } from './cells/index';
```

- [ ] **Step 4: Verify tests and build**

```bash
pnpm --filter @jsonforms/svelte-shadcn test
pnpm lerna run build --scope=@jsonforms/svelte-shadcn
pnpm --filter @jsonforms/svelte-shadcn lint
```

All must pass.

- [ ] **Step 5: Commit**

```bash
git add packages/svelte-shadcn/src
git commit -m "feat(svelte-shadcn): aggregate renderers and cells into public registries"
```

---

### Task 32: Example app

**Files:**
- Create: `packages/svelte-shadcn/example/package.json`
- Create: `packages/svelte-shadcn/example/vite.config.ts`
- Create: `packages/svelte-shadcn/example/index.html`
- Create: `packages/svelte-shadcn/example/src/main.ts`
- Create: `packages/svelte-shadcn/example/src/App.svelte`
- Create: `packages/svelte-shadcn/example/src/app.css`

- [ ] **Step 1: Create example `package.json`**

```json
{
  "name": "@jsonforms/svelte-shadcn-example",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@jsonforms/core": "workspace:*",
    "@jsonforms/svelte": "workspace:*",
    "@jsonforms/svelte-shadcn": "workspace:*",
    "bits-ui": "^1.3.0",
    "svelte": "^5.16.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.5.0",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
});
```

- [ ] **Step 3: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>@jsonforms/svelte-shadcn example</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `src/app.css`**

```css
@import 'tailwindcss';
@import '@jsonforms/svelte-shadcn/styles/tokens.css';

body {
  @apply bg-background text-foreground p-6;
}
```

- [ ] **Step 5: Create `src/main.ts`**

```ts
import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';

mount(App, { target: document.getElementById('app')! });
```

- [ ] **Step 6: Create `src/App.svelte`**

```svelte
<script lang="ts">
  import { JsonForms } from '@jsonforms/svelte';
  import { shadcnRenderers, shadcnCells } from '@jsonforms/svelte-shadcn';

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      age: { type: 'integer', minimum: 0 },
      active: { type: 'boolean' },
      role: { type: 'string', enum: ['admin', 'user', 'guest'] },
      birthday: { type: 'string', format: 'date' },
      bio: { type: 'string' },
    },
    required: ['name'],
  };

  let data = $state({
    name: 'Alice',
    age: 30,
    active: true,
    role: 'user',
    birthday: '1995-06-15',
    bio: 'Hello!',
  });

  function handleChange(e: { data: any; errors: any[] }) {
    data = e.data;
  }
</script>

<main class="max-w-xl mx-auto flex flex-col gap-6">
  <h1 class="text-2xl font-bold">@jsonforms/svelte-shadcn</h1>
  <JsonForms
    {schema}
    {data}
    renderers={shadcnRenderers}
    cells={shadcnCells}
    onchange={handleChange}
  />
  <pre class="text-xs bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>
</main>
```

- [ ] **Step 7: Run example app once to verify**

```bash
cd packages/svelte-shadcn
# In one terminal
pnpm dev
```

Open `http://localhost:5173` — form should render with shadcn-styled controls. No runtime errors. Stop the dev server (`Ctrl+C`).

- [ ] **Step 8: Build example app**

```bash
pnpm example:build
```

Expected: emits `example/dist/` with static assets.

- [ ] **Step 9: Commit**

```bash
git add packages/svelte-shadcn/example
git commit -m "feat(svelte-shadcn): add example app"
```

---

### Task 33: Final build + lint + monorepo verification

- [ ] **Step 1: Full package verification**

```bash
pnpm lerna run build --scope=@jsonforms/svelte-shadcn
pnpm --filter @jsonforms/svelte-shadcn test
pnpm --filter @jsonforms/svelte-shadcn lint
```

All must pass. publint must be clean.

- [ ] **Step 2: Full monorepo build**

```bash
pnpm run build
```

Expected: 13 projects build (the previous 12 + `@jsonforms/svelte-shadcn`).

- [ ] **Step 3: Inspect `dist/`**

```bash
ls packages/svelte-shadcn/dist
```

Expect: `index.js`, `index.d.ts`, `renderers.js`, `cells.js`, the full tree of `.svelte`, `.svelte.d.ts`, `.svelte.ts`, `.ts` source mirrored — plus `styles/tokens.css`.

- [ ] **Step 4: Final commit (if cleanup is needed)**

If anything required a follow-up fix, commit it now:
```bash
git add <files>
git commit -m "fix(svelte-shadcn): <what was fixed>"
```

---

## Self-review

**1. Spec coverage.** Cross-checked each line of the spec's renderer-set section against this plan:

| Spec item | Plan coverage |
|---|---|
| `@jsonforms/svelte-shadcn` package structure | Task 1 + phased file creation |
| ShadCN Component Strategy (own wrappers on bits-ui) | Task 2 |
| Composition utilities (`useShadcnControl`, `useShadcnLayout`, `useShadcnArrayControl`) | Task 3 |
| Renderer registration pattern (.svelte + .ts per entry, category index.ts) | Phases B–E + Task 31 |
| ControlWrapper structure | Task 4 |
| 10 controls per inventory table | Tasks 5–14 (1-to-1 with spec table) |
| 4 layouts | Tasks 15–18 |
| 6 complex renderers | Tasks 19–24 |
| 1 label | Task 25 |
| 5 cells | Tasks 26–30 |
| Build pipeline (Vite + `@sveltejs/package`) | Task 1 |
| Testing (Vitest + @testing-library/svelte) | Task 1 + per-renderer tests |
| Example application | Task 32 |
| Lerna integration | Automatic via `packages/*` glob |
| User-Facing API examples (basic + custom) | Task 32 App.svelte |

**2. Placeholder scan.** One placeholder present: Task 3's `childUiSchema` deriver is shown with a stub and the real implementation immediately below. The executor must substitute the real implementation. Flagged explicitly in the task. No other placeholders.

**3. Type/name consistency.**
- Entry export naming: `<nameInCamelCase>RendererEntry` / `<nameInCamelCase>CellEntry` — consistent across all tasks.
- Tester rank table matches spec's renderer inventory exactly.
- `useShadcnControl` return shape matches Task 4's `ControlWrapper` prop interface exactly (`id`, `label`, `description`, `errors`, `visible`, `required`, `descriptionHidden`).

**Known risks flagged for executor attention:**

- **Tailwind v4 import in dist output:** `svelte-package` will emit `.svelte` files referencing Tailwind classes. Consumers must set up Tailwind v4 in their own app and include our `styles/tokens.css`. Document this in `README.md`.
- **bits-ui v1 vs v2:** v2 was pre-release at plan time. If v2 ships stable by execution time, re-evaluate — API changes may require adjusting primitive wrappers.
- **`Select.Value` in bits-ui:** bits-ui's Select pattern changed between minors. Verify the current shape against bits-ui's release docs during Task 2.
- **`$props()` generic typing:** if `svelte-check` complains about `Props = X & { class?: string }` patterns, fall back to the spread-rest approach shown in the Task 2 input example.
- **`@jsonforms/core` combinator helpers:** `createCombinatorRenderInfos` and `createDefaultValue` are assumed to exist at current versions. If APIs have shifted, adapt the OneOf/AnyOf/AllOf renderers accordingly.
- **Categorization's tab value binding:** Tasks 18 uses `bind:value={active}`. If bits-ui's Tabs API differs, use its named prop instead.

---

## Execution handoff

See `docs/superpowers/plans/2026-04-24-svelte-shadcn-execution.md` for the subagent dispatch guide — parallelization strategy, model-per-task, per-batch verification, and ready-to-paste prompts.
