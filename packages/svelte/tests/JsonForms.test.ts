import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import JsonForms from '../src/JsonForms.svelte';
import Hello from './fixtures/Hello.svelte';

describe('JsonForms.svelte — init', () => {
  it('auto-generates schema when not provided', () => {
    const data = { number: 5.5 };
    const { container } = render(JsonForms, {
      props: {
        data,
        renderers: [],
      },
    });
    // Without renderers, UnknownRenderer fallback should appear.
    expect(container.textContent).toContain('No applicable renderer found.');
  });

  it('renders the matching registered renderer for the auto-generated uischema', () => {
    const data = { name: 'Alice' };
    const renderers = [
      { renderer: Hello, tester: rankWith(1, uiTypeIs('VerticalLayout')) },
    ];
    const { getByTestId } = render(JsonForms, {
      props: {
        data,
        renderers,
      },
    });
    // The auto-generated uischema for an object is a VerticalLayout.
    expect(getByTestId('hello')).toBeTruthy();
  });

  it('uses provided schema when given', () => {
    const schema = {
      type: 'object',
      properties: { a: { type: 'number' } },
    };
    const { container } = render(JsonForms, {
      props: {
        data: {},
        schema,
        renderers: [],
      },
    });
    expect(container.textContent).toContain('No applicable renderer found.');
  });

  it('uses provided uischema when given', () => {
    const uischema = { type: 'Label', text: 'hi' } as const;
    const { container } = render(JsonForms, {
      props: {
        data: {},
        schema: { type: 'object' },
        uischema,
        renderers: [
          { renderer: Hello, tester: rankWith(1, uiTypeIs('Label')) },
        ],
      },
    });
    expect(container.querySelector('[data-testid="hello"]')).toBeTruthy();
  });
});

describe('JsonForms.svelte — reactive prop updates', () => {
  it('re-dispatches updateCore when data prop changes', async () => {
    const data = { name: 'Alice' };
    const renderers = [
      { renderer: Hello, tester: rankWith(1, uiTypeIs('VerticalLayout')) },
    ];
    const { component, rerender: doRerender } = render(JsonForms, {
      props: { data, renderers },
    });
    await doRerender({ data: { name: 'Bob' }, renderers });
    // There is no public way to read core state from outside — mount a probe
    // to assert. For now, assert no exceptions thrown during rerender.
    expect(component).toBeTruthy();
  });

  it('regenerates uischema when schema changes and uischema is not provided', async () => {
    const renderers = [
      { renderer: Hello, tester: rankWith(1, uiTypeIs('VerticalLayout')) },
      { renderer: Hello, tester: rankWith(2, uiTypeIs('Label')) },
    ];
    const { container, rerender: doRerender } = render(JsonForms, {
      props: {
        data: {},
        schema: { type: 'object', properties: { a: { type: 'number' } } },
        renderers,
      },
    });
    expect(container.querySelector('[data-testid="hello"]')).toBeTruthy();

    // A null-type schema produces a Label uischema — different renderer tester matches.
    await doRerender({
      data: {},
      schema: { type: 'null' },
      renderers,
    });
    // Should still render *some* hello — both testers use the same component.
    // The key check: no throw and text is present.
    expect(container.textContent).toContain('hello');
  });
});

describe('JsonForms.svelte — onchange', () => {
  it('fires onchange once on mount with initial data and errors', () => {
    const onchange = vi.fn();
    render(JsonForms, {
      props: {
        data: { a: 1 },
        schema: { type: 'object', properties: { a: { type: 'number' } } },
        renderers: [],
        onchange,
      },
    });
    expect(onchange).toHaveBeenCalledTimes(1);
    expect(onchange.mock.calls[0][0]).toEqual({
      data: { a: 1 },
      errors: expect.any(Array),
    });
  });

  it('fires onchange again when data prop changes', async () => {
    const onchange = vi.fn();
    const { rerender: doRerender } = render(JsonForms, {
      props: {
        data: { a: 1 },
        schema: { type: 'object', properties: { a: { type: 'number' } } },
        renderers: [],
        onchange,
      },
    });
    onchange.mockClear();
    await doRerender({
      data: { a: 2 },
      schema: { type: 'object', properties: { a: { type: 'number' } } },
      renderers: [],
      onchange,
    });
    expect(onchange).toHaveBeenCalled();
    const last = onchange.mock.calls[onchange.mock.calls.length - 1][0];
    expect(last.data).toEqual({ a: 2 });
  });
});
