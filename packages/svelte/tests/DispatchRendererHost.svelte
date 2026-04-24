<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import DispatchRenderer from '../src/DispatchRenderer.svelte';
  import type { JsonFormsSubStates } from '@jsonforms/core';

  let { jsonforms, rendererProps } = $props<{
    jsonforms: JsonFormsSubStates;
    rendererProps: any;
  }>();

  setJsonFormsContext({ jsonforms, dispatch: () => {} });
</script>

<DispatchRenderer {...rendererProps} />
