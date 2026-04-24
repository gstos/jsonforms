import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { oneOfRendererEntry } from '../../src/complex/OneOfRenderer';

describe('OneOfRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      choice: {
        oneOf: [
          {
            title: 'Option A',
            type: 'object',
            properties: { a: { type: 'string' } },
          },
          {
            title: 'Option B',
            type: 'object',
            properties: { b: { type: 'string' } },
          },
        ],
      },
    },
  };

  const uischema = {
    type: 'Control',
    scope: '#/properties/choice',
  } as const;

  it('renders without throwing', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: {},
          renderers: [oneOfRendererEntry],
        },
      });
    }).not.toThrow();
  });

  it('renders a select trigger (button element)', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [oneOfRendererEntry],
      },
    });
    // bits-ui Select renders a button as the trigger
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
  });

  it('shows schema option labels in the trigger area', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [oneOfRendererEntry],
      },
    });
    // The trigger should contain the label of the first (default) option
    const triggerText = container.textContent ?? '';
    expect(triggerText).toContain('Option A');
  });

  it('renders with existing data without throwing', () => {
    expect(() => {
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { choice: { a: 'hello' } },
          renderers: [oneOfRendererEntry],
        },
      });
    }).not.toThrow();
  });
});
