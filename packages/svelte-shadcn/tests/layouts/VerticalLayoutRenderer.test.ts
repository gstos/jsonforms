/*
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
*/

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('VerticalLayoutRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      a: { type: 'string' },
      b: { type: 'string' },
    },
  };
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/a' },
      { type: 'Control', scope: '#/properties/b' },
    ],
  };

  it('renders two child controls vertically', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'value-a', b: 'value-b' },
        renderers: [verticalLayoutRendererEntry, stringControlRendererEntry],
      },
    });
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.value).toBe('value-a');
    expect(inputs[1]?.value).toBe('value-b');
  });
});
