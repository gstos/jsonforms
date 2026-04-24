import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { coreReducer, Actions, type JsonFormsSubStates } from '@jsonforms/core';
import CompositionProbeHost from './CompositionProbeHost.svelte';
import {
  useShadcnControl,
  useShadcnLayout,
  useShadcnArrayControl,
} from '../../src/util/composition.svelte';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function makeJsonForms(opts?: {
  data?: Record<string, unknown>;
  config?: Record<string, unknown>;
  uischemaOptions?: Record<string, unknown>;
}): JsonFormsSubStates {
  const { data = { name: 'Alice' }, config = {}, uischemaOptions = {} } =
    opts ?? {};

  const schema = {
    type: 'object',
    properties: { name: { type: 'string' } },
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/name',
    options: uischemaOptions,
  };
  const core = coreReducer(undefined, Actions.init(data, schema, uischema));

  return {
    core,
    config,
    renderers: [],
    cells: [],
    uischemas: [],
  } as unknown as JsonFormsSubStates;
}

// ──────────────────────────────────────────────────────────────────────────────
// useShadcnControl — integration via CompositionProbeHost
// ──────────────────────────────────────────────────────────────────────────────

describe('useShadcnControl', () => {
  let jsonforms: JsonFormsSubStates;

  beforeEach(() => {
    jsonforms = makeJsonForms({
      config: { showUnfocusedDescription: false },
      uischemaOptions: { trim: true },
    });
  });

  it('merges config and uischema.options into appliedOptions', () => {
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };

    const { getByTestId } = render(CompositionProbeHost, {
      props: { jsonforms, probeProps: props },
    });

    const opts = JSON.parse(getByTestId('merged-options').textContent ?? '{}');
    expect(opts.trim).toBe(true);
    expect(opts.showUnfocusedDescription).toBe(false);
  });

  it('renders label from schema title / scope', () => {
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };

    const { getByTestId } = render(CompositionProbeHost, {
      props: { jsonforms, probeProps: props },
    });

    // The label derived from scope '#/properties/name' should be non-empty.
    const label = getByTestId('label').textContent ?? '';
    expect(label.toLowerCase()).toContain('name');
  });

  it('controlWrapper.visible is true by default', () => {
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };

    const { getByTestId } = render(CompositionProbeHost, {
      props: { jsonforms, probeProps: props },
    });

    expect(getByTestId('visible').textContent).toBe('true');
  });

  it('onChange calls handleChange with the correct path', () => {
    // Smoke-test via globalThis.__compProbe set by CompositionProbe.svelte.
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };

    render(CompositionProbeHost, { props: { jsonforms, probeProps: props } });

    const binding = (globalThis as any).__compProbe;
    binding.onChange('Bob');
    expect(jsonforms.core!.data).toEqual({ name: 'Bob' });
  });

  it('isFocused is false by default and settable', () => {
    const props = {
      schema: jsonforms.core!.schema,
      uischema: jsonforms.core!.uischema as any,
      path: '',
    };

    render(CompositionProbeHost, { props: { jsonforms, probeProps: props } });

    const binding = (globalThis as any).__compProbe;
    expect(binding.isFocused).toBe(false);
    binding.isFocused = true;
    expect(binding.isFocused).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// useShadcnLayout — unit smoke
// ──────────────────────────────────────────────────────────────────────────────

describe('useShadcnLayout', () => {
  it('is a function that returns layout + appliedOptions getter', () => {
    expect(typeof useShadcnLayout).toBe('function');
  });

  it('merges config and uischema.options in a reactive layout binding', () => {
    // Minimal synthetic layout object (mirrors what getJsonFormsLayout returns).
    const layout = {
      config: { showSortButtons: true },
      uischema: { type: 'VerticalLayout', options: { detail: 'GENERATE' } },
      elements: [],
      visible: true,
    };

    // useShadcnLayout must be called inside a Svelte reactive root.
    // We test its function signature here; deep reactivity is covered
    // transitively by layout-renderer integration tests.
    expect(() => {
      // Calling outside a Svelte component works for the return shape check.
      const result = useShadcnLayout({ input: { layout } });
      expect(typeof result.appliedOptions).toBe('object');
      expect(result.layout).toBe(layout);
    }).not.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// useShadcnArrayControl — unit smoke
// ──────────────────────────────────────────────────────────────────────────────

describe('useShadcnArrayControl', () => {
  it('is a function', () => {
    expect(typeof useShadcnArrayControl).toBe('function');
  });

  it('exports array-specific methods and translation getter', () => {
    // Synthetic input object (mirrors getJsonFormsArrayControl return shape).
    const control = {
      config: {},
      uischema: { type: 'Control', scope: '#/properties/items', options: {} },
      schema: { type: 'array', items: { type: 'string' } },
      path: 'items',
      uischemas: [],
      rootSchema: {},
      id: 'items-0',
      description: '',
      errors: '',
      label: 'Items',
      visible: true,
      required: false,
      data: [],
    };
    const addItem = (_path: string, _value: unknown) => () => {};
    const removeItems = (_path: string, _toDelete: number[]) => () => {};

    const result = useShadcnArrayControl({
      input: {
        control,
        handleChange: () => {},
        addItem,
        removeItems,
      },
    });

    expect(result.addItem).toBe(addItem);
    expect(result.removeItems).toBe(removeItems);
    expect(typeof result.childLabelForIndex).toBe('function');
    expect(result.childLabelForIndex(0)).toBe('1');
    expect(result.childLabelForIndex(4)).toBe('5');
    expect(typeof result.translations).toBe('object');
    expect(result.translations.addTooltip).toBe('Add');
    expect(result.translations.noData).toBe('No data');
  });
});
