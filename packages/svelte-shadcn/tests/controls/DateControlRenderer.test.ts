import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { dateControlRendererEntry } from '../../src/controls/DateControlRenderer';

describe('DateControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { dob: { type: 'string', format: 'date' } },
    required: ['dob'],
  };
  const uischema = { type: 'Control', scope: '#/properties/dob' } as const;

  it('renders an input with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { dob: '2020-01-15' },
        renderers: [dateControlRendererEntry],
      },
    });
    const input = container.querySelector('input[type="date"]') as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(input!.value).toBe('2020-01-15');
  });

  it('fires onchange with new value when user changes date', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { dob: '2020-01-15' },
        renderers: [dateControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input[type="date"]')!;
    await fireEvent.input(input, { target: { value: '2021-06-20' } });
    expect(events[events.length - 1].data).toEqual({ dob: '2021-06-20' });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [dateControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
