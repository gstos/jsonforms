<script lang="ts">
  import { Checkbox as CheckboxPrimitive } from 'bits-ui';
  import { cn } from '../../util/cn';

  // bits-ui 1.x Checkbox.Root has no Indicator sub-component.
  // The children snippet receives { checked, indeterminate } from bits-ui.
  type Props = CheckboxPrimitive.RootProps & { class?: string };
  let { class: className, checked = $bindable(false), ...rest }: Props = $props();
</script>

<CheckboxPrimitive.Root
  bind:checked
  class={cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    className
  )}
  {...rest}
>
  {#snippet children({ checked: isChecked })}
    <span class="flex items-center justify-center text-current">
      {#if isChecked}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      {/if}
    </span>
  {/snippet}
</CheckboxPrimitive.Root>
