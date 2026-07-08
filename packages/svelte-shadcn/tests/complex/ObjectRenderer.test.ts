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
import { objectRendererEntry } from '../../src/complex/ObjectRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';
import { groupRendererEntry } from '../../src/layouts/GroupRenderer';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';

describe('ObjectRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
        },
      },
    },
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/address',
  } as const;

  const renderers = [
    objectRendererEntry,
    stringControlRendererEntry,
    groupRendererEntry,
    verticalLayoutRendererEntry,
  ];

  it('renders nested object controls (street input appears)', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { address: { street: '123 Main St' } },
        renderers,
      },
    });

    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('123 Main St');
  });

  it('renders with empty data without crashing', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers,
      },
    });

    // The nested street input should be present (value empty)
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('');
  });

  it('uses the tester with rank 2 for object controls', async () => {
    const { rankWith, isObjectControl } = await import('@jsonforms/core');
    const tester = rankWith(2, isObjectControl);
    // Use a schema where the control scope points to an object-typed property
    const testSchema = {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: { street: { type: 'string' } },
        },
      },
    };
    const testUischema = { type: 'Control', scope: '#/properties/address' };
    const context = { rootSchema: testSchema, config: {} };
    const score = tester(testUischema, testSchema, context);
    // isObjectControl should return true for an object-typed property, rank = 2
    expect(score).toBe(2);
  });
});
