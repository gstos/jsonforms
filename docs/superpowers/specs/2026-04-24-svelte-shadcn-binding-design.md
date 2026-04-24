# JSON Forms Svelte/ShadCN Binding Design

## Overview

Add Svelte 5 framework bindings and a shadcn-svelte renderer set to the JSON Forms monorepo, based on the architecture of the existing Vue binding (`@jsonforms/vue`) and vue-vanilla renderer set (`@jsonforms/vue-vanilla`).

Two new packages:
- **`@jsonforms/svelte`** — Framework binding layer connecting `@jsonforms/core` to Svelte 5's reactivity system
- **`@jsonforms/svelte-shadcn`** — Renderer set using shadcn-svelte components (built on bits-ui + Tailwind CSS)

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Svelte version | Svelte 5 (runes only) | `$state`/`$derived`/`$effect` map 1:1 to Vue's `ref`/`computed`/`watch` |
| Repository | Inside jsonforms monorepo | Shares build orchestration, lerna versioning, workspace dependencies |
| Renderer scope | Full parity with vue-vanilla | ~26 components (21 renderers + 5 cells) covering all JSON Schema types |
| ShadCN coupling | Tightly coupled | Ships own thin wrappers on bits-ui, follows shadcn-svelte styling conventions |
| Reactivity approach | Context + Runes (Approach A) | Cleanest port from Vue, smallest binding layer, native Svelte 5 idioms |
| Testing | Vitest + @testing-library/svelte | Modern, fast, native ESM, standard in Svelte ecosystem |
| Build | Vite + @sveltejs/package | Standard Svelte library toolchain; outputs preserved .svelte files + .js + .d.ts |
| Base binding | Vue (`@jsonforms/vue`) | Closest reactivity model, simplest binding (~954 LOC), provide/inject maps to setContext/getContext |

## Package Structure

```
packages/
├── svelte/                          # @jsonforms/svelte
│   ├── src/
│   │   ├── index.ts                 # Public API exports
│   │   ├── JsonForms.svelte         # Root provider component
│   │   ├── DispatchRenderer.svelte  # Dynamic renderer selector
│   │   ├── DispatchCell.svelte      # Dynamic cell selector
│   │   ├── UnknownRenderer.svelte   # Fallback renderer
│   │   ├── context.svelte.ts        # Context keys + helpers
│   │   ├── compositions.svelte.ts   # All getJsonFormsXxx() functions
│   │   └── types.ts                 # Svelte-specific types
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── svelte-shadcn/                   # @jsonforms/svelte-shadcn
│   ├── src/
│   │   ├── index.ts                 # Public exports + renderer registry
│   │   ├── renderers.ts             # Aggregated shadcnRenderers array
│   │   ├── cells.ts                 # Aggregated shadcnCells array
│   │   ├── controls/
│   │   │   ├── index.ts             # exports controlRenderers[]
│   │   │   ├── ControlWrapper.svelte
│   │   │   ├── StringControlRenderer.svelte
│   │   │   ├── StringControlRenderer.ts
│   │   │   ├── NumberControlRenderer.svelte
│   │   │   ├── NumberControlRenderer.ts
│   │   │   ├── IntegerControlRenderer.svelte
│   │   │   ├── IntegerControlRenderer.ts
│   │   │   ├── BooleanControlRenderer.svelte
│   │   │   ├── BooleanControlRenderer.ts
│   │   │   ├── EnumControlRenderer.svelte
│   │   │   ├── EnumControlRenderer.ts
│   │   │   ├── OneOfEnumControlRenderer.svelte
│   │   │   ├── OneOfEnumControlRenderer.ts
│   │   │   ├── MultiStringControlRenderer.svelte
│   │   │   ├── MultiStringControlRenderer.ts
│   │   │   ├── DateControlRenderer.svelte
│   │   │   ├── DateControlRenderer.ts
│   │   │   ├── DateTimeControlRenderer.svelte
│   │   │   ├── DateTimeControlRenderer.ts
│   │   │   ├── SliderControlRenderer.svelte
│   │   │   └── SliderControlRenderer.ts
│   │   ├── layouts/
│   │   │   ├── index.ts             # exports layoutRenderers[]
│   │   │   ├── VerticalLayoutRenderer.svelte
│   │   │   ├── VerticalLayoutRenderer.ts
│   │   │   ├── HorizontalLayoutRenderer.svelte
│   │   │   ├── HorizontalLayoutRenderer.ts
│   │   │   ├── GroupRenderer.svelte
│   │   │   ├── GroupRenderer.ts
│   │   │   ├── CategorizationRenderer.svelte
│   │   │   └── CategorizationRenderer.ts
│   │   ├── complex/
│   │   │   ├── index.ts             # exports complexRenderers[]
│   │   │   ├── ObjectRenderer.svelte
│   │   │   ├── ObjectRenderer.ts
│   │   │   ├── OneOfRenderer.svelte
│   │   │   ├── OneOfRenderer.ts
│   │   │   ├── AnyOfRenderer.svelte
│   │   │   ├── AnyOfRenderer.ts
│   │   │   ├── AllOfRenderer.svelte
│   │   │   ├── AllOfRenderer.ts
│   │   │   ├── EnumArrayRenderer.svelte
│   │   │   └── EnumArrayRenderer.ts
│   │   ├── array/
│   │   │   ├── index.ts             # exports arrayRenderers[]
│   │   │   ├── ArrayListRenderer.svelte
│   │   │   ├── ArrayListRenderer.ts
│   │   │   └── ArrayListElement.svelte
│   │   ├── labels/
│   │   │   ├── index.ts             # exports labelRenderers[]
│   │   │   ├── LabelRenderer.svelte
│   │   │   └── LabelRenderer.ts
│   │   ├── cells/
│   │   │   ├── index.ts             # exports cellRenderers[]
│   │   │   ├── TextCell.svelte
│   │   │   ├── TextCell.ts
│   │   │   ├── NumberCell.svelte
│   │   │   ├── NumberCell.ts
│   │   │   ├── IntegerCell.svelte
│   │   │   ├── IntegerCell.ts
│   │   │   ├── BooleanCell.svelte
│   │   │   ├── BooleanCell.ts
│   │   │   ├── EnumCell.svelte
│   │   │   └── EnumCell.ts
│   │   └── util/
│   │       ├── composition.ts       # useShadcnControl, useShadcnLayout, etc.
│   │       └── index.ts
│   ├── tests/
│   ├── example/
│   │   ├── src/
│   │   │   ├── App.svelte
│   │   │   ├── main.ts
│   │   │   └── app.css
│   │   ├── index.html
│   │   └── vite.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
```

