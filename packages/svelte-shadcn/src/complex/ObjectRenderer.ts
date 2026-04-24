import { rankWith, isObjectControl } from '@jsonforms/core';
import Component from './ObjectRenderer.svelte';

export const objectRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isObjectControl),
};
