<script lang="ts">
  import { getJsonFormsLayout, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import { useShadcnLayout } from '../util/composition.svelte';
  import { cn } from '../util/cn';

  let props: LayoutProps = $props();
  const b = useShadcnLayout({ input: getJsonFormsLayout(props) });
</script>

{#if b.layout.visible}
  <div class={cn('flex flex-row gap-4 items-start')}>
    {#each b.layout.uischema.elements as el}
      <DispatchRenderer
        schema={b.layout.schema}
        uischema={el}
        path={b.layout.path}
        enabled={b.layout.enabled}
        renderers={b.layout.renderers}
        cells={b.layout.cells}
      />
    {/each}
  </div>
{/if}
