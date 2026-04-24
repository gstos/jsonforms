import { rankWith, isDateControl } from '@jsonforms/core';
import Component from './DateControlRenderer.svelte';

export const dateControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isDateControl),
};
