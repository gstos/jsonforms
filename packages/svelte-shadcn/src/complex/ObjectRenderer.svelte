<script lang="ts">
  import { getJsonFormsControlWithDetail, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { Generate } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControlWithDetail(props) });

  const detailUiSchema = $derived(
    (b.appliedOptions.detail as any) ??
      Generate.uiSchema(b.control.schema, 'Group', undefined, b.control.schema)
  );
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <DispatchRenderer
    schema={b.control.schema}
    uischema={detailUiSchema}
    path={b.control.path}
    enabled={b.control.enabled}
  />
</ControlWrapper>
