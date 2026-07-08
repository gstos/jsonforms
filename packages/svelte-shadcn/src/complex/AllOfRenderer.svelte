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
  import { getJsonFormsAllOfControl, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { createCombinatorRenderInfos } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsAllOfControl(props) });

  const infos = $derived(
    createCombinatorRenderInfos(
      (b.control.schema as any).allOf ?? [],
      b.control.rootSchema,
      'allOf',
      b.control.uischema,
      b.control.path,
      b.control.uischemas ?? []
    )
  );
</script>

{#if b.control.visible}
  <div class="flex flex-col gap-4">
    {#each infos as info}
      <DispatchRenderer schema={info.schema} uischema={info.uischema} path={b.control.path} enabled={b.control.enabled} />
    {/each}
  </div>
{/if}
