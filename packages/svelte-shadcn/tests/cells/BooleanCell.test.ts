import { describe, it, expect } from 'vitest';
import { isBooleanControl, rankWith } from '@jsonforms/core';
import { booleanCellEntry } from '../../src/cells/BooleanCell';

describe('BooleanCell', () => {
  describe('tester', () => {
    it('should rank 1 for boolean control', () => {
      const tester = rankWith(1, isBooleanControl);
      const uischema = { type: 'Control', scope: '#/properties/isActive' };
      const schema = {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
        },
      };
      const result = tester(uischema, schema, { rootSchema: schema, config: {} });
      expect(result).toBe(1);
    });

    it('should have rank 1 tester in entry', () => {
      const entrySchema = {
        type: 'object',
        properties: {
          value: { type: 'boolean' },
        },
      };
      const result = booleanCellEntry.tester(
        { type: 'Control', scope: '#/properties/value' },
        entrySchema,
        { rootSchema: entrySchema, config: {} }
      );
      expect(result).toBe(1);
    });

    it('should not match non-boolean controls', () => {
      const nonBoolSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      };
      const result = booleanCellEntry.tester(
        { type: 'Control', scope: '#/properties/name' },
        nonBoolSchema,
        { rootSchema: nonBoolSchema, config: {} }
      );
      expect(result).toBe(-1);
    });
  });

  describe('entry', () => {
    it('exports booleanCellEntry with cell and tester', () => {
      expect(booleanCellEntry).toBeDefined();
      expect(booleanCellEntry.cell).toBeDefined();
      expect(booleanCellEntry.tester).toBeDefined();
    });
  });
});
