import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { booleanControlRendererEntry } from '../../src/controls/BooleanControlRenderer';

describe('BooleanControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { enabled: { type: 'boolean' } },
    required: ['enabled'],
  };
  const uischema = { type: 'Control', scope: '#/properties/enabled' } as const;

  it('renders a checkbox with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { enabled: true },
        renderers: [booleanControlRendererEntry],
      },
    });
    // bits-ui Checkbox renders as a button with role="checkbox" and aria-checked
    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toBeTruthy();
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');
  });

  it('fires onchange with new value when user clicks', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { enabled: false },
        renderers: [booleanControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const checkbox = container.querySelector('[role="checkbox"]') as HTMLElement;
    await fireEvent.click(checkbox);
    expect(events[events.length - 1].data).toEqual({ enabled: true });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [booleanControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
