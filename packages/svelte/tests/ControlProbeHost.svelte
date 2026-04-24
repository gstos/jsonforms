<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import { coreReducer, type CoreActions, type Dispatch } from '@jsonforms/core';
  import ControlProbe from './ControlProbe.svelte';
  import type { JsonFormsSubStates } from '@jsonforms/core';
  import type { ControlProps } from '../src/types';

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

<ControlProbe {...probeProps} />
