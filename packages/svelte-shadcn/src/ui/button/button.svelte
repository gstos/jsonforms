<script lang="ts">
  import { cn } from '../../util/cn';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = HTMLButtonAttributes & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<button
  class={cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50',
    className
  )}
  {...rest}
>
  {@render children?.()}
</button>
