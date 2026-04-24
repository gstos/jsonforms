import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import {
  rankWith,
  scopeEndsWith,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import { JsonForms } from '../src';
import NameInput from './fixtures/NameInput.svelte';

describe('integration: JsonForms + custom renderer + onchange', () => {
  it('renders a custom renderer, dispatches value change, fires onchange', async () => {
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    const uischema = {
      type: 'Control',
      scope: '#/properties/name',
    } as const;
    const renderers: JsonFormsRendererRegistryEntry[] = [
      { renderer: NameInput, tester: rankWith(10, scopeEndsWith('name')) },
    ];
    const onchange = vi.fn();

    const { getByTestId } = render(JsonForms, {
      props: {
        data: { name: 'Alice' },
        schema,
        uischema,
        renderers,
        onchange,
      },
    });

    const input = getByTestId('name') as HTMLInputElement;
    expect(input.value).toBe('Alice');

    // Mount fired onchange once.
    expect(onchange).toHaveBeenCalledTimes(1);

    await fireEvent.input(input, { target: { value: 'Bob' } });

    // onchange fired again with updated data.
    const last = onchange.mock.calls[onchange.mock.calls.length - 1][0];
    expect(last.data).toEqual({ name: 'Bob' });
  });
});
