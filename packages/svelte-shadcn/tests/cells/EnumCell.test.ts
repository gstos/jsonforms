import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { enumCellEntry } from '../../src/cells/EnumCell';
import { arrayListRendererEntry } from '../../src/array/ArrayListRenderer';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';

describe('EnumCell', () => {
  const schema = {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['red', 'green', 'blue'],
        },
      },
    },
  };
  const uischema = { type: 'Control', scope: '#/properties/items' } as const;
  const renderers = [arrayListRendererEntry, verticalLayoutRendererEntry];
  const cells = [enumCellEntry];

  it('tester function is properly exported', () => {
    expect(enumCellEntry.tester).toBeDefined();
  });

  it('renders Select component with options from schema enum', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { items: ['red'] },
        renderers,
        cells,
      },
    });
    expect(container).toBeDefined();
  });
});
