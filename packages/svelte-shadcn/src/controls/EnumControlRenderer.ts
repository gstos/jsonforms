import { rankWith, isEnumControl } from '@jsonforms/core';
import Component from './EnumControlRenderer.svelte';

export const enumControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isEnumControl),
};
