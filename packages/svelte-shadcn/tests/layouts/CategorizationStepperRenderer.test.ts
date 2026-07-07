import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { categorizationStepperRendererEntry } from '../../src/layouts/CategorizationStepperRenderer';
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
});
