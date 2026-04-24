<script lang="ts">
  import { getJsonFormsMultiEnumControl, type ControlProps } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Checkbox from '../ui/checkbox/checkbox.svelte';
  import Label from '../ui/label/label.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsMultiEnumControl(props) as any });
  const selected = $derived(new Set((b.control.data as unknown[]) ?? []));

  function toggle(value: unknown, checked: boolean) {
    const next = new Set(selected);
    if (checked) next.add(value);
    else next.delete(value);
    b.onChange([...next]);
  }
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    {#each b.control.options ?? [] as opt}
      <div class="flex items-center gap-2">
        <Checkbox
          id={`${b.control.id}-${opt.value}`}
          checked={selected.has(opt.value)}
          onCheckedChange={(v) => toggle(opt.value, !!v)}
          disabled={!b.control.enabled}
        />
        <Label for={`${b.control.id}-${opt.value}`}>{opt.label}</Label>
      </div>
    {/each}
  </div>
</ControlWrapper>
