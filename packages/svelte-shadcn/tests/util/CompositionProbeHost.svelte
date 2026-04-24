<script lang="ts">
  import { setJsonFormsContext } from '@jsonforms/svelte';
  import { coreReducer, type CoreActions, type Dispatch, type JsonFormsSubStates } from '@jsonforms/core';
  import CompositionProbe from './CompositionProbe.svelte';
  import type { ControlProps } from '@jsonforms/svelte';

  let { jsonforms, probeProps } = $props<{
    jsonforms: JsonFormsSubStates;
    probeProps: ControlProps;
  }>();

  const dispatch: Dispatch<CoreActions> = (action) => {
    jsonforms.core = coreReducer(jsonforms.core, action);
    return action;
  };

  setJsonFormsContext({ jsonforms, dispatch });
</script>

<CompositionProbe {...probeProps} />
