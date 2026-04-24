import { textCellEntry } from './TextCell';
import { numberCellEntry } from './NumberCell';
import { integerCellEntry } from './IntegerCell';
import { booleanCellEntry } from './BooleanCell';
import { enumCellEntry } from './EnumCell';

export const cellRenderers = [
  textCellEntry,
  numberCellEntry,
  integerCellEntry,
  booleanCellEntry,
  enumCellEntry,
];
