<script lang="ts">
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLHeadingElement> & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<h3 class={cn('font-semibold leading-none tracking-tight', className)} {...rest}>
  {@render children?.()}
</h3>
