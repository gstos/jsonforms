/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { categorizationStepperRendererEntry } from '../../src/layouts/CategorizationStepperRenderer';
import { categorizationRendererEntry } from '../../src/layouts/CategorizationRenderer';
import { stringControlRendererEntry } from '../../src/controls/StringControlRenderer';

const schema = {
  type: 'object',
  properties: { a: { type: 'string' }, b: { type: 'string' } },
};
const stepperUischema = (extraOptions: Record<string, unknown> = {}) => ({
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'StepA',
      elements: [{ type: 'Control', scope: '#/properties/a' }],
    },
    {
      type: 'Category',
      label: 'StepB',
      elements: [{ type: 'Control', scope: '#/properties/b' }],
    },
  ],
  options: { variant: 'stepper', ...extraOptions },
});
const mount = (uischema: unknown, extra: Record<string, unknown> = {}) =>
  render(JsonForms as any, {
    props: {
      schema,
      uischema,
      data: { a: 'hello', b: 'world' },
      renderers: [categorizationStepperRendererEntry, stringControlRendererEntry],
      ...extra,
    },
  });

describe('CategorizationStepperRenderer', () => {
  it('renders both step labels', () => {
    const { getByText } = mount(stepperUischema());
    expect(getByText('StepA')).toBeTruthy();
    expect(getByText('StepB')).toBeTruthy();
  });

  it('shows only the first step content initially', () => {
    const { container } = mount(stepperUischema());
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(1);
    expect((inputs[0] as HTMLInputElement).value).toBe('hello');
  });

  it('shows nav buttons when showNavButtons is set and Next advances', async () => {
    const { container, getByText } = mount(stepperUischema({ showNavButtons: true }));
    const next = getByText('Next');
    await fireEvent.click(next);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('world');
  });

  it('does not render nav buttons without showNavButtons', () => {
    const { queryByText } = mount(stepperUischema());
    expect(queryByText('Next')).toBeNull();
  });

  it('renders the mapped/translated label, not the raw uischema.label', () => {
    const i18nUischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'StepA',
          i18n: 'stepLabelKey',
          elements: [{ type: 'Control', scope: '#/properties/a' }],
        },
        {
          type: 'Category',
          label: 'StepB',
          elements: [{ type: 'Control', scope: '#/properties/b' }],
        },
      ],
      options: { variant: 'stepper' },
    };
    const { getByText, queryByText } = mount(i18nUischema, {
      i18n: {
        translate: (key: string, defaultMessage?: string) =>
          key === 'stepLabelKey.label' ? 'Translated StepA' : defaultMessage,
      },
    });

    expect(getByText('Translated StepA')).toBeTruthy();
    expect(queryByText('StepA')).toBeNull();
  });
});

describe('CategorizationStepperRenderer tester precedence', () => {
  // Register BOTH categorization renderers so JsonForms picks by rank.
  const bothRenderers = [
    categorizationRendererEntry,
    categorizationStepperRendererEntry,
    stringControlRendererEntry,
  ];
  // Stepper hook: the numbered step badge span. Tabs hook: bits-ui tablist role.
  const stepBadge = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('span.rounded-full')).find(
      (el) => el.textContent?.trim() === '1'
    );

  it('picks the stepper (rank 3) over tabs (rank 2) when variant is stepper', () => {
    const { container, getByText } = mount(stepperUischema(), {
      renderers: bothRenderers,
    });
    expect(getByText('StepA')).toBeTruthy();
    expect(stepBadge(container)).toBeTruthy();
    expect(container.querySelector('[role="tablist"]')).toBeNull();
  });

  it('falls back to the tabs renderer when variant is not stepper', () => {
    const { options: _drop, ...noVariantUischema } = stepperUischema();
    const { container, getByText } = mount(noVariantUischema, {
      renderers: bothRenderers,
    });
    expect(getByText('StepA')).toBeTruthy();
    expect(container.querySelector('[role="tablist"]')).toBeTruthy();
    expect(stepBadge(container)).toBeUndefined();
  });
});
