import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { arrayListRendererEntry } from '../../src/array/ArrayListRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';
import { verticalLayoutRendererEntry } from '../../src/layouts/VerticalLayoutRenderer';

describe('ArrayListRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  };
  const uischema = { type: 'Control', scope: '#/properties/tags' } as const;
  const renderers = [arrayListRendererEntry, stringControlRendererEntry, verticalLayoutRendererEntry];

  it('renders 2 items when data has 2 array entries', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a', 'b'] },
        renderers,
      },
    });
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].value).toBe('a');
    expect(inputs[1].value).toBe('b');
  });

  it('renders the add button with + text', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: [] },
        renderers,
      },
    });
    const buttons = container.querySelectorAll('button');
    const addButton = Array.from(buttons).find((b) => b.textContent?.includes('+'));
    expect(addButton).toBeTruthy();
  });

  it('renders remove, up, and down buttons for each item', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a', 'b'] },
        renderers,
      },
    });
    const upButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('↑')
    );
    const downButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('↓')
    );
    const removeButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('✕')
    );
    expect(upButtons.length).toBe(2);
    expect(downButtons.length).toBe(2);
    expect(removeButtons.length).toBe(2);
  });

  it('shows no data message when array is empty', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: [] },
        renderers,
      },
    });
    const noData = container.querySelector('p');
    expect(noData).toBeTruthy();
    expect(noData!.textContent).toContain('No data');
  });

  it('adds an item when add button is clicked', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: [] },
        renderers,
        onchange: (e: any) => events.push(e),
      },
    });
    const addButton = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('+')
    )!;
    await fireEvent.click(addButton);
    expect(events.length).toBeGreaterThan(0);
    expect(Array.isArray(events[events.length - 1].data.tags)).toBe(true);
    expect(events[events.length - 1].data.tags.length).toBe(1);
  });

  it('removes an item when remove button is clicked', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { tags: ['a', 'b'] },
        renderers,
        onchange: (e: any) => events.push(e),
      },
    });
    const removeButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('✕')
    );
    await fireEvent.click(removeButtons[0]);
    expect(events.length).toBeGreaterThan(0);
    expect(events[events.length - 1].data.tags.length).toBe(1);
  });
});
