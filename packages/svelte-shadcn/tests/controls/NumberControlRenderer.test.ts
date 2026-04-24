import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { numberControlRendererEntry } from '../../src/controls/NumberControlRenderer';

describe('NumberControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { n: { type: 'number' } },
    required: ['n'],
  };
  const uischema = { type: 'Control', scope: '#/properties/n' } as const;

  it('renders an input with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { n: 42 },
        renderers: [numberControlRendererEntry],
      },
    });
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('42');
  });

  it('fires onchange with new value when user types', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { n: 42 },
        renderers: [numberControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input')!;
    await fireEvent.input(input, { target: { value: '99' } });
    expect(events[events.length - 1].data).toEqual({ n: 99 });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [numberControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
