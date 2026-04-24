import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { multiStringControlRendererEntry } from '../../src/controls/MultiStringControlRenderer';

describe('MultiStringControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { bio: { type: 'string' } },
    required: ['bio'],
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/bio',
    options: { multi: true },
  } as const;

  it('renders a textarea with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { bio: 'Hello world' },
        renderers: [multiStringControlRendererEntry],
      },
    });
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea!.value).toBe('Hello world');
  });

  it('fires onchange with new value when user types', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { bio: 'Hello world' },
        renderers: [multiStringControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const textarea = container.querySelector('textarea')!;
    await fireEvent.input(textarea, { target: { value: 'Updated bio' } });
    expect(events[events.length - 1].data).toEqual({ bio: 'Updated bio' });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [multiStringControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
