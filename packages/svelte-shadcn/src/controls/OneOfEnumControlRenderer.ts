import { rankWith, isOneOfEnumControl } from '@jsonforms/core';
import Component from './OneOfEnumControlRenderer.svelte';

export const oneOfEnumControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isOneOfEnumControl),
};
