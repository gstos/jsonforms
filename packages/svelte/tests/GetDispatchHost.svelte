<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import GetDispatchProbe from './GetDispatchProbe.svelte';

  let { provided, optional = false } = $props<{
    provided: { jsonforms: any; dispatch: any } | null;
    optional?: boolean;
  }>();

  if (provided) {
    setJsonFormsContext(provided);
  }
</script>

<GetDispatchProbe {optional} />
