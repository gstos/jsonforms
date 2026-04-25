# Port Vue Vanilla example to svelte-shadcn — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal `packages/svelte-shadcn/example/src/App.svelte` (35 lines, hardcoded schema) with a full dev shell — selector, sidebar viewers, i18n editor, hash sync — driven by `@jsonforms/examples`.

**Architecture:** Single-file Svelte 5 component. Plain HTML elements styled with Tailwind utilities; **no shadcn primitives in the chrome** — the form is the visual subject (decision documented in the spec). Reactivity uses Svelte 5 runes (`$state`, `$derived`, `$effect`). No outer Card around the form. `<JsonForms>` invocation kept canonical.

**Tech Stack:** Svelte 5, Tailwind v4, Vite, `@jsonforms/svelte`, `@jsonforms/svelte-shadcn`, `@jsonforms/examples`.

**Spec:** `docs/superpowers/specs/2026-04-24-svelte-shadcn-example-port-design.md`

**No automated tests for the example app.** Vue Vanilla doesn't have any either; `packages/svelte-shadcn/example/` has no test runner configured. Verification is by dev-server smoke test + production build. Tasks below skip the "write failing test first" step and instead rely on a final smoke-test task.

---

## File map

| File | Action | Responsibility |
|---|---|---|
| `packages/svelte-shadcn/example/package.json` | Modify | Add `@jsonforms/examples: workspace:*` dep |
| `packages/svelte-shadcn/example/src/App.svelte` | Replace | Full dev-shell component |
| `packages/svelte-shadcn/example/src/main.ts` | Untouched | Already correct |
| `packages/svelte-shadcn/example/src/app.css` | Untouched | Already correct |
| `packages/svelte-shadcn/example/index.html` | Untouched | Already correct |
| `packages/svelte-shadcn/example/vite.config.ts` | Untouched | Already correct |

---

## Worktree setup

All work happens in a dedicated worktree. From the repo root:

```bash
git worktree add .worktrees/svelte-shadcn-example-port -b feature/svelte-shadcn-example-port master
cd .worktrees/svelte-shadcn-example-port
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm install
```

The `pnpm` PATH export is required for every Bash call that uses `pnpm` — corepack shims are not in the default subagent `PATH`.

---

## Task 1: Add `@jsonforms/examples` workspace dependency

**Files:**
- Modify: `packages/svelte-shadcn/example/package.json`

- [ ] **Step 1: Add the dependency**

Open `packages/svelte-shadcn/example/package.json`. In the `dependencies` block, add `"@jsonforms/examples": "workspace:*"` alongside the existing entries. Keep keys alphabetically sorted (it currently is). Final `dependencies` block:

```json
"dependencies": {
  "@jsonforms/core": "workspace:*",
  "@jsonforms/examples": "workspace:*",
  "@jsonforms/svelte": "workspace:*",
  "@jsonforms/svelte-shadcn": "workspace:*",
  "bits-ui": "^1.3.0",
  "svelte": "^5.16.0"
}
```

- [ ] **Step 2: Install and verify the package resolves**

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm install
ls node_modules/@jsonforms/examples/lib/index.d.ts
```

Expected: install completes; `lib/index.d.ts` exists (the workspace symlink resolves to `packages/examples/lib/index.d.ts`).

If `lib/` is missing, build the examples package:

```bash
pnpm --filter @jsonforms/examples build
```

- [ ] **Step 3: Smoke-check the import in a one-liner**

```bash
node -e "import('@jsonforms/examples').then(m => console.log('count:', m.getExamples().length, 'first:', m.getExamples()[0].name))"
```

Run from `packages/svelte-shadcn/example/`. Expected: prints a count > 30 and a name like `person`.

If this fails with a CJS/ESM error, see "Risks" in the spec — fix at the `@jsonforms/examples` package's `exports` field, not in the example app.

- [ ] **Step 4: Commit**

```bash
git add packages/svelte-shadcn/example/package.json pnpm-lock.yaml
git commit -m "chore(svelte-shadcn-example): add @jsonforms/examples dep"
```

---

## Task 2: Replace App.svelte with skeleton (layout + one hardcoded example)

**Files:**
- Replace: `packages/svelte-shadcn/example/src/App.svelte`

This task lays down the layout shell and renders the **first** example from `getExamples()` with no selector and no sidebar yet. Subsequent tasks add features on top of this scaffold.

- [ ] **Step 1: Write the new App.svelte**

Replace the entire file contents with:

```svelte
<script lang="ts">
  import { JsonForms } from '@jsonforms/svelte';
  import { shadcnRenderers, shadcnCells } from '@jsonforms/svelte-shadcn';
  import { getExamples } from '@jsonforms/examples';
  import type { ErrorObject } from 'ajv';

  const examples = getExamples();
  const example = examples[0];

  let data = $state<unknown>(example.data);
  let i18n = $state(example.i18n);
  let additionalErrors = $state<ErrorObject[]>([]);

  function handleChange(e: { data: unknown; errors: unknown[] }) {
    data = e.data;
  }