## Dependency Graph

```
@jsonforms/core (existing, workspace dependency)
    |
    v
@jsonforms/svelte (new binding)
    peerDeps: @jsonforms/core, svelte >=5
    |
    v
@jsonforms/svelte-shadcn (new renderer set)
    peerDeps: @jsonforms/core, @jsonforms/svelte, svelte >=5,
              bits-ui, clsx, tailwind-merge, tailwindcss >=4
```

## Binding Layer Architecture (`@jsonforms/svelte`)

### JsonForms.svelte — Root Provider

**Props:** `data`, `schema`, `uischema`, `renderers`, `cells`, `config`, `readonly`, `uischemas`, `validationMode`, `ajv`, `i18n`, `additionalErrors`, `middleware`

**Callback:** `onchange?: (event: { data: any; errors: ErrorObject[] }) => void`

**Behavior:**
1. Auto-generates `schema` via `Generate.jsonSchema(data)` if not provided
2. Auto-generates `uischema` via `Generate.uiSchema(schema)` if not provided
3. Initializes core state by running `coreReducer`, `configReducer`, `i18nReducer`
4. Holds full `JsonFormsSubStates` as `$state`
5. Provides `{ jsonforms, dispatch }` to component tree via `setContext()`
6. Watches prop changes via `$effect` — re-runs reducers when props change
7. Fires `onchange` when `data` or `errors` change in core state
8. Renders `<DispatchRenderer schema={schema} uischema={uischema} path="" />`

**dispatch(action):**
- Applies middleware: `middleware(currentCore, action, coreReducer)`
- Updates `$state` with new core state
- Triggers reactive propagation to all consumers

### context.svelte.ts — Context System

```ts
import { setContext, getContext } from 'svelte';
import type { JsonFormsSubStates, Dispatch, CoreActions } from '@jsonforms/core';

const JSONFORMS_KEY = Symbol('jsonforms');

interface JsonFormsContext {
  jsonforms: JsonFormsSubStates;
  dispatch: Dispatch<CoreActions>;
}

export function setJsonFormsContext(ctx: JsonFormsContext): void {
  setContext(JSONFORMS_KEY, ctx);
}

export function getJsonFormsContext(): JsonFormsContext {
  return getContext<JsonFormsContext>(JSONFORMS_KEY);
}
```

