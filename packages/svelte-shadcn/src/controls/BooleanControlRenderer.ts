import { rankWith, isBooleanControl } from '@jsonforms/core';
import Component from './BooleanControlRenderer.svelte';

export const booleanControlRendererEntry = {
  renderer: Component,
  tester: rankWith(1, isBooleanControl),
};
