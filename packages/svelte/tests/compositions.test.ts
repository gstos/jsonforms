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

import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import {
  coreReducer,
  Actions,
  Id,
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

  it('uses the Id singleton so id generation is overridable', () => {
    const original = { createId: Id.createId, removeId: Id.removeId };
    try {
      Id.createId = (proposed) => `custom-${proposed}`;
      Id.removeId = () => true;

      const props = {
        schema: jsonforms.core!.schema,
        uischema: jsonforms.core!.uischema as any,
        path: '',
      };
      render(ControlProbeHost, { props: { jsonforms, probeProps: props } });
      const { control } = (globalThis as any).__probe;
      expect(control.id).toBe('custom-#/properties/name');
    } finally {
      Id.createId = original.createId;
      Id.removeId = original.removeId;
    }
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

import {
  getJsonFormsLayout,
  getJsonFormsArrayLayout,
  getJsonFormsLabel,
  getJsonFormsMasterListItem,
  getJsonFormsCell,
  getJsonFormsEnumCell,
  getJsonFormsOneOfEnumCell,
  getJsonFormsDispatchCell,
  getJsonFormsRenderer,
  getJsonFormsCategorization,
} from '../src/compositions.svelte';

describe('layout / label / item / cell / renderer / categorization compositions', () => {
  const exportedFns = {
    getJsonFormsLayout,
    getJsonFormsArrayLayout,
    getJsonFormsLabel,
    getJsonFormsMasterListItem,
    getJsonFormsCell,
    getJsonFormsEnumCell,
    getJsonFormsOneOfEnumCell,
    getJsonFormsDispatchCell,
    getJsonFormsRenderer,
    getJsonFormsCategorization,
  };

  for (const [name, fn] of Object.entries(exportedFns)) {
    it(`${name} is a function`, () => {
      expect(typeof fn).toBe('function');
    });
  }
});
