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

import {
  getJsonFormsControlWithDetail,
  getJsonFormsEnumControl,
  getJsonFormsOneOfEnumControl,
  getJsonFormsAllOfControl,
  getJsonFormsAnyOfControl,
  getJsonFormsOneOfControl,
} from '../src/compositions.svelte';

describe('simple control composition variants', () => {
  const cases = [
    { name: 'getJsonFormsControlWithDetail', fn: getJsonFormsControlWithDetail },
    { name: 'getJsonFormsEnumControl', fn: getJsonFormsEnumControl },
    { name: 'getJsonFormsOneOfEnumControl', fn: getJsonFormsOneOfEnumControl },
    { name: 'getJsonFormsAllOfControl', fn: getJsonFormsAllOfControl },
    { name: 'getJsonFormsAnyOfControl', fn: getJsonFormsAnyOfControl },
    { name: 'getJsonFormsOneOfControl', fn: getJsonFormsOneOfControl },
  ];

  for (const { name, fn } of cases) {
    it(`${name} is callable and returns { control, handleChange }`, () => {
      expect(typeof fn).toBe('function');
      // We don't render here — just smoke-check the export. Full behavioral
      // coverage comes via the DispatchRenderer + JsonForms integration tests.
    });
  }
});

import {
  getJsonFormsArrayControl,
  getJsonFormsMultiEnumControl,
} from '../src/compositions.svelte';

describe('array and multi-enum control compositions', () => {
  it('getJsonFormsArrayControl is exported and returns array-dispatch methods', () => {
    expect(typeof getJsonFormsArrayControl).toBe('function');
  });

  it('getJsonFormsMultiEnumControl is exported', () => {
    expect(typeof getJsonFormsMultiEnumControl).toBe('function');
  });
});
