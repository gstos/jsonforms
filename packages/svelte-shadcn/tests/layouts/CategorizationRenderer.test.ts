import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { categorizationRendererEntry } from '../../src/layouts/CategorizationRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

describe('CategorizationRenderer', () => {
  const schema = {
    type: 'object',
    properties: {
      a: { type: 'string' },
      b: { type: 'string' },
    },
  };

  const uischema = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'First',
        elements: [{ type: 'Control', scope: '#/properties/a' }],
      },
      {
        type: 'Category',
        label: 'Second',
        elements: [{ type: 'Control', scope: '#/properties/b' }],
      },
    ],
  } as const;

  it('renders without throwing', () => {
    expect(() =>
      render(JsonForms as any, {
        props: {
          schema,
          uischema,
          data: { a: 'hello', b: 'world' },
          renderers: [categorizationRendererEntry, stringControlRendererEntry],
        },
      })
    ).not.toThrow();
  });

  it('renders both category labels as tab triggers', () => {
    const { getByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'hello', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
      },
    });

    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
  });

  it('renders at least one input (for the active first category)', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { a: 'hello', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
      },
    });

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  const hiddenUischema = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'First',
        elements: [{ type: 'Control', scope: '#/properties/a' }],
        rule: {
          effect: 'HIDE',
          condition: { scope: '#/properties/a', schema: { const: 'hide-first' } },
        },
      },
      {
        type: 'Category',
        label: 'Second',
        elements: [{ type: 'Control', scope: '#/properties/b' }],
      },
    ],
  } as const;

  it('does not render tabs for invisible categories', () => {
    const { queryByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema: hiddenUischema,
        data: { a: 'hide-first', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
      },
    });
    expect(queryByText('First')).toBeNull();
    expect(queryByText('Second')).toBeTruthy();
  });

  it('activates the first visible category and renders its content', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema: hiddenUischema,
        data: { a: 'hide-first', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
      },
    });
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('world'); // content of the ORIGINAL index-1 category
  });

  const i18nUischema = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'First',
        i18n: 'categoryLabelKey',
        elements: [{ type: 'Control', scope: '#/properties/a' }],
      },
      {
        type: 'Category',
        label: 'Second',
        elements: [{ type: 'Control', scope: '#/properties/b' }],
      },
    ],
  } as const;

  it('renders the mapped/translated label, not the raw uischema.label', () => {
    const { getByText, queryByText } = render(JsonForms as any, {
      props: {
        schema,
        uischema: i18nUischema,
        data: { a: 'hello', b: 'world' },
        renderers: [categorizationRendererEntry, stringControlRendererEntry],
        i18n: {
          translate: (key: string, defaultMessage?: string) =>
            key === 'categoryLabelKey.label' ? 'Translated First' : defaultMessage,
        },
      },
    });

    expect(getByText('Translated First')).toBeTruthy();
    expect(queryByText('First')).toBeNull();
  });
});
