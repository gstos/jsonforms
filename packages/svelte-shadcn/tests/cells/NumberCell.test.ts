import { describe, it, expect } from 'vitest';
import { isNumberControl, rankWith } from '@jsonforms/core';
import { numberCellEntry } from '../../src/cells/NumberCell';

describe('NumberCell', () => {
  describe('tester', () => {
    it('should rank 1 for number control', () => {
      const tester = rankWith(1, isNumberControl);
      const uischema = { type: 'Control', scope: '#/properties/age' };
      const schema = {
        type: 'object',
        properties: {
          age: { type: 'number' },
        },
      };
      const result = tester(uischema, schema, { rootSchema: schema, config: {} });
      expect(result).toBe(1);
    });

    it('should have rank 1 tester in entry', () => {
      const entrySchema = {
        type: 'object',
        properties: {
          value: { type: 'number' },
        },
      };
      const result = numberCellEntry.tester(
        { type: 'Control', scope: '#/properties/value' },
        entrySchema,
        { rootSchema: entrySchema, config: {} }
      );
      expect(result).toBe(1);
    });

    it('should not match non-number controls', () => {
      const nonNumSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      };
      const result = numberCellEntry.tester(
        { type: 'Control', scope: '#/properties/name' },
        nonNumSchema,
        { rootSchema: nonNumSchema, config: {} }
      );
      expect(result).toBe(-1);
    });
  });
});
