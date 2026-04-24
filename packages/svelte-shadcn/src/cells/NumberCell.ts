import { rankWith, isNumberControl } from '@jsonforms/core';
import Component from './NumberCell.svelte';

export const numberCellEntry = {
  cell: Component,
  tester: rankWith(1, isNumberControl),
};
