<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import GetJsonFormsProbe from './GetJsonFormsProbe.svelte';

  let { provided, optional = false } = $props<{
    provided: { jsonforms: any; dispatch: any } | null;
    optional?: boolean;
  }>();

  if (provided) {
    setJsonFormsContext(provided);
  }
</script>

<GetJsonFormsProbe {optional} />
