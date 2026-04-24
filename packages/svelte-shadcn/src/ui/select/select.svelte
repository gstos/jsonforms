<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = SelectPrimitive.RootProps & { class?: string; children?: Snippet };
  let { children, ...rest }: Props = $props();
</script>

<SelectPrimitive.Root {...rest}>
  {@render children?.()}
</SelectPrimitive.Root>
