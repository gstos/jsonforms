<!--
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
-->

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
