import { rankWith, and, isStringControl, isMultiLineControl } from '@jsonforms/core';
import Component from './MultiStringControlRenderer.svelte';

export const multiStringControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, and(isStringControl, isMultiLineControl)),
};
