<script lang="ts">
  import { getDispatch } from '../src/context.svelte';

  let { optional = false } = $props<{ optional?: boolean }>();

  let dispatch;
  if (optional) {
    dispatch = getDispatch(true);
  } else {
    dispatch = getDispatch();
  }

  const display = typeof dispatch;
</script>

<span data-testid="probe">{display}</span>
