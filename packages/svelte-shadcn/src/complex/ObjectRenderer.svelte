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
  import { getJsonFormsControlWithDetail, DispatchRenderer, type ControlProps } from '@jsonforms/svelte';
  import { Generate } from '@jsonforms/core';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControlWithDetail(props) });

  const detailUiSchema = $derived(
    (b.appliedOptions.detail as any) ??
      Generate.uiSchema(b.control.schema, 'Group', undefined, b.control.schema)
  );
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <DispatchRenderer
    schema={b.control.schema}
    uischema={detailUiSchema}
    path={b.control.path}
    enabled={b.control.enabled}
  />
</ControlWrapper>
