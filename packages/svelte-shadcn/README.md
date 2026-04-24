# @jsonforms/svelte-shadcn

Svelte 5 shadcn-style renderer set for [JSON Forms](https://jsonforms.io/).

Built on `bits-ui` primitives and Tailwind CSS v4. Requires `@jsonforms/svelte` as the framework binding.

## Installation

```bash
npm install @jsonforms/core @jsonforms/svelte @jsonforms/svelte-shadcn bits-ui tailwindcss svelte
```

## Usage

### 1. Import tokens CSS

In your app's CSS entry point, import the shadcn CSS variables:

```css
@import "tailwindcss";
@import "@jsonforms/svelte-shadcn/styles/tokens.css";
```

### 2. Use the renderer set

```svelte
<script lang="ts">
  import { JsonForms } from '@jsonforms/svelte';
  import { shadcnRenderers } from '@jsonforms/svelte-shadcn';

  const schema = { type: 'object', properties: { name: { type: 'string' } } };
  const uischema = { type: 'VerticalLayout', elements: [{ type: 'Control', scope: '#/properties/name' }] };
  let data = { name: '' };
</script>

<JsonForms
  {schema}
  {uischema}
  {data}
  renderers={shadcnRenderers}
  on:change={(e) => (data = e.detail.data)}
/>
```

## License

MIT
