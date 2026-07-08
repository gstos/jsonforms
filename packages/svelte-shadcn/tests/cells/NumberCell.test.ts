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
