<script lang="ts">
  import { getJsonFormsCell, type ControlProps } from '@jsonforms/svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const { cell, handleChange } = getJsonFormsCell(props);
</script>

<Input
  type="text"
  value={cell.data ?? ''}
  disabled={!cell.enabled}
  oninput={(e) => handleChange(cell.path, (e.currentTarget as HTMLInputElement).value)}
/>
