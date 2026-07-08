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
  import { Select as SelectPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';

  // bits-ui 1.x Select.Item exposes { selected, highlighted } via the children snippet.
  // We intercept via our own `{#snippet children(...)}` block passed to the primitive.
  // Callers pass their own `itemChildren` snippet to render item text.
  interface Props extends Omit<SelectPrimitive.ItemProps, 'children'> {
    class?: string;
    itemChildren?: Snippet<[{ selected: boolean; highlighted: boolean }]>;
  }

  let { class: className, itemChildren, ...rest }: Props = $props();
</script>

<SelectPrimitive.Item
  class={cn(
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    className
  )}
  {...rest}
>
  {#snippet children({ selected, highlighted })}
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {#if selected}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      {/if}
    </span>
    {@render itemChildren?.({ selected, highlighted })}
  {/snippet}
</SelectPrimitive.Item>
