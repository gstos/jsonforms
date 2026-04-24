import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { enumControlRendererEntry } from '../../src/controls/EnumControlRenderer';

describe('EnumControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      color: { type: 'string', enum: ['red', 'green', 'blue'] },
    },
    required: ['color'],
  };
  const uischema = { type: 'Control', scope: '#/properties/color' } as const;

  it('renders a select with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { color: 'red' },
        renderers: [enumControlRendererEntry],
      },
    });
    // bits-ui Select renders a button trigger; query by role
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    // Initial value should be displayed in trigger
    expect(trigger!.textContent).toContain('red');
  });

  it('renders with undefined initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [enumControlRendererEntry],
      },
    });
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    // Should show placeholder text
    expect(trigger!.textContent).toContain('Select');
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [enumControlRendererEntry],
      },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });

  it('does not throw when rendered with options', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { color: 'green' },
          renderers: [enumControlRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
