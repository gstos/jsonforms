<script lang="ts">
  import {
    getJsonFormsControl,
    type ControlProps,
  } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Slider from '../ui/slider/slider.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    <Slider
      type="multiple"
      value={[b.control.data ?? b.control.schema.default ?? b.control.schema.minimum ?? 0]}
      min={b.control.schema.minimum}
      max={b.control.schema.maximum}
      step={b.control.schema.multipleOf ?? 1}
      onValueChange={(v) => b.onChange(v[0])}
      disabled={!b.control.enabled}
    />
    <span class="text-xs text-muted-foreground">{b.control.data}</span>
  </div>
</ControlWrapper>
