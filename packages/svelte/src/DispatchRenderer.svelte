<script lang="ts">
  import maxBy from 'lodash/maxBy';
  import type { Component } from 'svelte';
  import { getJsonFormsRenderer } from './compositions.svelte';
  import UnknownRenderer from './UnknownRenderer.svelte';
  import type { RendererProps } from './types';

  let props: RendererProps = $props();

  // Keep the whole binding object — destructuring its getters once would
  // snapshot $derived values and break post-mount reactivity.
  const bindings = getJsonFormsRenderer(props);

  const determined = $derived.by<Component>(() => {
    const testerContext = {
      rootSchema: bindings.rootSchema,
      config: props.config,
    };
    const best = maxBy(bindings.renderer.renderers, (r) =>
      r.tester(bindings.renderer.uischema, bindings.renderer.schema, testerContext)
    );
    if (
      best === undefined ||
      best.tester(bindings.renderer.uischema, bindings.renderer.schema, testerContext) === -1
    ) {
      return UnknownRenderer as unknown as Component;
    }
    return best.renderer as unknown as Component;
  });

  // `bindings.renderer` already has schema/uischema/path/etc. merged in — spread it.
  const forwardProps = $derived({ ...bindings.renderer });
</script>

{#if determined === UnknownRenderer}
  <UnknownRenderer />
{:else}
  {@const Comp = determined}
  <Comp {...forwardProps} />
{/if}
