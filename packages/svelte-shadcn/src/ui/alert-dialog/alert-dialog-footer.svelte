<script lang="ts">
  import { cn } from '../../util/cn';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = HTMLAttributes<HTMLDivElement> & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<div class={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...rest}>
  {@render children?.()}
</div>
