<script lang="ts">
  import { getJsonFormsLabel, type RendererProps } from '@jsonforms/svelte';
  import type { LabelElement } from '@jsonforms/core';

  let props: RendererProps<LabelElement> = $props();
  const { label } = getJsonFormsLabel(props);
</script>

{#if label.visible}
  <p class="text-base font-medium">{label.text}</p>
{/if}
