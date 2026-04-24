import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('StringControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
  };
  const uischema = { type: 'Control', scope: '#/properties/name' } as const;

  it('renders an input with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { name: 'Alice' },
        renderers: [stringControlRendererEntry],
      },
    });
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('Alice');
  });

  it('fires onchange with new value when user types', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { name: 'Alice' },
        renderers: [stringControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input')!;
    await fireEvent.input(input, { target: { value: 'Bob' } });
    expect(events[events.length - 1].data).toEqual({ name: 'Bob' });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [stringControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
