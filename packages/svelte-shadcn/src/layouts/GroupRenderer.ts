import { rankWith, and, uiTypeIs, isLayout } from '@jsonforms/core';
import Component from './GroupRenderer.svelte';

export const groupRendererEntry = {
  renderer: Component,
  tester: rankWith(2, and(uiTypeIs('Group'), isLayout)),
};
