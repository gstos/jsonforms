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
import { render, fireEvent } from '@testing-library/svelte';
import { JsonForms } from '@jsonforms/svelte';
import { multiStringControlRendererEntry } from '../../src/controls/MultiStringControlRenderer';

describe('MultiStringControlRenderer', () => {
  const schema = {
    type: 'object',
    properties: { bio: { type: 'string' } },
    required: ['bio'],
  };
  const uischema = {
    type: 'Control',
    scope: '#/properties/bio',
    options: { multi: true },
  } as const;

  it('renders a textarea with initial data', () => {
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { bio: 'Hello world' },
        renderers: [multiStringControlRendererEntry],
      },
    });
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea!.value).toBe('Hello world');
  });

  it('fires onchange with new value when user types', async () => {
    const events: any[] = [];
    const { container } = render(JsonForms as any, {
      props: {
        schema,
        uischema,
        data: { bio: 'Hello world' },
        renderers: [multiStringControlRendererEntry],
        onchange: (e: any) => events.push(e),
      },
    });
    const textarea = container.querySelector('textarea')!;
    await fireEvent.input(textarea, { target: { value: 'Updated bio' } });
    expect(events[events.length - 1].data).toEqual({ bio: 'Updated bio' });
  });

  it('shows required asterisk', () => {
    const { getByText } = render(JsonForms as any, {
      props: { schema, uischema, data: {}, renderers: [multiStringControlRendererEntry] },
    });
    // Implementation-detail check; lax assertion
    expect(getByText('*')).toBeTruthy();
  });
});
