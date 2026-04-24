<script lang="ts">
  import { getJsonFormsCell, type ControlProps } from '@jsonforms/svelte';
  import Checkbox from '../ui/checkbox/checkbox.svelte';

  let props: ControlProps = $props();
  const { cell, handleChange } = getJsonFormsCell(props);
</script>

<Checkbox
  checked={!!cell.data}
  onCheckedChange={(v) => handleChange(cell.path, v === true)}
  disabled={!cell.enabled}
/>
