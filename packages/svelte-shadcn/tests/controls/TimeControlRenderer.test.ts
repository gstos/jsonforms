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
