<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';

  type Props = AlertDialogPrimitive.TitleProps & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Title class={cn('text-lg font-semibold', className)} {...rest}>
  {@render children?.()}
</AlertDialogPrimitive.Title>
