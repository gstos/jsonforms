import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import type { JsonFormsSubStates } from '@jsonforms/core';
import DispatchRendererHost from './DispatchRendererHost.svelte';
import Hello from './fixtures/Hello.svelte';

function makeState(
  renderers: any[],
  config: unknown = {}
): JsonFormsSubStates {
  return {
    core: {
      data: {},
      schema: { type: 'object' },
      uischema: { type: 'VerticalLayout', elements: [] },
      errors: [],
    },
    config,
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

  it('passes the resolved (core state) config to testers, not the raw prop', () => {
    let seenConfig: unknown;
    const renderers = [
      {
        renderer: Hello,
        tester: (_uischema: any, _schema: any, context: any) => {
          seenConfig = context.config;
          return 1;
        },
      },
    ];
    const jsonforms = makeState(renderers, { myOption: 'from-config' });
    render(DispatchRendererHost, {
      props: {
        jsonforms,
        rendererProps: {
          schema: jsonforms.core!.schema,
          uischema: jsonforms.core!.uischema,
          path: 'p',
          // Intentionally does NOT pass `config` as a prop — JsonForms never
          // does either. Testers must see the resolved state config instead.
        },
      },
    });
    expect((seenConfig as any)?.myOption).toBe('from-config');
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
