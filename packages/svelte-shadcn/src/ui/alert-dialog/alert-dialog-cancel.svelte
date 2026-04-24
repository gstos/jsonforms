<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';

  type Props = AlertDialogPrimitive.CancelProps & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Cancel
  class={cn(
    'mt-2 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground sm:mt-0',
    className
  )}
  {...rest}
>
  {@render children?.()}
</AlertDialogPrimitive.Cancel>
