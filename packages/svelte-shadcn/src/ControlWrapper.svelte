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
  import Label from './ui/label/label.svelte';
  import { cn } from './util/cn';

  type Props = {
    id?: string;
    label?: string;
    description?: string;
    errors?: string;
    visible?: boolean;
    required?: boolean;
    descriptionHidden?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
  };

  let {
    id,
    label,
    description,
    errors,
    visible = true,
    required,
    descriptionHidden,
    class: className,
    children,
  }: Props = $props();
</script>

{#if visible}
  <div class={cn('flex flex-col gap-1.5', className)}>
    {#if label}
      <Label for={id}>
        {label}
        {#if required}
          <span class="text-destructive ml-0.5" aria-hidden="true">*</span>
        {/if}
      </Label>
    {/if}

    {@render children?.()}

    {#if description && !descriptionHidden}
      <p class="text-xs text-muted-foreground">{description}</p>
    {/if}

    {#if errors}
      <p class="text-xs text-destructive" role="alert">{errors}</p>
    {/if}
  </div>
{/if}
