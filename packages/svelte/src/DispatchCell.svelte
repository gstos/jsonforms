<script lang="ts">
  import maxBy from 'lodash/maxBy';
  import type { Component } from 'svelte';
  import type { ControlElement } from '@jsonforms/core';
  import { getJsonFormsDispatchCell } from './compositions.svelte';
  import UnknownRenderer from './UnknownRenderer.svelte';
  import type { RendererProps } from './types';

  let props: RendererProps<ControlElement> = $props();

  const { cell } = getJsonFormsDispatchCell(props);

  const determined = $derived.by<Component>(() => {
    const testerContext = {
      rootSchema: cell.rootSchema,
      config: props.config,
    };
    const best = maxBy(cell.cells, (c) =>
      c.tester(cell.uischema, cell.schema, testerContext)
    );
    if (
      best === undefined ||
      best.tester(cell.uischema, cell.schema, testerContext) === -1
    ) {
      return UnknownRenderer as unknown as Component;
    }
    return best.cell as unknown as Component;
  });

  const forwardProps = $derived({ ...cell });
</script>

{#if determined === UnknownRenderer}
  <UnknownRenderer />
{:else}
  {@const Comp = determined}
  <Comp {...forwardProps} />
{/if}
