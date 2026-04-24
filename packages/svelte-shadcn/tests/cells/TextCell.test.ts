import { describe, it, expect } from 'vitest';
import { textCellEntry } from '../../src/cells/TextCell';
import { isStringControl } from '@jsonforms/core';

describe('TextCell', () => {
  describe('entry', () => {
    it('exports textCellEntry with cell and tester', () => {
      expect(textCellEntry).toBeDefined();
      expect(textCellEntry.cell).toBeDefined();
      expect(textCellEntry.tester).toBeDefined();
    });
  });

  describe('tester', () => {
    it('ranks string control with rank 1', () => {
      const schema = { type: 'string' };
      const uischema = { type: 'Control', scope: '#/properties/name' };
      const rank = textCellEntry.tester(uischema, schema, { rootSchema: schema, config: {} });
      expect(rank).toBe(1);
    });

    it('ranks non-string control with -1', () => {
      const schema = { type: 'number' };
      const uischema = { type: 'Control', scope: '#/properties/age' };
      const rank = textCellEntry.tester(uischema, schema, { rootSchema: schema, config: {} });
      expect(rank).toBe(-1);
    });

    it('uses isStringControl from @jsonforms/core', () => {
      const stringSchema = { type: 'string' };
      const uischema = { type: 'Control', scope: '#/properties/test' };
      const ctx = { rootSchema: stringSchema, config: {} };

      // Both should return same rank regardless of schema validation
      // because tester is based on isStringControl
      const stringRank = textCellEntry.tester(uischema, stringSchema, ctx);
      expect(isStringControl(uischema, stringSchema, ctx)).toBe(true);
      expect(stringRank).toBe(1);
    });
  });
});
