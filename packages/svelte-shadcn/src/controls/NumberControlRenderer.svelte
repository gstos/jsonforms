<script lang="ts">
  import {
    getJsonFormsControl,
    type ControlProps,
  } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Input
    id={b.control.id}
    type="number"
    value={b.control.data ?? ''}
    disabled={!b.control.enabled}
    oninput={(e) => {
      const val = (e.currentTarget as HTMLInputElement).value;
      b.onChange(val === '' ? undefined : Number(val));
    }}
    onfocus={() => (b.isFocused = true)}
    onblur={() => (b.isFocused = false)}
  />
</ControlWrapper>
