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
