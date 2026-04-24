import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { sliderControlRendererEntry } from '../../src/controls/SliderControlRenderer';

describe('SliderControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      vol: { type: 'integer', minimum: 0, maximum: 10, default: 3 },
    },
    required: ['vol'],
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/vol',
    options: { slider: true },
  } as const;

  it('renders without throwing', () => {
    expect(() =>
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { vol: 5 },
          renderers: [sliderControlRendererEntry],
        },
      }),
    ).not.toThrow();
  });

  it('renders a slider element with role="slider"', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { vol: 5 },
        renderers: [sliderControlRendererEntry],
      },
    });
    const slider = container.querySelector('[role="slider"]');
    expect(slider).toBeTruthy();
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [sliderControlRendererEntry],
      },
    });
    expect(getByText('*')).toBeTruthy();
  });
});
