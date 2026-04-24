<script lang="ts">
  import { getJsonFormsAllOfControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { createCombinatorRenderInfos } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsAllOfControl(props) });

  const infos = $derived(
    createCombinatorRenderInfos(
      (b.control.schema as any).allOf ?? [],
      b.control.rootSchema,
      'allOf',
      b.control.uischema,
      b.control.path,
      b.control.uischemas ?? []
    )
  );
</script>

{#if b.control.visible}
  <div class="flex flex-col gap-4">
    {#each infos as info}
      <DispatchRenderer schema={info.schema} uischema={info.uischema} path={b.control.path} enabled={b.control.enabled} />
    {/each}
  </div>
{/if}
