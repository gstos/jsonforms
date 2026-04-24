import { rankWith, isIntegerControl } from '@jsonforms/core';
import Component from './IntegerCell.svelte';

export const integerCellEntry = {
  cell: Component,
  tester: rankWith(1, isIntegerControl),
};