### compositions.svelte.ts — Composition Functions

Each function follows the same pattern:
1. Call `getJsonFormsContext()` to get state + dispatch
2. Construct `{ jsonforms: ctx.jsonforms }` state object for core mappers
3. Return `$derived` reactive object mapped through core's `mapStateToXxxProps`
4. For controls: also return dispatch-mapped methods (handleChange, addItem, etc.)
5. Manage control IDs via `createId`/`removeId` lifecycle ($effect with cleanup)

**Full composition function list:**

| Function | Core State Mapper | Core Dispatch Mapper | Returns |
|---|---|---|---|
| `getJsonFormsControl` | `mapStateToControlProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsControlWithDetail` | `mapStateToControlWithDetailProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsEnumControl` | `mapStateToEnumControlProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsOneOfEnumControl` | `mapStateToOneOfEnumControlProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsArrayControl` | `mapStateToArrayControlProps` | `mapDispatchToArrayControlProps` | `{ control, addItem, removeItem, moveUp, moveDown }` |
| `getJsonFormsAllOfControl` | `mapStateToAllOfProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsAnyOfControl` | `mapStateToAnyOfProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsOneOfControl` | `mapStateToOneOfProps` | `mapDispatchToControlProps` | `{ control, handleChange }` |
| `getJsonFormsMultiEnumControl` | `mapStateToMultiEnumControlProps` | `mapDispatchToMultiEnumProps` | `{ control, handleChange, handleAdd }` |
| `getJsonFormsLayout` | `mapStateToLayoutProps` | — | `{ layout }` |
| `getJsonFormsArrayLayout` | `mapStateToArrayLayoutProps` | — | `{ layout }` |
| `getJsonFormsRenderer` | `mapStateToJsonFormsRendererProps` | — | `{ renderer, rootSchema }` |
| `getJsonFormsLabel` | `mapStateToLabelProps` | — | `{ label }` |
| `getJsonFormsCell` | `mapStateToCellProps` | `mapDispatchToControlProps` | `{ cell, handleChange }` |
| `getJsonFormsEnumCell` | `defaultMapStateToEnumCellProps` | `mapDispatchToControlProps` | `{ cell, handleChange }` |
| `getJsonFormsOneOfEnumCell` | `mapStateToOneOfEnumCellProps` | `mapDispatchToControlProps` | `{ cell, handleChange }` |
| `getJsonFormsDispatchCell` | `mapStateToDispatchCellProps` | `mapDispatchToControlProps` | `{ cell, handleChange }` |
| `getJsonFormsCategorization` | `mapStateToLayoutProps` (per category) | — | `{ layout, categories }` |
| `getJsonFormsMasterListItem` | `mapStateToMasterListItemProps` | — | `{ item }` |

### DispatchRenderer.svelte — Dynamic Renderer Selection

1. Receives props: `schema`, `uischema`, `path`, `enabled`, `renderers`, `cells`, `config`
2. Calls `getJsonFormsRenderer(props)` to get `{ renderer, rootSchema }`
3. Computes `determinedRenderer` as `$derived`:
   - Creates `testerContext = { rootSchema, config }`
   - Runs `maxBy(renderers, r => r.tester(uischema, schema, testerContext))`
   - Returns best match or `UnknownRenderer` if score is -1
4. Renders: `<svelte:component this={determinedRenderer} {...rendererProps} />`

### DispatchCell.svelte — Dynamic Cell Selection

Same algorithm as DispatchRenderer but selects from the `cells` registry instead of `renderers`.

## Renderer Set Architecture (`@jsonforms/svelte-shadcn`)

### ShadCN Component Strategy

The package ships its own thin component wrappers built directly on `bits-ui` + Tailwind utilities. This makes the package self-contained — users don't need to run `npx shadcn-svelte init` first. Components follow shadcn-svelte's CSS variable conventions (`--primary`, `--input`, `--ring`, etc.) for visual integration.

### Composition Utilities (`src/util/composition.ts`)

**`useShadcnControl(input, adaptValue?)`**

Wraps the result of any `getJsonFormsXxxControl(props)` call. Returns:
- Everything from the core binding (`control`, `handleChange`)
- `appliedOptions` — `$derived` merge of `config` + `uischema.options`
- `onChange(value)` — calls `handleChange(control.path, adaptValue(value))`
- `controlWrapper` — `$derived` object: `{ id, description, errors, label, visible, required }`
- `isFocused` — `$state(false)` for description visibility logic