</script>

<div class="min-h-screen flex flex-col gap-6">
  <header class="bg-slate-900 text-white text-center py-8 px-6 rounded-md">
    <h1 class="text-2xl font-bold">JSON Forms · Svelte + shadcn-svelte</h1>
    <p class="text-sm opacity-80 mt-1">More forms. Less code.</p>
  </header>

  <main class="grid gap-6 md:grid-cols-[20rem_minmax(0,1fr)]">
    <aside class="space-y-4">
      <!-- selector + viewers go here in later tasks -->
      <p class="text-sm text-muted-foreground">Example: <strong>{example.label}</strong></p>
    </aside>

    <section class="min-w-0">
      {#key example.name}
        <JsonForms
          data={example.data}
          schema={example.schema}
          uischema={example.uischema}
          renderers={shadcnRenderers}
          cells={shadcnCells}
          i18n={i18n}
          additionalErrors={additionalErrors}
          onchange={handleChange}
        />
      {/key}
    </section>
  </main>
</div>
```

- [ ] **Step 2: Start the dev server and verify it renders**

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm --filter @jsonforms/svelte-shadcn-example dev
```

Open the printed URL (usually `http://localhost:5173`). Expected: header band visible at top; sidebar shows "Example: <name>"; the form for the first example renders on the right with no console errors.

If the form is unstyled, check that `app.css` `@source` directives still cover the renderer-set source (they do in the current `app.css`, untouched).

Stop the dev server (`Ctrl+C`) before continuing.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte-shadcn/example/src/App.svelte
git commit -m "feat(svelte-shadcn-example): scaffold dev shell layout with first example"
```

---

## Task 3: Wire example selector + reactive `example`

**Files:**
- Modify: `packages/svelte-shadcn/example/src/App.svelte`

- [ ] **Step 1: Replace the `<script>` block**

Replace the existing `<script>` block with:

```svelte
<script lang="ts">
  import { JsonForms } from '@jsonforms/svelte';
  import { shadcnRenderers, shadcnCells } from '@jsonforms/svelte-shadcn';
  import { getExamples } from '@jsonforms/examples';
  import type { ErrorObject } from 'ajv';

  const examples = getExamples();

  let currentExampleName = $state(examples[0].name);
  const example = $derived(examples.find((e) => e.name === currentExampleName) ?? examples[0]);

  let data = $state<unknown>(examples[0].data);
  let i18n = $state(examples[0].i18n);
  let additionalErrors = $state<ErrorObject[]>([]);

  $effect(() => {
    // when the example changes, reset data + i18n to the example's defaults
    data = example.data;
    i18n = example.i18n;
  });

  function handleChange(e: { data: unknown; errors: unknown[] }) {
    data = e.data;
  }
</script>
```

- [ ] **Step 2: Replace the `<aside>` body with the selector**

Replace the placeholder `<p>` line inside `<aside>` with:

```svelte
<div class="space-y-2">
  <label for="example-select" class="block text-sm font-medium">Example</label>
  <select
    id="example-select"
    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    bind:value={currentExampleName}
  >
    {#each examples as ex (ex.name)}
      <option value={ex.name}>{ex.label}</option>
    {/each}
  </select>
</div>
```

- [ ] **Step 3: Confirm the form invocation is unchanged**

The `<section>` `{#key example.name}` block from Task 2 already reads from `example` and from the reactive `i18n` state — no edit needed here. Confirm it still matches:

```svelte
{#key example.name}
  <JsonForms
    data={example.data}
    schema={example.schema}
    uischema={example.uischema}
    renderers={shadcnRenderers}
    cells={shadcnCells}
    i18n={i18n}
    additionalErrors={additionalErrors}
    onchange={handleChange}
  />
{/key}
```

- [ ] **Step 4: Smoke-test the selector**

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm --filter @jsonforms/svelte-shadcn-example dev
```

Open the app. Verify:
- Selector shows all examples (>30 entries).
- Picking another example replaces the form (header text within the form may change; the form clearly re-mounts).
- No console errors. Some examples may render with `UnknownRenderer` placeholders — that is expected and not a failure.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add packages/svelte-shadcn/example/src/App.svelte
git commit -m "feat(svelte-shadcn-example): wire example selector with reactive switching"
```

---

## Task 4: Wire data / schema / uischema viewers

**Files:**
- Modify: `packages/svelte-shadcn/example/src/App.svelte`

- [ ] **Step 1: Add three `<details>` viewers below the selector**

Inside `<aside>`, after the selector `<div>`, append:

```svelte
<details class="rounded-md border border-border bg-card">
  <summary class="cursor-pointer px-3 py-2 text-sm font-medium">data</summary>
  <pre class="max-h-64 overflow-auto bg-muted p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
</details>

<details class="rounded-md border border-border bg-card">
  <summary class="cursor-pointer px-3 py-2 text-sm font-medium">schema</summary>
  <pre class="max-h-64 overflow-auto bg-muted p-3 text-xs">{JSON.stringify(example.schema, null, 2)}</pre>
</details>

<details class="rounded-md border border-border bg-card">
  <summary class="cursor-pointer px-3 py-2 text-sm font-medium">uischema</summary>
  <pre class="max-h-64 overflow-auto bg-muted p-3 text-xs">{JSON.stringify(example.uischema, null, 2)}</pre>
</details>
```

- [ ] **Step 2: Smoke-test the viewers**

```bash
pnpm --filter @jsonforms/svelte-shadcn-example dev
```

Open the app. Verify:
- Three `<details>` blocks render below the selector and toggle open/closed.
- The `data` block updates live as the user edits the form (e.g., type into a name field — JSON in the viewer reflects the new value).
- Switching examples updates `schema` and `uischema` content.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte-shadcn/example/src/App.svelte
git commit -m "feat(svelte-shadcn-example): add data/schema/uischema viewers"
```

---

## Task 5: Wire i18n translator textarea

**Files:**
- Modify: `packages/svelte-shadcn/example/src/App.svelte`

- [ ] **Step 1: Add a `get` helper import**

Lodash is a workspace transitive dep already; we want `lodash/get` for nested key lookup in translation JSON. Add to the script's imports:

```ts
import get from 'lodash/get';
```

If lodash isn't resolvable from the example package, add it to the example's `dependencies`:

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm --filter @jsonforms/svelte-shadcn-example add lodash
```

(Run only if the import fails. Verify by running `pnpm --filter @jsonforms/svelte-shadcn-example dev` — TypeScript / Vite will surface a missing-module error if so.)

- [ ] **Step 2: Add the change handler in `<script>`**

After `handleChange`, add:

```ts
function onTranslationChange(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  try {
    const input = JSON.parse(target.value);
    i18n = {
      ...i18n,
      translate: (key: string, defaultMessage: string | undefined) => {
        const translated = get(input, key) as string | undefined;
        return translated ?? defaultMessage;
      },
    };
  } catch {
    console.log('invalid translation input');
  }
}
```

- [ ] **Step 3: Add the textarea inside `<aside>`**

After the three `<details>` blocks, append:

```svelte
<div class="space-y-2">
  <label for="i18n-input" class="block text-sm font-medium">i18n translator</label>
  <textarea
    id="i18n-input"
    class="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
    placeholder={'{ "key": "translation" }'}
    onchange={onTranslationChange}
  ></textarea>
</div>
```

- [ ] **Step 4: Smoke-test the translator**

```bash
pnpm --filter @jsonforms/svelte-shadcn-example dev
```

Pick the `i18n` example from the selector (it has translatable labels). Paste a JSON object into the textarea that overrides one of the labels — e.g. for the `person` example you might try `{"firstName.label": "Vorname"}` (key path varies per example; goal is just to confirm the swap works). Tab out of the textarea (the change handler fires on `change`, not on every keystroke). Verify a label updates without the form re-mounting.

Pasting invalid JSON should not break the app — only logs `invalid translation input` to the console.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add packages/svelte-shadcn/example/src/App.svelte packages/svelte-shadcn/example/package.json pnpm-lock.yaml
git commit -m "feat(svelte-shadcn-example): add i18n translator textarea"
```

(Include `package.json` and `pnpm-lock.yaml` only if Step 1 actually added lodash.)

---

## Task 6: Wire URL hash sync

**Files:**
- Modify: `packages/svelte-shadcn/example/src/App.svelte`

- [ ] **Step 1: Add `onMount` import and hash logic**

In the `<script>` block, add to imports:

```ts
import { onMount } from 'svelte';
```

After the existing `$effect` that resets `data`/`i18n`, add:

```ts
onMount(() => {
  const hash = window.location.hash.slice(1);
  if (hash && examples.some((e) => e.name === hash)) {
    currentExampleName = hash;
  }
});

$effect(() => {
  // keep URL in sync with selection (browser only; no-op during SSR)
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.hash = currentExampleName;
  window.history.replaceState({}, '', url);
});
```

`replaceState` (rather than `pushState`) avoids polluting the history stack with every selection change. The Vue example uses `pushState`; this is a small intentional improvement.

- [ ] **Step 2: Smoke-test the hash sync**

```bash
pnpm --filter @jsonforms/svelte-shadcn-example dev
```

Verify:
- Initial load with no hash: first example is selected; URL gains `#<firstExampleName>` after mount.
- Pick a different example: URL hash updates.
- Reload the page: the example named in the hash is preselected.
- Manually set the hash to an invalid value (`#nope`) and reload: app falls back to the first example without throwing.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte-shadcn/example/src/App.svelte
git commit -m "feat(svelte-shadcn-example): sync selected example with URL hash"
```

---

## Task 7: Smoke-test breadth + production build

**Files:**
- (verification only)

- [ ] **Step 1: Manually walk a representative spread of examples**

```bash
pnpm --filter @jsonforms/svelte-shadcn-example dev
```

For each of the following examples (selectable from the dropdown), confirm the form renders without throwing and basic interaction works (typing into inputs updates `data`):

- `person`
- `login`
- `array`
- `categorization`
- `oneOf`
- `i18n`
- `additional-errors`
- `dates`
- `numbers`
- `enum`

It is **expected** that some examples render with rough spots or `UnknownRenderer` placeholders where svelte-shadcn lacks a specialized renderer. That is not a failure — it is part of why the example app exists.

Note any uncaught console errors (not warnings) as bugs to file separately. Acceptance criterion: no example causes an uncaught exception that breaks the page.

Stop the dev server.

- [ ] **Step 2: Production build**

```bash
export PATH="/home/gustavo/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/corepack/shims:$PATH"
pnpm --filter @jsonforms/svelte-shadcn-example build
```

Expected: build succeeds; `packages/svelte-shadcn/example/dist/index.html` exists; no errors. Warnings about unused exports are acceptable.

- [ ] **Step 3: Production preview sanity check**

```bash
pnpm --filter @jsonforms/svelte-shadcn-example preview
```

Open the printed URL. Verify the app loads and the selector works (do not re-walk all examples; just confirm the production bundle is functional).

Stop the preview server.

- [ ] **Step 4: Commit nothing (verification-only task)**

If any verification revealed a real bug introduced in earlier tasks, fix it as an additional commit, not by amending. If everything passed, this task produces no commit.

---

## Task 8: Open the PR

**Files:**
- (no file changes)

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin feature/svelte-shadcn-example-port
gh pr create --base master --head feature/svelte-shadcn-example-port \
  --title "feat(svelte-shadcn): port Vue Vanilla example app" \
  --body "$(cat <<'EOF'
## Summary
- Replaces the minimal svelte-shadcn example with a full dev shell (selector, sidebar viewers, i18n editor, hash sync) loaded from \`@jsonforms/examples\`.
- Neutral chrome (plain HTML + Tailwind utilities) so the renderers are the visual subject. No shadcn primitives in the chrome; no outer Card around the form.
- \`mergeStyles\` demo dropped — no equivalent in svelte-shadcn (deferred to its own spec).

## Test plan
- [ ] \`pnpm --filter @jsonforms/svelte-shadcn-example dev\` boots; selector lists all examples
- [ ] Switching examples re-mounts the form; data viewer updates live as user types
- [ ] Reloading with \`#login\` (or other valid name) preselects that example
- [ ] i18n textarea live-translates labels; invalid JSON is silently ignored
- [ ] \`pnpm --filter @jsonforms/svelte-shadcn-example build\` succeeds

## Spec & plan
- Spec: \`docs/superpowers/specs/2026-04-24-svelte-shadcn-example-port-design.md\`
- Plan: \`docs/superpowers/plans/2026-04-24-svelte-shadcn-example-port.md\`
EOF
)"
```

Print the resulting PR URL so the operator can review.

---

## Self-review checklist (executor: skim before declaring done)

- All seven implementation tasks committed cleanly; no `git status` leftovers.
- App.svelte is one focused file (~150 lines); no dead code.
- `<JsonForms>` invocation in App.svelte still uses explicit canonical props (data/schema/uischema/renderers/cells/i18n/additionalErrors/onchange).
- No shadcn primitive imports inside App.svelte (Card/Tabs/Select-component/etc.) — chrome must be plain HTML + Tailwind per the spec's "neutral shell" decision.
- No outer wrapper Card around the form.
- `pnpm --filter @jsonforms/svelte-shadcn-example build` succeeds.
- PR is open against `master`.
