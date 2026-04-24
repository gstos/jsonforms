import { rankWith, isStringControl } from '@jsonforms/core';
import Component from './TextCell.svelte';

export const textCellEntry = {
  cell: Component,
  tester: rankWith(1, isStringControl),
};
