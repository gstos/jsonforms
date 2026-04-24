import { rankWith, schemaTypeIs } from '@jsonforms/core';
import Component from './ArrayListRenderer.svelte';

export const arrayListRendererEntry = {
  renderer: Component,
  tester: rankWith(2, schemaTypeIs('array')),
};
