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
import { enumArrayRendererEntry } from '../../src/complex/EnumArrayRenderer';

describe('EnumArrayRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'string',
          enum: ['a', 'b', 'c'],
        },
      },
    },
  };
  const uischema = { type: 'Control', scope: '#/properties/tags' } as const;

  it('renders 3 checkboxes for enum array', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a'] },
        renderers: [enumArrayRendererEntry],
      },
    });
    // bits-ui Checkbox uses role="checkbox"
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes).toHaveLength(3);
  });

  it('renders labels for each option', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a'] },
        renderers: [enumArrayRendererEntry],
      },
    });
    expect(getByText('a')).toBeTruthy();
    expect(getByText('b')).toBeTruthy();
    expect(getByText('c')).toBeTruthy();
  });

  it('does not throw when rendered', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { tags: ['a'] },
          renderers: [enumArrayRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
