import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import {
  coreReducer,
  Actions,
  type JsonFormsSubStates,
} from '@jsonforms/core';
import ControlProbeHost from './ControlProbeHost.svelte';

describe('getJsonFormsControl', () => {
  let jsonforms: JsonFormsSubStates;

  beforeEach(() => {
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    const uischema = {
      type: 'Control',
      scope: '#/properties/name',
    } as const;
    const core = coreReducer(
      undefined,
      Actions.init({ name: 'Alice' }, schema, uischema)
    );
    jsonforms = {
      core,
      config: {},
      renderers: [],
      cells: [],
      uischemas: [],
    } as unknown as JsonFormsSubStates;
  });

  it('returns control with mapped state props', () => {
    // path: '' so composeWithUi('#/properties/name', '') → 'name'
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };
    const { getByTestId } = render(ControlProbeHost, {
      props: { jsonforms, probeProps: props },
    });
    expect(getByTestId('path').textContent).toBe('name');
    expect(getByTestId('data').textContent).toBe('"Alice"');
  });

  it('handleChange dispatches coreReducer update', () => {
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };
    render(ControlProbeHost, { props: { jsonforms, probeProps: props } });
    const { handleChange } = (globalThis as any).__probe;
    handleChange('name', 'Bob');
    expect(jsonforms.core!.data).toEqual({ name: 'Bob' });
  });
});
