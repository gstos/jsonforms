import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { categorizationRendererEntry } from '../../src/layouts/CategorizationRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('CategorizationRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      a: { type: 'string' },
      b: { type: 'string' },
    },
  };

  const uischema = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'First',
        elements: [{ type: 'Control', scope: '#/properties/a' }],
      },
      {
        type: 'Category',
        label: 'Second',
        elements: [{ type: 'Control', scope: '#/properties/b' }],
      },
    ],
  } as const;

  it('renders without throwing', () => {
    expect(() =>
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { a: 'hello', b: 'world' },
          renderers: [categorizationRendererEntry, stringControlRendererEntry],
        },
      })
    ).not.toThrow();
  });

  it('renders both category labels as tab triggers', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'hello', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
      },
    });

    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
  });

  it('renders at least one input (for the active first category)', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'hello', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
      },
    });

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });
});
