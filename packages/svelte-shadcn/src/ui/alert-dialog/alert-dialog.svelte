<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = AlertDialogPrimitive.RootProps & { children?: Snippet };
  let { children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Root {...rest}>
  {@render children?.()}
</AlertDialogPrimitive.Root>
