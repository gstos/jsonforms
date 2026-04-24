<script lang="ts">
  import {
    getJsonFormsEnumControl,
    type ControlProps,
  } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Select from '../ui/select/select.svelte';
  import SelectTrigger from '../ui/select/select-trigger.svelte';
  import SelectContent from '../ui/select/select-content.svelte';
  import SelectItem from '../ui/select/select-item.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsEnumControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Select
    type="single"
    value={b.control.data ?? ''}
    onValueChange={(v) => b.onChange(v)}
    disabled={!b.control.enabled}
  >
    <SelectTrigger id={b.control.id}>
      {b.control.data ?? 'Select…'}
    </SelectTrigger>
    <SelectContent>
      {#each b.control.options ?? [] as option}
        <SelectItem value={option.value}>
          {#snippet itemChildren()}
            {option.label}
          {/snippet}
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
</ControlWrapper>
