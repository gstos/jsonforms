import { rankWith, isAllOfControl } from '@jsonforms/core';
import Component from './AllOfRenderer.svelte';

export const allOfRendererEntry = {
  renderer: Component,
  tester: rankWith(3, isAllOfControl),
};
