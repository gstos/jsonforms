import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { allOfRendererEntry } from '../../src/complex/AllOfRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';

describe('AllOfRenderer', () => {
  const schema = {
    allOf: [
      {
        type: 'object',
        properties: {
          a: { type: 'string' },
        },
      },
      {
        type: 'object',
        properties: {
          b: { type: 'string' },
        },
      },
    ],
  };
  const uischema = {
    type: 'Control',
    scope: '#',
  };

  it('renders without throwing and dispatches both sub-schemas', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'value-a', b: 'value-b' },
        renderers: [
          allOfRendererEntry,
          stringControlRendererEntry,
          verticalLayoutRendererEntry,
        ],
      },
    });
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.value).toBe('value-a');
    expect(inputs[1]?.value).toBe('value-b');
  });
});
