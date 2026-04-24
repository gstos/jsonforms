import { rankWith, uiTypeIs } from '@jsonforms/core';
import Component from './HorizontalLayoutRenderer.svelte';

export const horizontalLayoutRendererEntry = {
  renderer: Component,
  tester: rankWith(1, uiTypeIs('HorizontalLayout')),
};
