import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { integerControlRendererEntry } from '../../src/controls/IntegerControlRenderer';

describe('IntegerControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { i: { type: 'integer' } },
    required: ['i'],
  };
  const uischema = { type: 'Control', scope: '#/properties/i' } as const;

  it('renders an input with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { i: 42 },
        renderers: [integerControlRendererEntry],
      },
    });
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('42');
  });

  it('fires onchange with truncated value when user types', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { i: 42 },
        renderers: [integerControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input')!;
    await fireEvent.input(input, { target: { value: '3.7' } });
    expect(events[events.length - 1].data).toEqual({ i: 3 });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [integerControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });

  it('handles empty string as undefined', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { i: 42 },
        renderers: [integerControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const input = container.querySelector('input')!;
    await fireEvent.input(input, { target: { value: '' } });
    expect(events[events.length - 1].data).toEqual({ i: undefined });
  });

  it('has step attribute set to 1', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { i: 42 },
        renderers: [integerControlRendererEntry],
      },
    });
    const input = container.querySelector('input');
    expect(input!.step).toBe('1');
  });
});