**`useShadcnLayout(input)`**

Wraps `getJsonFormsLayout(props)`. Returns:
- Everything from core binding (`layout`)
- `appliedOptions` — `$derived` merge of `config` + `uischema.options`

**`useShadcnArrayControl(input)`**

Wraps `getJsonFormsArrayControl(props)`. Returns:
- Everything from `useShadcnControl`
- `childUiSchema` — `$derived` UI schema for array items
- `childLabelForIndex(index)` — label helper
- `translations` — array i18n strings (add, remove, no data, etc.)

### Renderer Registration Pattern

Each renderer has two files:

**Component file** (`.svelte`): The Svelte 5 component using `$props()`, composition functions, and ShadCN components.

**Entry file** (`.ts`): Exports the registry entry:
```ts
import Component from './Component.svelte';
import { rankWith, testerFn } from '@jsonforms/core';
export const entry = { renderer: Component, tester: rankWith(rank, testerFn) };
```

**Category index** (e.g., `controls/index.ts`): Aggregates entries into arrays:
```ts
export const controlRenderers = [stringEntry, numberEntry, ...];
```

**Root registry** (`renderers.ts`):
```ts
export const shadcnRenderers = [
  ...controlRenderers, ...layoutRenderers, ...complexRenderers,
  ...arrayRenderers, ...labelRenderers,
];
export const shadcnCells = [...cellRenderers];
```

### ControlWrapper.svelte

Shared wrapper for all control renderers. Structure:
- `{#if visible}` visibility gate
- shadcn `Label` component (with required asterisk logic via `computeLabel` from core)
- `{@render children()}` snippet slot for the actual input
- Description text (shown on focus or via `showUnfocusedDescription` option, using `isDescriptionHidden` from core)
- Error message display

### Renderer Inventory

**Controls (10):**

| Renderer | ShadCN Component | Core Tester | Rank |
|---|---|---|---|
| StringControlRenderer | `Input` | `isStringControl` | 1 |
| NumberControlRenderer | `Input[type=number]` | `isNumberControl` | 1 |
| IntegerControlRenderer | `Input[type=number, step=1]` | `isIntegerControl` | 1 |
| BooleanControlRenderer | `Checkbox` | `isBooleanControl` | 1 |
| EnumControlRenderer | `Select` | `isEnumControl` | 2 |
| OneOfEnumControlRenderer | `Select` | `isOneOfEnumControl` | 2 |
| MultiStringControlRenderer | `Textarea` | `and(isStringControl, isMultiLineControl)` | 2 |
| DateControlRenderer | `Input[type=date]` | `isDateControl` | 2 |
| DateTimeControlRenderer | `Input[type=datetime-local]` | `isDateTimeControl` | 2 |
| SliderControlRenderer | `Slider` | `isRangeControl` | 2 |

**Layouts (4):**

| Renderer | ShadCN Component | Core Tester | Rank |
|---|---|---|---|
| VerticalLayoutRenderer | Flex column div | `isLayout` (direction=column) | 1 |
| HorizontalLayoutRenderer | Flex row div | `isLayout` (direction=row) | 1 |
| GroupRenderer | `Card` + `CardHeader` + `CardContent` | `and(isLayout, uiTypeIs('Group'))` | 2 |
| CategorizationRenderer | `Tabs` + `TabsList` + `TabsContent` | `and(isCategorization, categorizationHasCategory)` | 2 |

**Complex (6):**

| Renderer | Approach | Core Tester | Rank |
|---|---|---|---|
| ObjectRenderer | Generates sub-layout via `Generate.uiSchema`, dispatches | `isObjectControl` | 2 |
| ArrayListRenderer | List with add/remove/reorder, uses `ArrayListElement` | `schemaTypeIs('array')` | 2 |
| OneOfRenderer | `Select` for schema choice + `DispatchRenderer` + `AlertDialog` confirmation | `isOneOfControl` | 3 |
| AnyOfRenderer | Same pattern as OneOf | `isAnyOfControl` | 3 |
| AllOfRenderer | Dispatches each sub-schema | `isAllOfControl` | 3 |
| EnumArrayRenderer | `Checkbox` group for multi-select | `isMultiEnumControl` | 3 |

**Labels (1):**

| Renderer | Component | Core Tester | Rank |
|---|---|---|---|
| LabelRenderer | Styled text | `uiTypeIs('Label')` | 1 |

