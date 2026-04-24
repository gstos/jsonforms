import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('VerticalLayoutRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      a: { type: 'string' },
      b: { type: 'string' },
    },
  };
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/a' },
      { type: 'Control', scope: '#/properties/b' },
    ],
  };

  it('renders two child controls vertically', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'value-a', b: 'value-b' },
        renderers: [verticalLayoutRendererEntry, stringControlRendererEntry],
      },
    });
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.value).toBe('value-a');
    expect(inputs[1]?.value).toBe('value-b');
  });
});
