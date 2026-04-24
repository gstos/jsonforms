<script lang="ts">
  import { Separator as SeparatorPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';

  type Props = SeparatorPrimitive.RootProps & { class?: string };
  let { class: className, ...rest }: Props = $props();
</script>

<SeparatorPrimitive.Root class={cn('shrink-0 bg-border h-[1px] w-full', className)} {...rest} />
