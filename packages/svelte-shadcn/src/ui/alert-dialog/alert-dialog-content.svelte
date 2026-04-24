<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';

  type Props = AlertDialogPrimitive.ContentProps & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Portal>
  <AlertDialogPrimitive.Overlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
  <AlertDialogPrimitive.Content
    class={cn(
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
      className
    )}
    {...rest}
  >
    {@render children?.()}
  </AlertDialogPrimitive.Content>
</AlertDialogPrimitive.Portal>
