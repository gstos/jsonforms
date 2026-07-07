<script lang="ts">
  import { getAjv } from '../src/context.svelte';

  let { optional = false } = $props<{ optional?: boolean }>();

  let ajv;
  if (optional) {
    ajv = getAjv(true);
  } else {
    ajv = getAjv();
  }

  const display = typeof ajv;
</script>

<span data-testid="probe">{display}</span>
