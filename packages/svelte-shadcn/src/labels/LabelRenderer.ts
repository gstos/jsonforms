import { rankWith, uiTypeIs } from '@jsonforms/core';
import Component from './LabelRenderer.svelte';

export const labelRendererEntry = {
  renderer: Component,
  tester: rankWith(1, uiTypeIs('Label')),
};
