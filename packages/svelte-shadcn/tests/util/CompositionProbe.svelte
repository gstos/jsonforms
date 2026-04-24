<script lang="ts">
  import { useShadcnControl } from '../../src/util/composition.svelte';
  import { getJsonFormsControl, type ControlProps } from '@jsonforms/svelte';

  let props: ControlProps = $props();
  const binding = useShadcnControl({
    input: getJsonFormsControl(props),
  });

  (globalThis as any).__compProbe = binding;
</script>

<span data-testid="merged-options">{JSON.stringify(binding.appliedOptions)}</span>
<span data-testid="label">{binding.controlWrapper.label}</span>
<span data-testid="visible">{String(binding.controlWrapper.visible)}</span>
