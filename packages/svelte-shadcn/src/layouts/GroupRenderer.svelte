<script lang="ts">
  import { getJsonFormsLayout, DispatchRenderer, type LayoutProps } from '@jsonforms/svelte';
  import { useShadcnLayout } from '../util/composition.svelte';
  import Card from '../ui/card/card.svelte';
  import CardHeader from '../ui/card/card-header.svelte';
  import CardTitle from '../ui/card/card-title.svelte';
  import CardContent from '../ui/card/card-content.svelte';

  let props: LayoutProps = $props();
  const b = useShadcnLayout({ input: getJsonFormsLayout(props) });
</script>

{#if b.layout.visible}
  <Card>
    <CardHeader>
      <CardTitle>{b.layout.uischema.label}</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      {#each b.layout.uischema.elements as el}
        <DispatchRenderer
          schema={b.layout.schema}
          uischema={el}
          path={b.layout.path}
          enabled={b.layout.enabled}
          renderers={b.layout.renderers}
          cells={b.layout.cells}
        />
      {/each}
    </CardContent>
  </Card>
{/if}
