import { rankWith, isRangeControl } from '@jsonforms/core';
import Component from './SliderControlRenderer.svelte';

export const sliderControlRendererEntry = {
  renderer: Component,
  tester: rankWith(2, isRangeControl),
};
