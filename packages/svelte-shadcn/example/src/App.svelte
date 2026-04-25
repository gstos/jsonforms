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
