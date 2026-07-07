<script lang="ts">
  import { getJsonFormsCategorization, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import Tabs from '../ui/tabs/tabs.svelte';
  import TabsList from '../ui/tabs/tabs-list.svelte';
  import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';
  import TabsContent from '../ui/tabs/tabs-content.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);

  // Preserve the ORIGINAL index when filtering so tab identity is stable
  // even as earlier categories toggle visibility (upstream fix semantics).
  const visibleCategories = $derived(
    categories
      .map((category, originalIndex) => ({ category, originalIndex }))
      .filter((entry) => entry.category.visible)
  );

  let active = $state('');
  $effect(() => {
    const values = visibleCategories.map((e) => String(e.originalIndex));
    if (!values.includes(active)) {
      active = values[0] ?? '';
    }
  });
</script>

{#if layout.visible}
  <Tabs value={active} onValueChange={(v) => { active = v; }}>
    <TabsList>
      {#each visibleCategories as { category, originalIndex } (originalIndex)}
        <TabsTrigger value={String(originalIndex)} disabled={!category.enabled}>
          {(category.uischema as any).label}
        </TabsTrigger>
      {/each}
    </TabsList>
    {#each visibleCategories as { category, originalIndex } (originalIndex)}
      <TabsContent value={String(originalIndex)}>
        {#each (category.uischema as any).elements as el}
          <DispatchRenderer
            schema={category.schema}
            uischema={el}
            path={category.path}
            enabled={category.enabled}
            renderers={category.renderers}
            cells={category.cells}
          />
        {/each}
      </TabsContent>
    {/each}
  </Tabs>
{/if}
