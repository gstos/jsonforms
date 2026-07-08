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
  import { useShadcnLayout } from '../util/composition.svelte';
  import Button from '../ui/button/button.svelte';
  import Separator from '../ui/separator/separator.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);
  const shadcn = useShadcnLayout({ input: { layout } });

  // Preserve the ORIGINAL index when filtering so step identity is stable
  // even as earlier categories toggle visibility (mirrors CategorizationRenderer).
  const visibleCategories = $derived(
    categories
      .map((category, originalIndex) => ({ category, originalIndex }))
      .filter((entry) => entry.category.visible)
  );

  // Index into visibleCategories (vue-vanilla stepper semantics).
  let selected = $state(0);
  $effect(() => {
    if (selected >= visibleCategories.length) {
      selected = Math.max(0, visibleCategories.length - 1);
    }
  });
</script>

{#if layout.visible}
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      {#each visibleCategories as entry, i (entry.originalIndex)}
        <Button
          type="button"
          class={selected === i
            ? 'bg-primary text-primary-foreground'
            : 'bg-transparent text-foreground border border-input hover:bg-accent'}
          disabled={!entry.category.enabled}
          onclick={() => (selected = i)}
        >
          <span
            class="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs"
            >{i + 1}</span
          >
          {entry.category.label}
        </Button>
        {#if i !== visibleCategories.length - 1}
          <Separator class="flex-1" />
        {/if}
      {/each}
    </div>

    {#if visibleCategories[selected]}
      <div class="flex flex-col gap-2">
        {#each (visibleCategories[selected].category.uischema as any).elements as el}
          <DispatchRenderer
            schema={visibleCategories[selected].category.schema}
            uischema={el}
            path={visibleCategories[selected].category.path}
            enabled={visibleCategories[selected].category.enabled}
            renderers={visibleCategories[selected].category.renderers}
            cells={visibleCategories[selected].category.cells}
          />
        {/each}
      </div>
    {/if}

    {#if shadcn.appliedOptions?.showNavButtons}
      <footer class="flex items-center justify-between">
        <div>
          {#if selected > 0}
            <Button
              type="button"
              class="bg-transparent text-foreground border border-input hover:bg-accent"
              disabled={!visibleCategories[selected - 1].category.enabled}
              onclick={() => (selected = selected - 1)}>Back</Button
            >
          {/if}
        </div>
        <div>
          {#if selected + 1 < visibleCategories.length}
            <Button
              type="button"
              disabled={!visibleCategories[selected + 1].category.enabled}
              onclick={() => (selected = selected + 1)}>Next</Button
            >
          {/if}
        </div>
      </footer>
    {/if}
  </div>
{/if}
