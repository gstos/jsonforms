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
