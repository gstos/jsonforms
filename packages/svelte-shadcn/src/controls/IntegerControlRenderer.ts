import { rankWith, isIntegerControl } from '@jsonforms/core';
import Component from './IntegerControlRenderer.svelte';

export const integerControlRendererEntry = {
  renderer: Component,
  tester: rankWith(1, isIntegerControl),
};
