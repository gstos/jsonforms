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
import type { JsonFormsSubStates } from '@jsonforms/core';
import DispatchCellHost from './DispatchCellHost.svelte';
import Hello from './fixtures/Hello.svelte';

function makeState(cells: any[], config: unknown = {}): JsonFormsSubStates {
  return {
    core: {
      data: { name: 'x' },
      schema: { type: 'object', properties: { name: { type: 'string' } } },
      uischema: { type: 'Control', scope: '#/properties/name' },
      errors: [],
    },
    config,
    renderers: [],
    cells,
    uischemas: [],
  } as unknown as JsonFormsSubStates;
}

describe('DispatchCell', () => {
  it('renders the cell with the highest tester score', () => {
    const cells = [
      { cell: Hello, tester: () => 5 },
      { cell: Hello, tester: () => 1 },
    ];
    const jsonforms = makeState(cells);
    const { getByTestId } = render(DispatchCellHost, {
      props: {
        jsonforms,
        cellProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: 'name',
        },
      },
    });
    expect(getByTestId('hello').textContent).toBe('hello name');
  });

  it('passes the resolved (core state) config to testers, not the raw prop', () => {
    let seenConfig: unknown;
    const cells = [
      {
        cell: Hello,
        tester: (_uischema: any, _schema: any, context: any) => {
          seenConfig = context.config;
          return 1;
        },
      },
    ];
    const jsonforms = makeState(cells, { myOption: 'from-config' });
    render(DispatchCellHost, {
      props: {
        jsonforms,
        cellProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: 'name',
          // Intentionally does NOT pass `config` as a prop — JsonForms never
          // does either. Testers must see the resolved state config instead.
        },
      },
    });
    expect((seenConfig as any)?.myOption).toBe('from-config');
  });

  it('falls back to UnknownRenderer when no cell matches', () => {
    const jsonforms = makeState([]);
    const { getByText } = render(DispatchCellHost, {
      props: {
        jsonforms,
        cellProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: 'name',
        },
      },
    });
    expect(getByText('No applicable renderer found.')).toBeTruthy();
  });
});
