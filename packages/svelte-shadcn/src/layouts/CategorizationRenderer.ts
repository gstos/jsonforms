import { rankWith, and, isCategorization, categorizationHasCategory } from '@jsonforms/core';
import Component from './CategorizationRenderer.svelte';

export const categorizationRendererEntry = {
  renderer: Component,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
};
