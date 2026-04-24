<script lang="ts">
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<div class={cn('p-6 pt-0', className)} {...rest}>
  {@render children?.()}
</div>
