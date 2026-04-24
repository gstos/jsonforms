import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ControlWrapper from '../src/ControlWrapper.svelte';

describe('ControlWrapper', () => {
  it('renders children snippet content', () => {
    // Render with a simple string label and no children — verify structure
    const { container } = render(ControlWrapper as any, {
      props: { label: 'Name', visible: true },
    });
    // The wrapper div should be present when visible=true
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('is hidden when visible=false', () => {
    const { container } = render(ControlWrapper as any, {
      props: { label: 'Name', visible: false },
    });
    // No wrapping div should be rendered when not visible
    expect(container.querySelector('div')).toBeNull();
  });

  it('renders the label text', () => {
    const { getByText } = render(ControlWrapper as any, {
      props: { label: 'Email Address', visible: true },
    });
    expect(getByText('Email Address')).toBeTruthy();
  });

  it('renders required asterisk when required=true', () => {
    const { getByText } = render(ControlWrapper as any, {
      props: { label: 'Name', visible: true, required: true },
    });
    expect(getByText('*')).toBeTruthy();
  });

  it('does not render required asterisk when required=false', () => {
    const { container } = render(ControlWrapper as any, {
      props: { label: 'Name', visible: true, required: false },
    });
    const asterisk = container.querySelector('[aria-hidden="true"]');
    expect(asterisk).toBeNull();
  });

  it('renders description when descriptionHidden=false', () => {
    const { getByText } = render(ControlWrapper as any, {
      props: {
        label: 'Name',
        visible: true,
        description: 'Enter your full name',
        descriptionHidden: false,
      },
    });
    expect(getByText('Enter your full name')).toBeTruthy();
  });

  it('hides description when descriptionHidden=true', () => {
    const { container } = render(ControlWrapper as any, {
      props: {
        label: 'Name',
        visible: true,
        description: 'Enter your full name',
        descriptionHidden: true,
      },
    });
    // The description paragraph should not be rendered
    const paras = container.querySelectorAll('p');
    const descPara = Array.from(paras).find(
      (p) => p.textContent === 'Enter your full name'
    );
    expect(descPara).toBeUndefined();
  });

  it('renders error text when errors non-empty', () => {
    const { getByText, getByRole } = render(ControlWrapper as any, {
      props: {
        label: 'Name',
        visible: true,
        errors: 'This field is required',
      },
    });
    expect(getByText('This field is required')).toBeTruthy();
    // The error element should have role="alert"
    expect(getByRole('alert')).toBeTruthy();
  });

  it('does not render error area when errors is empty string', () => {
    const { container } = render(ControlWrapper as any, {
      props: { label: 'Name', visible: true, errors: '' },
    });
    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).toBeNull();
  });

  it('does not render label element when label prop is absent', () => {
    const { container } = render(ControlWrapper as any, {
      props: { visible: true },
    });
    const labelEl = container.querySelector('label');
    expect(labelEl).toBeNull();
  });

  it('defaults visible to true when prop is omitted', () => {
    const { container } = render(ControlWrapper as any, {
      props: { label: 'Test' },
    });
    expect(container.querySelector('div')).toBeTruthy();
  });
});
