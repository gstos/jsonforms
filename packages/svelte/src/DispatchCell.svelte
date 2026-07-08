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
  import maxBy from 'lodash/maxBy';
  import type { Component } from 'svelte';
  import type { ControlElement } from '@jsonforms/core';
  import { getJsonFormsDispatchCell } from './compositions.svelte';
  import UnknownRenderer from './UnknownRenderer.svelte';
  import type { RendererProps } from './types';

  let props: RendererProps<ControlElement> = $props();

  const { cell } = getJsonFormsDispatchCell(props);

  const determined = $derived.by<Component>(() => {
    const testerContext = {
      rootSchema: cell.rootSchema,
      config: cell.config,
    };
    const best = maxBy(cell.cells, (c) =>
      c.tester(cell.uischema, cell.schema, testerContext)
    );
    if (
      best === undefined ||
      best.tester(cell.uischema, cell.schema, testerContext) === -1
    ) {
      return UnknownRenderer as unknown as Component;
    }
    return best.cell as unknown as Component;
  });

  const forwardProps = $derived({ ...cell });
</script>

{#if determined === UnknownRenderer}
  <UnknownRenderer />
{:else}
  {@const Comp = determined}
  <Comp {...forwardProps} />
{/if}
