<script lang="ts">
  import { getJsonFormsEnumCell, type ControlProps } from '@jsonforms/svelte';
  import Select from '../ui/select/select.svelte';
  import SelectTrigger from '../ui/select/select-trigger.svelte';
  import SelectContent from '../ui/select/select-content.svelte';
  import SelectItem from '../ui/select/select-item.svelte';

  let props: ControlProps = $props();
  const { cell, handleChange } = getJsonFormsEnumCell(props);
</script>

<Select
  type="single"
  value={cell.data ?? ''}
  onValueChange={(v) => handleChange(cell.path, v)}
  disabled={!cell.enabled}
>
  <SelectTrigger>
    {cell.data ?? 'Select…'}
  </SelectTrigger>
  <SelectContent>
    {#each cell.options ?? [] as option}
      <SelectItem value={option.value}>
        {#snippet itemChildren()}
          {option.label}
        {/snippet}
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
