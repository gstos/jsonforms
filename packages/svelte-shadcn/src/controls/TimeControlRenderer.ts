import { rankWith, isTimeControl } from '@jsonforms/core';
import Component from './TimeControlRenderer.svelte';

export const timeControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isTimeControl),
};
