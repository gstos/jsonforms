<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import DispatchCell from '../src/DispatchCell.svelte';
  import type { JsonFormsSubStates } from '@jsonforms/core';

  let { jsonforms, cellProps } = $props<{
    jsonforms: JsonFormsSubStates;
    cellProps: any;
  }>();

  setJsonFormsContext({ jsonforms, dispatch: () => {} });
</script>

<DispatchCell {...cellProps} />
