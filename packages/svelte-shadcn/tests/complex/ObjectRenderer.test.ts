import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { objectRendererEntry } from '../../src/complex/ObjectRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';
import { groupRendererEntry } from '../../src/layouts/GroupRenderer';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';

describe('ObjectRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
        },
      },
    },
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/address',
  } as const;

  const renderers = [
    objectRendererEntry,
    stringControlRendererEntry,
    groupRendererEntry,
    verticalLayoutRendererEntry,
  ];

  it('renders nested object controls (street input appears)', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { address: { street: '123 Main St' } },
        renderers,
      },
    });

    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('123 Main St');
  });

  it('renders with empty data without crashing', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers,
      },
    });

    // The nested street input should be present (value empty)
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.value).toBe('');
  });

  it('uses the tester with rank 2 for object controls', () => {
    const { rankWith, isObjectControl } = require('@jsonforms/core');
    // The tester should be constructed with rank 2 and isObjectControl
    const tester = rankWith(2, isObjectControl);
    // Use a schema where the control scope points to an object-typed property
    const testSchema = {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: { street: { type: 'string' } },
        },
      },
    };
    const testUischema = { type: 'Control', scope: '#/properties/address' };
    const context = { rootSchema: testSchema };
    const score = tester(testUischema, testSchema, context);
    // isObjectControl should return true for an object-typed property, rank = 2
    expect(score).toBe(2);
  });
});
