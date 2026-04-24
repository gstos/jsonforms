<script lang="ts">
  import Label from './ui/label/label.svelte';
  import { cn } from './util/cn';

  type Props = {
    id?: string;
    label?: string;
    description?: string;
    errors?: string;
    visible?: boolean;
    required?: boolean;
    descriptionHidden?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
  };

  let {
    id,
    label,
    description,
    errors,
    visible = true,
    required,
    descriptionHidden,
    class: className,
    children,
  }: Props = $props();
</script>

{#if visible}
  <div class={cn('flex flex-col gap-1.5', className)}>
    {#if label}
      <Label for={id}>
        {label}
        {#if required}
          <span class="text-destructive ml-0.5" aria-hidden="true">*</span>
        {/if}
      </Label>
    {/if}

    {@render children?.()}

    {#if description && !descriptionHidden}
      <p class="text-xs text-muted-foreground">{description}</p>
    {/if}

    {#if errors}
      <p class="text-xs text-destructive" role="alert">{errors}</p>
    {/if}
  </div>
{/if}