**Cells (5):**

| Cell | Component | Core Tester | Rank |
|---|---|---|---|
| TextCell | `Input` (minimal) | `isStringControl` | 1 |
| NumberCell | `Input[type=number]` | `isNumberControl` | 1 |
| IntegerCell | `Input[type=number]` | `isIntegerControl` | 1 |
| BooleanCell | `Checkbox` | `isBooleanControl` | 1 |
| EnumCell | `Select` (minimal) | `isEnumControl` | 2 |

**Total: 26 components** (21 renderers + 5 cells) + ControlWrapper + ArrayListElement = 28 component files.

## Build & Tooling

### Build Pipeline

Both packages use **Vite + `@sveltejs/package`** (`svelte-package` CLI):
- Input: `src/` directory
- Output: `dist/` directory containing preserved `.svelte` files, compiled `.js`, `.d.ts` type declarations
- Consumers compile `.svelte` files themselves (standard Svelte library convention)

**package.json exports:**
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

### Testing

**Framework:** Vitest + @testing-library/svelte + jsdom

**Binding tests (`packages/svelte/tests/`):**
- JsonForms.svelte: renders with schema+data, fires onchange, auto-generates uischema, respects readonly/validationMode
- DispatchRenderer.svelte: selects correct renderer by tester score, falls back to UnknownRenderer
- DispatchCell.svelte: same for cells
- Composition functions: return correct mapped props, react to state changes
- Context: provides and injects correctly across component tree

**Renderer tests (`packages/svelte-shadcn/tests/`):**
- Each renderer: renders correct component, handles value changes, respects enabled/readonly/visible, shows errors and labels
- Layouts: renders children via DispatchRenderer, handles direction, visibility
- Array: add/remove/reorder items, min/max constraints, empty state message
- Complex: OneOf schema switching with confirmation dialog, Object sub-rendering
- Cells: render minimal inputs, handle changes

### Example Application

Located at `packages/svelte-shadcn/example/`:
- Uses shared example data from `packages/examples/`
- Vite dev server for development (`pnpm run dev`)
- Builds to static output for integration into `packages/examples-app/`
- Includes Tailwind CSS setup with shadcn CSS variables

### Lerna Integration

- Both packages covered by existing `packages/*` glob in `pnpm-workspace.yaml`
- Build order: `core` -> `svelte` -> `svelte-shadcn` (automatic via dependency graph)
- Version: `3.8.0-alpha.0` (synced with monorepo)
- Scripts: `build`, `clean`, `lint`, `lint:fix`, `test`, `doc`

## User-Facing API

### Basic Usage

```svelte
<script lang="ts">
  import { JsonForms } from '@jsonforms/svelte';
  import { shadcnRenderers, shadcnCells } from '@jsonforms/svelte-shadcn';

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'integer', minimum: 0 },
      active: { type: 'boolean' },
    },
    required: ['name'],
  };

  let data = $state({ name: 'John', age: 30, active: true });

  function handleChange(event: { data: any; errors: any[] }) {
    data = event.data;
  }
</script>

<JsonForms
  {schema}
  {data}
  renderers={shadcnRenderers}
  cells={shadcnCells}
  onchange={handleChange}
/>
```

### Custom Renderers

```svelte
<!-- RatingControl.svelte -->
<script lang="ts">
  import { getJsonFormsControl } from '@jsonforms/svelte';
  import type { RendererProps } from '@jsonforms/svelte';

  let props: RendererProps = $props();
  const { control, handleChange } = getJsonFormsControl(props);
</script>

{#if control.visible}
  <!-- custom rating UI, calls handleChange(control.path, newValue) -->
{/if}
```

```ts
// RatingControl.entry.ts
import RatingControl from './RatingControl.svelte';
import { rankWith, scopeEndsWith } from '@jsonforms/core';

export const ratingControlEntry = {
  renderer: RatingControl,
  tester: rankWith(3, scopeEndsWith('rating')),
};

// Usage: renderers={[...shadcnRenderers, ratingControlEntry]}
```

### Configuration

All standard JSON Forms configuration works via props on `<JsonForms>`:
- `config` — global options (trim, showUnfocusedDescription, hideRequiredAsterisk)
- `readonly` — global readonly mode
- `validationMode` — 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation'
- `i18n` — `{ locale, translate, translateError }`
- `ajv` — custom AJV instance
- `additionalErrors` — extra validation errors
- `middleware` — action processing middleware
