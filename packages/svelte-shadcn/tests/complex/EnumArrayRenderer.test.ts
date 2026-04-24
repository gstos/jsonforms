import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { enumArrayRendererEntry } from '../../src/complex/EnumArrayRenderer';

describe('EnumArrayRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'string',
          enum: ['a', 'b', 'c'],
        },
      },
    },
  };
  const uischema = { type: 'Control', scope: '#/properties/tags' } as const;

  it('renders 3 checkboxes for enum array', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a'] },
        renderers: [enumArrayRendererEntry],
      },
    });
    // bits-ui Checkbox uses role="checkbox"
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes).toHaveLength(3);
  });

  it('renders labels for each option', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a'] },
        renderers: [enumArrayRendererEntry],
      },
    });
    expect(getByText('a')).toBeTruthy();
    expect(getByText('b')).toBeTruthy();
    expect(getByText('c')).toBeTruthy();
  });

  it('does not throw when rendered', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { tags: ['a'] },
          renderers: [enumArrayRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
