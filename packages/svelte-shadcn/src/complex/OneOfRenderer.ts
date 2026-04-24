import { rankWith, isOneOfControl } from '@jsonforms/core';
import Component from './OneOfRenderer.svelte';

export const oneOfRendererEntry = {
  renderer: Component,
  tester: rankWith(3, isOneOfControl),
};
