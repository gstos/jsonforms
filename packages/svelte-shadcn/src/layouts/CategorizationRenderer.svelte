<script lang="ts">
  import { getJsonFormsCategorization, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import Tabs from '../ui/tabs/tabs.svelte';
  import TabsList from '../ui/tabs/tabs-list.svelte';
  import TabsTrigger from '../ui/tabs/tabs-trigger.svelte';
  import TabsContent from '../ui/tabs/tabs-content.svelte';

  let props: LayoutProps = $props();
  const { layout, categories } = getJsonFormsCategorization(props);
  let active = $state('0');
</script>

{#if layout.visible}
  <Tabs value={active} onValueChange={(v) => { active = v; }}>
    <TabsList>
      {#each categories as cat, i}
        <TabsTrigger value={String(i)}>{(cat.uischema as any).label}</TabsTrigger>
      {/each}
    </TabsList>
    {#each categories as cat, i}
      <TabsContent value={String(i)}>
        {#each (cat.uischema as any).elements as el}
          <DispatchRenderer
            schema={cat.schema}
            uischema={el}
            path={cat.path}
            enabled={cat.enabled}
            renderers={cat.renderers}
            cells={cat.cells}
          />
        {/each}
      </TabsContent>
    {/each}
  </Tabs>
{/if}
