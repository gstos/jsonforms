<script lang="ts">
  import { setJsonFormsContext } from '../src/context.svelte';
  import GetTranslatorProbe from './GetTranslatorProbe.svelte';

  let { provided, optional = false } = $props<{
    provided: { jsonforms: any; dispatch: any } | null;
    optional?: boolean;
  }>();

  if (provided) {
    setJsonFormsContext(provided);
  }
</script>

<GetTranslatorProbe {optional} />
