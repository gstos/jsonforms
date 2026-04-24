import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import type { JsonFormsSubStates } from '@jsonforms/core';
import DispatchCellHost from './DispatchCellHost.svelte';
import Hello from './fixtures/Hello.svelte';

function makeState(cells: any[]): JsonFormsSubStates {
  return {
    core: {
      data: { name: 'x' },
      schema: { type: 'object', properties: { name: { type: 'string' } } },
      uischema: { type: 'Control', scope: '#/properties/name' },
      errors: [],
    },
    config: {},
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
