import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ContextProbe from './ContextProbe.svelte';

describe('jsonforms context', () => {
  it('getJsonFormsContext returns what setJsonFormsContext set in a parent', () => {
    const { getByTestId } = render(ContextProbe, {
      props: {
        provided: { jsonforms: { core: { data: 42 } } as any, dispatch: () => {} },
      },
    });
    expect(getByTestId('probe').textContent).toBe('42');
  });

  it('getJsonFormsContext returns undefined when no ancestor set it', async () => {
    const { getByTestId } = render(ContextProbe, {
      props: { provided: null },
    });
    expect(getByTestId('probe').textContent).toBe('no-context');
  });
});
