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
