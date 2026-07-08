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
  import {
    getJsonFormsControl,
    type ControlProps,
  } from '@jsonforms/svelte';
  import { useShadcnControl } from '../util/composition.svelte';
  import ControlWrapper from '../ControlWrapper.svelte';
  import Slider from '../ui/slider/slider.svelte';

  let props: ControlProps = $props();
  const b = useShadcnControl({ input: getJsonFormsControl(props) });
</script>

<ControlWrapper {...b.controlWrapper} id={b.control.id}>
  <div class="flex flex-col gap-2">
    <Slider
      type="multiple"
      value={[b.control.data ?? b.control.schema.default ?? b.control.schema.minimum ?? 0]}
      min={b.control.schema.minimum}
      max={b.control.schema.maximum}
      step={b.control.schema.multipleOf ?? 1}
      onValueChange={(v) => b.onChange(v[0])}
      disabled={!b.control.enabled}
    />
    <span class="text-xs text-muted-foreground">{b.control.data}</span>
  </div>
</ControlWrapper>
