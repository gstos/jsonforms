<script lang="ts">
  import maxBy from 'lodash/maxBy';
  import type { Component } from 'svelte';
  import { getJsonFormsRenderer } from './compositions.svelte';
  import UnknownRenderer from './UnknownRenderer.svelte';
  import type { RendererProps } from './types';

  let props: RendererProps = $props();

  const { renderer, rootSchema } = getJsonFormsRenderer(props);

  const determined = $derived.by<Component>(() => {
    const testerContext = {
      rootSchema: rootSchema,
      config: props.config,
    };
    const best = maxBy(renderer.renderers, (r) =>
      r.tester(renderer.uischema, renderer.schema, testerContext)
    );
    if (
      best === undefined ||
      best.tester(renderer.uischema, renderer.schema, testerContext) === -1
    ) {
      return UnknownRenderer as unknown as Component;
    }
    return best.renderer as unknown as Component;
  });

  // `renderer` already has schema/uischema/path/etc. merged in — spread it.
  const forwardProps = $derived({ ...renderer });
</script>

{#if determined === UnknownRenderer}
  <UnknownRenderer />
{:else}
  {@const Comp = determined}
  <Comp {...forwardProps} />
{/if}
