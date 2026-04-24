import { rankWith, isEnumControl } from '@jsonforms/core';
import Component from './EnumCell.svelte';

export const enumCellEntry = {
  cell: Component,
  tester: rankWith(2, isEnumControl),
};
