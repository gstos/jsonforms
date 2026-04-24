# @jsonforms/svelte-shadcn

Svelte 5 shadcn-style renderer set for [JSON Forms](https://jsonforms.io/).

Built on `bits-ui` primitives and Tailwind CSS v4. Requires `@jsonforms/svelte` as the framework binding.

## Installation

```bash
npm install @jsonforms/core @jsonforms/svelte @jsonforms/svelte-shadcn bits-ui tailwindcss svelte
```

## Usage

### 1. Configure Tailwind to scan this package

Tailwind v4 only scans your app's own source files by default. The renderer components live in this package, so you need to tell Tailwind to scan them — otherwise none of their utility classes land in your generated CSS and the form renders unstyled.

In your app's CSS entry point:

```css
@import "tailwindcss";

/* Scan the shadcn renderer components so their Tailwind classes are emitted. */
@source "../../node_modules/@jsonforms/svelte-shadcn/dist/**/*.{svelte,js}";

@import "@jsonforms/svelte-shadcn/styles/tokens.css";

/* Map the shadcn CSS variables to Tailwind color utilities. */
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --radius: var(--radius);
}
```

Adjust the `@source` path to wherever `@jsonforms/svelte-shadcn` resolves on your machine. The example app in this repo (`packages/svelte-shadcn/example/src/app.css`) demonstrates the equivalent setup for a workspace-local consumer.

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
