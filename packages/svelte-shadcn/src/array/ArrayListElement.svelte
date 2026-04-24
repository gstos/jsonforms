<script lang="ts">
  import { DispatchRenderer } from '@jsonforms/svelte';
  import Button from '../ui/button/button.svelte';
  import Separator from '../ui/separator/separator.svelte';

  let {
    index,
    path,
    schema,
    uischema,
    enabled,
    removeItems,
    moveUp,
    moveDown,
    translations,
  }: {
    index: number;
    path: string;
    schema: any;
    uischema: any;
    enabled: boolean;
    removeItems: any;
    moveUp: any;
    moveDown: any;
    translations: any;
  } = $props();

  const itemPath = $derived(`${path}.${index}`);
</script>

<div class="flex flex-col gap-2 p-3 rounded-md border border-border">
  <div class="flex gap-1 justify-end">
    <Button type="button" onclick={() => moveUp?.(path, index)()} disabled={!enabled}>↑</Button>
    <Button type="button" onclick={() => moveDown?.(path, index)()} disabled={!enabled}>↓</Button>
    <Button type="button" onclick={() => removeItems?.(path, [index])()} disabled={!enabled}>✕</Button>
  </div>
  <DispatchRenderer {schema} {uischema} path={itemPath} {enabled} />
</div>
