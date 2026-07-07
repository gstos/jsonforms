import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ContextProbe from './ContextProbe.svelte';
import GetJsonFormsHost from './GetJsonFormsHost.svelte';
import GetDispatchHost from './GetDispatchHost.svelte';

describe('jsonforms context', () => {
  it('getJsonFormsContext returns what setJsonFormsContext set in a parent', () => {
    const { getByTestId } = render(ContextProbe, {
      props: {
        provided: { jsonforms: { core: { data: 42 } } as any, dispatch: (a: any) => a },
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

describe('getJsonForms', () => {
  it('returns the substates object when inside a provider', () => {
    const { getByTestId } = render(GetJsonFormsHost, {
      props: {
        provided: { jsonforms: { core: { data: 42 } } as any, dispatch: (a: any) => a },
      },
    });
    expect(getByTestId('probe').textContent).toBe('42');
  });

  it('throws when no ancestor set the context', () => {
    expect(() =>
      render(GetJsonFormsHost, { props: { provided: null } })
    ).toThrow(/couldn't be injected/);
  });

  it('(optional) returns undefined without throwing when no ancestor set the context', () => {
    const { getByTestId } = render(GetJsonFormsHost, {
      props: { provided: null, optional: true },
    });
    expect(getByTestId('probe').textContent).toBe('undefined');
  });
});

describe('getDispatch', () => {
  it('returns the dispatch function when inside a provider', () => {
    const { getByTestId } = render(GetDispatchHost, {
      props: {
        provided: { jsonforms: { core: { data: 42 } } as any, dispatch: (a: any) => a },
      },
    });
    expect(getByTestId('probe').textContent).toBe('function');
  });

  it('throws when no ancestor set the context', () => {
    expect(() =>
      render(GetDispatchHost, { props: { provided: null } })
    ).toThrow(/couldn't be injected/);
  });

  it('(optional) returns undefined without throwing when no ancestor set the context', () => {
    const { getByTestId } = render(GetDispatchHost, {
      props: { provided: null, optional: true },
    });
    expect(getByTestId('probe').textContent).toBe('undefined');
  });
});
