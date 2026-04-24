import { rankWith, isStringControl } from '@jsonforms/core';
import Component from './StringControlRenderer.svelte';

export const stringControlRendererEntry = {
  renderer: Component,
  tester: rankWith(1, isStringControl),
};
