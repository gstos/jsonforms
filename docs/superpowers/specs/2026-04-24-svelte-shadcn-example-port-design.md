# Port Vue Vanilla example to svelte-shadcn — design

**Date:** 2026-04-24
**Subsystem:** `packages/svelte-shadcn/example/`
**Status:** Draft for review

## Goal

Replace the minimal `packages/svelte-shadcn/example/src/App.svelte` (single hardcoded schema) with a full dev shell that mirrors the Vue Vanilla example app's features.

The example app exists to **showcase the svelte-shadcn renderer set** by letting an evaluator flip through every JSON Forms example. The chrome around the form is intentionally neutral so the renderers are the visual subject — same logic Vue Vanilla applies to its own example.

## Reference

- **Source of truth for parity:** `packages/vue-vanilla/dev/components/App.vue` (219 lines)
- **Examples loader:** `getExamples()` from `@jsonforms/examples`
- **Existing minimal example being replaced:** `packages/svelte-shadcn/example/src/App.svelte`

## Visual approach: neutral shell

The chrome (header, selector, sidebar viewers, i18n editor, layout) uses **plain HTML elements styled with Tailwind utilities** — not shadcn primitives. Reasons:

- The form is the subject. A neutral chrome lets the shadcn-rendered controls stand out without competing for attention.
- Avoids "Card inside Card" framing artifacts when shadcn renderers (which already use Card-style framing internally) sit inside a shadcn-styled shell.
- Mirrors Vue Vanilla's choice: its example shell is plain CSS so the renderers are what's being evaluated.
- Keeps `example/package.json` lean: only the renderer-set dep, no extra UI primitives pulled in for chrome.

The form area is rendered **without an outer wrapper Card** for the same reason.

## Feature parity with Vue Vanilla

| Feature | Vue Vanilla | svelte-shadcn port |
|---|---|---|
| Load all examples from `@jsonforms/examples` `getExamples()` | yes | yes (workspace dep added) |
| Example selector | `<select>` | `<select>` (Tailwind-styled) |
| URL hash sync (`#exampleName`) | yes | yes — `onMount` for read, `$effect` for write |
| Sidebar viewers: data, schema, uischema | 3 `<details>` | 3 `<details>` (same structure) |
| i18n translator textarea | yes | `<textarea>` (Tailwind-styled), same JSON-parse → swap `i18n.translate` |
| `additionalErrors` plumbed through | yes | yes |
| Form re-mounts on example change | `:key="example.name"` | `{#key example.name}…{/key}` |
| Custom-styles demo (`mergeStyles`) | yes | **dropped** — no equivalent in svelte-shadcn |

## Layout

- **Header band:** title + tagline. Tailwind background/typography utilities. No framing component.
- **Tools row:** the example `<select>`. Plain control, Tailwind-styled.
- **Two-column main:**
  - Left sidebar: stacked `<details>` blocks (Data, Schema, UISchema) each containing a `<pre>` JSON viewer; below them an i18n translator `<textarea>`. Same affordances as Vue Vanilla, same widget choices.
  - Right: the `<JsonForms>` invocation, no outer Card. Just left-padding/spacing utilities so it sits naturally on the page.
- Stack to single column on narrow viewports via Tailwind responsive utilities.

## `<JsonForms>` call site — canonical

The form invocation is left explicit and copy-pasteable. Anyone reading the example sees the canonical pattern with no abstraction:

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

## State model (Svelte 5 runes)

- `let currentExampleName = $state(initialName)` — `initialName` comes from `location.hash.slice(1)` if it matches an example, else `examples[0].name`. Hash read happens in `onMount` to stay client-only.
- `const example = $derived(examples.find(e => e.name === currentExampleName)!)`
- `let data = $state<unknown>(example.data)` — replaced on `onchange`
- `let i18n = $state(example.i18n)` — replaced wholesale when example changes; `translate` swapped when textarea is edited
- `let additionalErrors = $state<ErrorObject[]>([])` — present and wired through; not surfaced in UI for v1
- `$effect` pushes `#${currentExampleName}` to `history` on selector change

## File changes

- **New:** `packages/svelte-shadcn/example/src/App.svelte` (full rewrite, ~150 lines)
- **Modified:** `packages/svelte-shadcn/example/package.json` — add `@jsonforms/examples: workspace:*` dependency
- **Untouched:** `packages/svelte-shadcn/src/` — pure example-app work, no changes to the renderer set
- **Untouched:** `vite.config.ts`, `index.html`, `main.ts`, `app.css` — configuration is already correct

## Out of scope

- `mergeStyles` / per-renderer class-injection demo. Svelte-shadcn has no equivalent mechanism, and inventing one belongs in its own spec.
- Polishing examples that render imperfectly due to missing specialized renderers (e.g., richer date pickers). All examples load unfiltered and render as-is; rough spots inform future renderer work.
- Adding shadcn primitives to the example app's chrome. Deliberately avoided per the "neutral shell" rationale above.

## Risks and sharp edges

- **Example compatibility.** Some examples in `@jsonforms/examples` use uischema features svelte-shadcn does not fully cover yet (e.g., specialized date inputs, certain layout options). They will render via the fallback `UnknownRenderer` or look rough. This is expected and serves as visible coverage gaps.
- **`@jsonforms/examples` consumption under Vite.** Vue's example imports it directly, so it should resolve. If Vite struggles with the package's CJS-flavored exports, fix at the package's `exports` field rather than working around it in the example.
- **Hash logic must be client-side.** All `window.location` / `window.history` reads/writes go inside `onMount` or `$effect`. SSR is not a concern here (Vite SPA), but the discipline keeps the code portable.
- **i18n translator robustness.** Pasted JSON may be invalid mid-edit; same as Vue, swallow `JSON.parse` errors silently and leave previous translator in place. Log to console for debug.

## Acceptance

- `pnpm --filter @jsonforms/svelte-shadcn-example dev` starts the example app.
- All entries from `getExamples()` appear in the selector and switching between them re-mounts the form.
- Reloading with `#login` (or any other valid example name) preselects that example.
- Editing the i18n translator JSON live-translates labels in the form.
- Data section updates as the user edits the form.
- `pnpm --filter @jsonforms/svelte-shadcn-example build` produces a clean production build.

## Implementation order (preview — full plan to follow)

1. Add `@jsonforms/examples` workspace dep, `pnpm install`.
2. Stand up the new `App.svelte` skeleton: header, tools row, two-column layout, hardcoded to one example.
3. Wire example selector + `$derived` example + `{#key}` re-mount.
4. Wire data/schema/uischema `<details>` viewers.
5. Wire i18n translator textarea.
6. Wire URL hash sync (read in `onMount`, write in `$effect`).
7. Smoke-test against a representative spread of examples (person, login, array, categorization, oneOf, i18n, additionalErrors).
8. Production build sanity check.
