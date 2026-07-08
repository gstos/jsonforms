<!--
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
-->

<script lang="ts">
  import { getJsonFormsOneOfControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
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
  const b = useShadcnControl({ input: getJsonFormsOneOfControl(props) });

  const renderInfos = $derived(
    createCombinatorRenderInfos(
      (b.control.schema as any).oneOf ?? [],
      b.control.rootSchema,
      'oneOf',
      b.control.uischema,
      b.control.path,
      b.control.uischemas ?? []
    )
  );
  let selectedIndex = $state(b.control.indexOfFittingSchema ?? 0);
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
