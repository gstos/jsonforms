<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';
  import type { Snippet } from 'svelte';

  type Props = TabsPrimitive.RootProps & { class?: string; children?: Snippet };
  let { class: className, children, ...rest }: Props = $props();
</script>

<TabsPrimitive.Root class={cn(className)} {...rest}>
  {@render children?.()}
</TabsPrimitive.Root>
