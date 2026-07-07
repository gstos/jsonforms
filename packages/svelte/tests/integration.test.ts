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

  it('passes the config prop through core state to renderer testers', () => {
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    const uischema = {
      type: 'Control',
      scope: '#/properties/name',
    } as const;
    let seenConfig: unknown;
    const renderers: JsonFormsRendererRegistryEntry[] = [
      {
        renderer: NameInput,
        tester: (_uischema, _schema, context) => {
          seenConfig = context.config;
          return 10;
        },
      },
    ];

    const { getByTestId } = render(JsonForms, {
      props: {
        data: { name: 'Alice' },
        schema,
        uischema,
        renderers,
        config: { myOption: 'from-config' },
      },
    });

    // The custom renderer actually won dispatch (tester consulted).
    expect((getByTestId('name') as HTMLInputElement).value).toBe('Alice');
    // The tester saw the resolved config (config prop -> configReducer ->
    // jsonforms.config), not the never-passed raw prop.
    expect((seenConfig as any)?.myOption).toBe('from-config');
  });
});
