<script lang="ts">
  import { Slider as SliderPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';

  type Props = SliderPrimitive.RootProps & { class?: string };
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
