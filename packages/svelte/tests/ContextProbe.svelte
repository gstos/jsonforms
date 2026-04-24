<script lang="ts">
  import {
    setJsonFormsContext,
    getJsonFormsContext,
  } from '../src/context.svelte';

  let { provided } = $props<{
    provided: { jsonforms: any; dispatch: any } | null;
  }>();

  if (provided) {
    setJsonFormsContext(provided);
  }

  const ctx = getJsonFormsContext();
  const display = ctx ? String(ctx.jsonforms.core?.data) : 'no-context';
</script>

<span data-testid="probe">{display}</span>
