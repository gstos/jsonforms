import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { oneOfEnumControlRendererEntry } from '../../src/controls/OneOfEnumControlRenderer';

describe('OneOfEnumControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      color: {
        type: 'string',
        oneOf: [
          { const: 'red', title: 'Red' },
          { const: 'green', title: 'Green' },
          { const: 'blue', title: 'Blue' },
        ],
      },
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
        renderers: [oneOfEnumControlRendererEntry],
      },
    });
    // bits-ui Select renders a button trigger
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
        renderers: [oneOfEnumControlRendererEntry],
      },
    });
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    // Should show placeholder text
    expect(trigger!.textContent).toContain('Select');
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [oneOfEnumControlRendererEntry] },
    });
    expect(getByText('*')).toBeTruthy();
  });

  it('does not throw when rendered with options', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { color: 'green' },
          renderers: [oneOfEnumControlRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
