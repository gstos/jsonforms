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
import { enumControlRendererEntry } from '../../src/controls/EnumControlRenderer';

describe('EnumControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      color: { type: 'string', enum: ['red', 'green', 'blue'] },
    },
    required: ['color'],
  };
  const uischema = { type: 'Control', scope: '#/properties/color' } as const;

  it('renders a select with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { color: 'red' },
        renderers: [enumControlRendererEntry],
      },
    });
    // bits-ui Select renders a button trigger; query by role
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    // Initial value should be displayed in trigger
    expect(trigger!.textContent).toContain('red');
  });

  it('renders with undefined initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [enumControlRendererEntry],
      },
    });
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    // Should show placeholder text
    expect(trigger!.textContent).toContain('Select');
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [enumControlRendererEntry],
      },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });

  it('does not throw when rendered with options', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { color: 'green' },
          renderers: [enumControlRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
