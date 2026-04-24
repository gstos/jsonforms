import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { dateTimeControlRendererEntry } from '../../src/controls/DateTimeControlRenderer';

describe('DateTimeControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { ts: { type: 'string', format: 'date-time' } },
    required: ['ts'],
  };
  const uischema = { type: 'Control', scope: '#/properties/ts' } as const;

  it('renders an input with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { ts: '2020-01-15T10:30' },
        renderers: [dateTimeControlRendererEntry],
      },
    });
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('2020-01-15T10:30');
  });

  it('fires onchange with new value when user changes input', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { ts: '2020-01-15T10:30' },
        renderers: [dateTimeControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input')!;
    await fireEvent.input(input, { target: { value: '2021-06-20T14:45' } });
    expect(events[events.length - 1].data).toEqual({ ts: '2021-06-20T14:45' });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [dateTimeControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
