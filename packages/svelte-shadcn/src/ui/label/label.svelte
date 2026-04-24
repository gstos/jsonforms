<script lang="ts">
  import { cn } from '../../util/cn';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = HTMLLabelAttributes & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<label
  class={cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    className
  )}
  {...rest}
>
  {@render children?.()}
</label>
