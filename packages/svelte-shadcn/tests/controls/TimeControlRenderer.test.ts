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
import { timeControlRendererEntry } from '../../src/controls/TimeControlRenderer';

const schema = { type: 'string', title: 'My Time', format: 'time' };
const uischema = {
  type: 'Control',
  scope: '#',
  options: { placeholder: 'time placeholder' },
};

const mountProps = (data: string, extra: Record<string, unknown> = {}) => ({
  props: {
    schema,
    uischema,
    data,
    renderers: [timeControlRendererEntry],
    ...extra,
  },
});

describe('TimeControlRenderer', () => {
  it('renders a time input with placeholder', () => {
    const { container } = render(JsonForms as any, mountProps('00:20:00'));
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('time placeholder');
  });

  it('renders title as label', () => {
    const { getByText } = render(JsonForms as any, mountProps('00:20:00'));
    expect(getByText('My Time')).toBeTruthy();
  });

  it('appends seconds when value is HH:MM', async () => {
    let latest: unknown;
    const { container } = render(
      JsonForms as any,
      mountProps('00:20:00', { onchange: (e: { data: unknown }) => (latest = e.data) })
    );
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '01:30' } });
    expect(latest).toBe('01:30:00');
  });

  it('preserves seconds when value is already HH:MM:SS', async () => {
    let latest: unknown;
    const { container } = render(
      JsonForms as any,
      mountProps('00:20:00', { onchange: (e: { data: unknown }) => (latest = e.data) })
    );
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '01:30:45' } });
    expect(latest).toBe('01:30:45');
  });
});
