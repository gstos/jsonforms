import { rankWith, isDateTimeControl } from '@jsonforms/core';
import Component from './DateTimeControlRenderer.svelte';

export const dateTimeControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isDateTimeControl),
};
