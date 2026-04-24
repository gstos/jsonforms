import { rankWith, isNumberControl } from '@jsonforms/core';
import Component from './NumberControlRenderer.svelte';

export const numberControlRendererEntry = {
  renderer: Component,
  tester: rankWith(1, isNumberControl),
};
