<script lang="ts">
  import { getJsonFormsCell, type ControlProps } from '@jsonforms/svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const { cell, handleChange } = getJsonFormsCell(props);
</script>

<Input
  type="number"
  value={cell.data ?? ''}
  disabled={!cell.enabled}
  oninput={(e) => {
    const val = (e.currentTarget as HTMLInputElement).value;
    handleChange(cell.path, val === '' ? undefined : Number(val));
  }}
/>
