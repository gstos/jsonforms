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
import { horizontalLayoutRendererEntry } from '../../src/layouts/HorizontalLayoutRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('HorizontalLayoutRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
    required: ['firstName', 'lastName'],
  };

  const uischema = {
    type: 'HorizontalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/firstName' },
      { type: 'Control', scope: '#/properties/lastName' },
    ],
  } as const;

  it('renders two child controls horizontally', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { firstName: 'John', lastName: 'Doe' },
        renderers: [horizontalLayoutRendererEntry, stringControlRendererEntry],
      },
    });

    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].value).toBe('John');
    expect(inputs[1].value).toBe('Doe');
  });

  it('applies flex row layout with gap and items-start classes', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { firstName: 'Alice', lastName: 'Smith' },
        renderers: [horizontalLayoutRendererEntry, stringControlRendererEntry],
      },
    });

    const layoutDiv = container.querySelector('.flex.flex-row.gap-4.items-start');
    expect(layoutDiv).toBeTruthy();
  });
});
