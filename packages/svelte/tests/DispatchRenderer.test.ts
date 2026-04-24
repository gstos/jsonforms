import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import type { JsonFormsSubStates } from '@jsonforms/core';
import DispatchRendererHost from './DispatchRendererHost.svelte';
import Hello from './fixtures/Hello.svelte';

function makeState(renderers: any[]): JsonFormsSubStates {
  return {
    core: {
      data: {},
      schema: { type: 'object' },
      uischema: { type: 'VerticalLayout', elements: [] },
      errors: [],
    },
    config: {},
    renderers,
    cells: [],
    uischemas: [],
  } as unknown as JsonFormsSubStates;
}

describe('DispatchRenderer', () => {
  it('renders the renderer with the highest tester score', () => {
    const renderers = [
      { renderer: Hello, tester: () => 5 },
      { renderer: Hello, tester: () => 1 },
    ];
    const jsonforms = makeState(renderers);
    const { getByTestId } = render(DispatchRendererHost, {
      props: {
        jsonforms,
        rendererProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: 'p',
        },
      },
    });
    expect(getByTestId('hello').textContent).toBe('hello p');
  });

  it('falls back to UnknownRenderer when no renderer scores >-1', () => {
    const renderers = [{ renderer: Hello, tester: () => -1 }];
    const jsonforms = makeState(renderers);
    const { getByText } = render(DispatchRendererHost, {
      props: {
        jsonforms,
        rendererProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: '',
        },
      },
    });
    expect(getByText('No applicable renderer found.')).toBeTruthy();
  });

  it('falls back to UnknownRenderer when registry is empty', () => {
    const jsonforms = makeState([]);
    const { getByText } = render(DispatchRendererHost, {
      props: {
        jsonforms,
        rendererProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: '',
        },
      },
    });
    expect(getByText('No applicable renderer found.')).toBeTruthy();
  });
});
