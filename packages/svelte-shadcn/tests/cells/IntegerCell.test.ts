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
      const result = tester(uischema, schema, undefined);
      expect(result).toBe(1);
    });

    it('should have rank 1 tester in entry', () => {
      const result = integerCellEntry.tester(
        { type: 'Control', scope: '#/properties/value' },
        {
          type: 'object',
          properties: {
            value: { type: 'integer' },
          },
        },
        undefined
      );
      expect(result).toBe(1);
    });

    it('should not match non-integer controls', () => {
      const result = integerCellEntry.tester(
        { type: 'Control', scope: '#/properties/name' },
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
        undefined
      );
      expect(result).toBe(-1);
    });
  });
});
