<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = AlertDialogPrimitive.TriggerProps & { children?: Snippet };
  let { children, ...rest }: Props = $props();
</script>

<AlertDialogPrimitive.Trigger {...rest}>
  {@render children?.()}
</AlertDialogPrimitive.Trigger>
