import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { horizontalLayoutRendererEntry } from '../../src/layouts/HorizontalLayoutRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('HorizontalLayoutRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
    required: ['firstName', 'lastName'],
  };

  const uischema = {
    type: 'HorizontalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/firstName' },
      { type: 'Control', scope: '#/properties/lastName' },
    ],
  } as const;

  it('renders two child controls horizontally', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { firstName: 'John', lastName: 'Doe' },
        renderers: [horizontalLayoutRendererEntry, stringControlRendererEntry],
      },
    });

    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].value).toBe('John');
    expect(inputs[1].value).toBe('Doe');
  });

  it('applies flex row layout with gap and items-start classes', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { firstName: 'Alice', lastName: 'Smith' },
        renderers: [horizontalLayoutRendererEntry, stringControlRendererEntry],
      },
    });

    const layoutDiv = container.querySelector('.flex.flex-row.gap-4.items-start');
    expect(layoutDiv).toBeTruthy();
  });
});
