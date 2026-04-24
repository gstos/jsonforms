<script lang="ts">
  import { getJsonFormsControl } from '../src/compositions.svelte';
  import type { ControlProps } from '../src/types';

  let props: ControlProps = $props();
  const { control, handleChange } = getJsonFormsControl(props);

  // Expose for test assertions
  (globalThis as any).__probe = { control, handleChange };
</script>

<span data-testid="path">{control.path}</span>
<span data-testid="data">{JSON.stringify(control.data)}</span>
<span data-testid="errors">{control.errors}</span>
