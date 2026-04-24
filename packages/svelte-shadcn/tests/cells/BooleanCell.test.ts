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
      const result = tester(uischema, schema, undefined);
      expect(result).toBe(1);
    });

    it('should have rank 1 tester in entry', () => {
      const result = booleanCellEntry.tester(
        { type: 'Control', scope: '#/properties/value' },
        {
          type: 'object',
          properties: {
            value: { type: 'boolean' },
          },
        },
        undefined
      );
      expect(result).toBe(1);
    });

    it('should not match non-boolean controls', () => {
      const result = booleanCellEntry.tester(
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

  describe('entry', () => {
    it('exports booleanCellEntry with cell and tester', () => {
      expect(booleanCellEntry).toBeDefined();
      expect(booleanCellEntry.cell).toBeDefined();
      expect(booleanCellEntry.tester).toBeDefined();
    });
  });
});
