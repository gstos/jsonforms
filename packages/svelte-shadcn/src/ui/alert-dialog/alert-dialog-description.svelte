<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';

  type Props = AlertDialogPrimitive.DescriptionProps & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Description class={cn('text-sm text-muted-foreground', className)} {...rest}>
  {@render children?.()}
</AlertDialogPrimitive.Description>
