<script lang="ts">
  import { getJsonFormsArrayControl, type ControlProps } from '@jsonforms/svelte';
  import { createDefaultValue } from '@jsonforms/core';
  import { useShadcnArrayControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import ArrayListElement from './ArrayListElement.svelte';
  import Button from '../ui/button/button.svelte';

  let props: ControlProps = $props();
  const b = useShadcnArrayControl({ input: getJsonFormsArrayControl(props) as any });

  function handleAdd() {
    b.addItem(b.control.path, createDefaultValue(b.control.schema, b.control.rootSchema))();
  }
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end">
      <Button type="button" onclick={handleAdd} disabled={!b.control.enabled}>+ {b.translations.addTooltip}</Button>
    </div>
    {#if (b.control.data as unknown[])?.length}
      {#each b.control.data as _item, i (i)}
        <ArrayListElement
          index={i}
          path={b.control.path}
          schema={b.control.schema}
          uischema={b.childUiSchema}
          enabled={b.control.enabled}
          removeItems={b.removeItems}
          moveUp={b.moveUp}
          moveDown={b.moveDown}
          translations={b.translations}
        />
      {/each}
    {:else}
      <p class="text-sm text-muted-foreground">{b.translations.noData}</p>
    {/if}
  </div>
</ControlWrapper>
