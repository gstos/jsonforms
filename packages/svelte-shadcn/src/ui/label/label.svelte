<script lang="ts">
  import { cn } from '../../util/cn';
  import type { HTMLLabelAttributes } from 'svelte/elements';

  type Props = HTMLLabelAttributes & { class?: string };
  let { class: className, ...rest }: Props = $props();
</script>

<label
  class={cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    className
  )}
  {...rest}
>
  <slot />
</label>
