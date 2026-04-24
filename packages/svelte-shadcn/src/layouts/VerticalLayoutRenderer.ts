import { rankWith, uiTypeIs } from '@jsonforms/core';
import Component from './VerticalLayoutRenderer.svelte';

export const verticalLayoutRendererEntry = {
  renderer: Component,
  tester: rankWith(1, uiTypeIs('VerticalLayout')),
};
