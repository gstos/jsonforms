import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { groupRendererEntry } from '../../src/layouts/GroupRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('GroupRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
  };
  const uischema = {
    type: 'Group',
    label: 'My Group',
    elements: [
      { type: 'Control', scope: '#/properties/firstName' },
      { type: 'Control', scope: '#/properties/lastName' },
    ],
  };

  it('renders a card with group title and child controls', () => {
    const { container, getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { firstName: 'John', lastName: 'Doe' },
        renderers: [groupRendererEntry, stringControlRendererEntry],
      },
    });

    // Check that the group title appears
    expect(getByText('My Group')).toBeTruthy();

    // Check that child inputs render
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.value).toBe('John');
    expect(inputs[1]?.value).toBe('Doe');
  });
});
