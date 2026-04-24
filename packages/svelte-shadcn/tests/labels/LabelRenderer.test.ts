import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { labelRendererEntry } from '../../src/labels/LabelRenderer';

describe('LabelRenderer', () => {
  it('renders label text as a paragraph', () => {
    const schema = {
      type: 'object',
      properties: {},
    };
    const uischema = {
      type: 'Label',
      text: 'Hello',
    } as const;

    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: {},
        renderers: [labelRendererEntry],
      },
    });

    const paragraph = container.querySelector('p');
    expect(paragraph).toBeTruthy();
    expect(paragraph!.textContent).toBe('Hello');
  });
});
