<script lang="ts">
  import { getJsonFormsAnyOfControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { createCombinatorRenderInfos, createDefaultValue } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui';
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
  } from '../ui';

  let props: ControlProps = $props();
  const b = $derived(useShadcnControl({ input: getJsonFormsAnyOfControl(props) }));

  const renderInfos = $derived(
    createCombinatorRenderInfos(
      (b.control.schema as any).anyOf ?? [],
      b.control.rootSchema,
      'anyOf',
      b.control.uischema,
      b.control.path,
      b.control.uischemas ?? []
    )
  );
  let selectedIndex = $state((function() {
    return b.control.indexOfFittingSchema ?? 0;
  })());
  let pendingIndex = $state<number | null>(null);
  let dialogOpen = $state(false);

  function requestChange(i: number) {
    if (b.control.data === undefined || b.control.data === null) {
      selectedIndex = i;
      b.onChange(createDefaultValue(renderInfos[i].schema, b.control.rootSchema));
    } else {
      pendingIndex = i;
      dialogOpen = true;
    }
  }

  function confirm() {
    if (pendingIndex !== null) {
      selectedIndex = pendingIndex;
      b.onChange(createDefaultValue(renderInfos[pendingIndex].schema, b.control.rootSchema));
      pendingIndex = null;
    }
    dialogOpen = false;
  }
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <Select type="single" value={String(selectedIndex)} onValueChange={(v) => requestChange(Number(v))}>
    <SelectTrigger>{renderInfos[selectedIndex]?.label}</SelectTrigger>
    <SelectContent>
      {#each renderInfos as info, i}
        <SelectItem value={String(i)}>
          {#snippet itemChildren()}
            {info.label}
          {/snippet}
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>

  {#if renderInfos[selectedIndex]}
    <DispatchRenderer
      schema={renderInfos[selectedIndex].schema}
      uischema={renderInfos[selectedIndex].uischema}
      path={b.control.path}
      enabled={b.control.enabled}
    />
  {/if}
</ControlWrapper>

<AlertDialog open={dialogOpen} onOpenChange={(newOpen) => (dialogOpen = newOpen)}>
  <AlertDialogContent>
    <AlertDialogTitle>Clear form?</AlertDialogTitle>
    <AlertDialogDescription>
      Switching the selection will clear the form. Are you sure?
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel onclick={() => (dialogOpen = false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onclick={confirm}>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
