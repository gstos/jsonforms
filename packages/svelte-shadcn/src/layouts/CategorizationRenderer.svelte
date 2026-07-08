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
  import { getJsonFormsCategorization, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import Tabs from '../ui/tabs/tabs.svelte';
  import TabsList from '../ui/tabs/tabs-list.svelte';
  import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';
  import TabsContent from '../ui/tabs/tabs-content.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);

  // Preserve the ORIGINAL index when filtering so tab identity is stable
  // even as earlier categories toggle visibility (upstream fix semantics).
  const visibleCategories = $derived(
    categories
      .map((category, originalIndex) => ({ category, originalIndex }))
      .filter((entry) => entry.category.visible)
  );

  let active = $state('');
  $effect(() => {
    const values = visibleCategories.map((e) => String(e.originalIndex));
    if (!values.includes(active)) {
      active = values[0] ?? '';
    }
  });
</script>

{#if layout.visible}
  <Tabs value={active} onValueChange={(v) => { active = v; }}>
    <TabsList>
      {#each visibleCategories as { category, originalIndex } (originalIndex)}
        <TabsTrigger value={String(originalIndex)} disabled={!category.enabled}>
          {category.label}
        </TabsTrigger>
      {/each}
    </TabsList>
    {#each visibleCategories as { category, originalIndex } (originalIndex)}
      <TabsContent value={String(originalIndex)}>
        {#each (category.uischema as any).elements as el}
          <DispatchRenderer
            schema={category.schema}
            uischema={el}
            path={category.path}
            enabled={category.enabled}
            renderers={category.renderers}
            cells={category.cells}
          />
        {/each}
      </TabsContent>
    {/each}
  </Tabs>
{/if}
