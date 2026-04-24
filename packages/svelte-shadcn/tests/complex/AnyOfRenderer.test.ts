import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { anyOfRendererEntry } from '../../src/complex/AnyOfRenderer';

describe('AnyOfRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      config: {
        anyOf: [
          {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Name' },
            },
            title: 'By Name',
          },
          {
            type: 'object',
            properties: {
              id: { type: 'number', title: 'ID' },
            },
            title: 'By ID',
          },
        ],
      },
    },
  };
  const uischema = { type: 'Control', scope: '#/properties/config' } as const;

  it('renders a select for schema choice', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [anyOfRendererEntry],
      },
    });
    // bits-ui Select renders a button trigger
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
  });

  it('renders with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { config: { name: 'test' } },
        renderers: [anyOfRendererEntry],
      },
    });
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
  });

  it('does not throw when rendered', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { config: { id: 42 } },
          renderers: [anyOfRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
