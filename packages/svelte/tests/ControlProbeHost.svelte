<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import { coreReducer, type CoreActions } from '@jsonforms/core';
  import ControlProbe from './ControlProbe.svelte';
  import type { JsonFormsSubStates } from '@jsonforms/core';
  import type { ControlProps } from '../src/types';

  let { jsonforms, probeProps } = $props<{
    jsonforms: JsonFormsSubStates;
    probeProps: ControlProps;
  }>();

  function dispatch(action: CoreActions) {
    jsonforms.core = coreReducer(jsonforms.core, action);
  }

  setJsonFormsContext({ jsonforms, dispatch });
</script>

<ControlProbe {...probeProps} />
