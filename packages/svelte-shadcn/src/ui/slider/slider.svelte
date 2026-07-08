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
  import { Slider as SliderPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';

  // bits-ui 1.x Slider.Root is a discriminated union on `type: 'single' | 'multiple'`.
  // We pin to the 'multiple' variant so `value` is always `number[]`.
  // Callers must not pass `type="single"` — use value binding as an array.
  type Props = Extract<SliderPrimitive.RootProps, { type: 'multiple' }> & { class?: string };
  let { class: className, value = $bindable([0]), ...rest }: Props = $props();
</script>

<SliderPrimitive.Root
  bind:value
  class={cn(
    'relative flex w-full touch-none select-none items-center',
    className
  )}
  {...rest}
>
  <span class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
    <SliderPrimitive.Range class="absolute h-full bg-primary" />
  </span>
  {#each value as _, i (i)}
    <SliderPrimitive.Thumb
      index={i}
      class="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  {/each}
</SliderPrimitive.Root>
