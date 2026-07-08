/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

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
