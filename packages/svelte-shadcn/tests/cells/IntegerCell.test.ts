import { describe, it, expect } from 'vitest';
import { isIntegerControl, rankWith } from '@jsonforms/core';
import { integerCellEntry } from '../../src/cells/IntegerCell';

describe('IntegerCell', () => {
  describe('tester', () => {
    it('should rank 1 for integer control', () => {
      const tester = rankWith(1, isIntegerControl);
      const uischema = { type: 'Control', scope: '#/properties/age' };
      const schema = {
        type: 'object',
        properties: {
          age: { type: 'integer' },
        },
      };
      const result = tester(uischema, schema, { rootSchema: schema, config: {} });
      expect(result).toBe(1);
    });

    it('should have rank 1 tester in entry', () => {
      const entrySchema = {
        type: 'object',
        properties: {
          value: { type: 'integer' },
        },
      };
      const result = integerCellEntry.tester(
        { type: 'Control', scope: '#/properties/value' },
        entrySchema,
        { rootSchema: entrySchema, config: {} }
      );
      expect(result).toBe(1);
    });

    it('should not match non-integer controls', () => {
      const nonIntSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      };
      const result = integerCellEntry.tester(
        { type: 'Control', scope: '#/properties/name' },
        nonIntSchema,
        { rootSchema: nonIntSchema, config: {} }
      );
      expect(result).toBe(-1);
    });
  });
});
