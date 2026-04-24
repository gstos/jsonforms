<script lang="ts">
  import {
    getJsonFormsControl,
    type ControlProps,
  } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Checkbox from '../ui/checkbox/checkbox.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex items-center gap-2">
    <Checkbox
      id={b.control.id}
      checked={!!b.control.data}
      onCheckedChange={(v) => b.onChange(v === true)}
      disabled={!b.control.enabled}
    />
  </div>
</ControlWrapper>
