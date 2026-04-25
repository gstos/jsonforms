<script lang="ts">
  import { JsonForms } from '@jsonforms/svelte';
  import { shadcnRenderers, shadcnCells } from '@jsonforms/svelte-shadcn';
  import { getExamples } from '@jsonforms/examples';
  import type { ErrorObject } from 'ajv';
  import get from 'lodash/get';

  const examples = getExamples();

  let currentExampleName = $state(examples[0].name);
  const example = $derived(examples.find((e) => e.name === currentExampleName) ?? examples[0]);

  let data = $state<unknown>(examples[0].data);
  let i18n = $state(examples[0].i18n);
  let additionalErrors = $state<ErrorObject[]>([]);

  $effect(() => {
    data = example.data;
    i18n = example.i18n;
  });

  function handleChange(e: { data: unknown; errors: unknown[] }) {
    data = e.data;
  }

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
</script>

<div class="min-h-screen flex flex-col gap-6">
  <header class="bg-slate-900 text-white text-center py-8 px-6 rounded-md">
    <h1 class="text-2xl font-bold">JSON Forms · Svelte + shadcn-svelte</h1>
    <p class="text-sm opacity-80 mt-1">More forms. Less code.</p>
  </header>

  <main class="grid gap-6 md:grid-cols-[20rem_minmax(0,1fr)]">
    <aside class="space-y-4">
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

      <div class="space-y-2">
        <label for="i18n-input" class="block text-sm font-medium">i18n translator</label>
        <textarea
          id="i18n-input"
          class="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
          placeholder={'{ "key": "translation" }'}
          onchange={onTranslationChange}
        ></textarea>
      </div>
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
