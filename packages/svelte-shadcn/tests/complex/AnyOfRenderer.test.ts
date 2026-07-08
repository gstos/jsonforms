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
import { anyOfRendererEntry } from '../../src/complex/AnyOfRenderer';

describe('AnyOfRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      config: {
        anyOf: [
          {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Name' },
            },
            title: 'By Name',
          },
          {
            type: 'object',
            properties: {
              id: { type: 'number', title: 'ID' },
            },
            title: 'By ID',
          },
        ],
      },
    },
  };
  const uischema = { type: 'Control', scope: '#/properties/config' } as const;

  it('renders a select for schema choice', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [anyOfRendererEntry],
      },
    });
    // bits-ui Select renders a button trigger
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
  });

  it('renders with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { config: { name: 'test' } },
        renderers: [anyOfRendererEntry],
      },
    });
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
  });

  it('does not throw when rendered', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { config: { id: 42 } },
          renderers: [anyOfRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
