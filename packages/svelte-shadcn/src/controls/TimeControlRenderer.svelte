<script lang="ts">
  import { getJsonFormsControl, type ControlProps } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Input from '../ui/input/input.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({
    input: getJsonFormsControl(props),
    adaptValue: (value) => {
      const v = (value as string) || undefined;
      // Browsers report HH:MM when seconds are zero; normalize to HH:MM:SS
      // so the value round-trips through AJV 'time' format validation.
      return v && /^\d{2}:\d{2}$/.test(v) ? `${v}:00` : v;
    },
  });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Input
    id={b.control.id}
    type="time"
    step={typeof b.appliedOptions.step === 'number' ? b.appliedOptions.step : 1}
    placeholder={b.appliedOptions.placeholder}
    value={b.control.data ?? ''}
    disabled={!b.control.enabled}
    oninput={(e) => b.onChange((e.currentTarget as HTMLInputElement).value)}
    onfocus={() => (b.isFocused = true)}
    onblur={() => (b.isFocused = false)}
  />
</ControlWrapper>
