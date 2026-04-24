import { rankWith, isBooleanControl } from '@jsonforms/core';
import Component from './BooleanCell.svelte';

export const booleanCellEntry = {
  cell: Component,
  tester: rankWith(1, isBooleanControl),
};
