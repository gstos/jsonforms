import {
  and,
  categorizationHasCategory,
  isCategorization,
  optionIs,
  rankWith,
} from '@jsonforms/core';
import Component from './CategorizationStepperRenderer.svelte';

export const categorizationStepperRendererEntry = {
  renderer: Component,
  tester: rankWith(
    3,
    and(
      isCategorization,
      categorizationHasCategory,
      optionIs('variant', 'stepper')
    )
  ),
};
