<script lang="ts">
  import { getTranslator } from '../src/context.svelte';

  let { optional = false } = $props<{ optional?: boolean }>();

  let translator;
  if (optional) {
    translator = getTranslator(true);
  } else {
    translator = getTranslator();
  }

  const display = typeof translator;
</script>

<span data-testid="probe">{display}</span>
