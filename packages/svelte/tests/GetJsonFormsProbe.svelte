<script lang="ts">
  import { getJsonForms } from '../src/context.svelte';

  let { optional = false } = $props<{ optional?: boolean }>();

  let jsonforms;
  if (optional) {
    jsonforms = getJsonForms(true);
  } else {
    jsonforms = getJsonForms();
  }

  const display = jsonforms ? String(jsonforms.core?.data) : 'undefined';
</script>

<span data-testid="probe">{display}</span>
