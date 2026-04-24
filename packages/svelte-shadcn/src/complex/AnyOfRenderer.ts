import { rankWith, isAnyOfControl } from '@jsonforms/core';
import Component from './AnyOfRenderer.svelte';

export const anyOfRendererEntry = {
  renderer: Component,
  tester: rankWith(3, isAnyOfControl),
};
