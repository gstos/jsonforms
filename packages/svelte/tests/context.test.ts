import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import ContextProbe from './ContextProbe.svelte';
import GetJsonFormsHost from './GetJsonFormsHost.svelte';
import GetDispatchHost from './GetDispatchHost.svelte';
import GetTranslatorHost from './GetTranslatorHost.svelte';
import GetAjvHost from './GetAjvHost.svelte';
import JsonForms from '../src/JsonForms.svelte';
import AccessorsProbe from './fixtures/AccessorsProbe.svelte';

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

describe('getTranslator', () => {
  it('(a) returns a function backed by the i18n.translate provided to <JsonForms>', () => {
    const { getByTestId } = render(JsonForms, {
      props: {
        data: {},
        schema: { type: 'object' },
        uischema: { type: 'Label', text: 'hi' },
        renderers: [
          { renderer: AccessorsProbe, tester: rankWith(1, uiTypeIs('Label')) },
        ],
        i18n: { translate: (key: string) => 'translated:' + key },
      },
    });
    expect(getByTestId('translated').textContent).toBe('translated:foo');
  });

  it('(b) throws when i18n.translate is not available in context', () => {
    expect(() =>
      render(GetTranslatorHost, {
        props: {
          provided: {
            jsonforms: { core: {} } as any,
            dispatch: (a: any) => a,
          },
        },
      })
    ).toThrow(/i18n/);
  });

  it('(c) (optional) returns undefined without throwing when i18n.translate is not available', () => {
    const { getByTestId } = render(GetTranslatorHost, {
      props: {
        provided: { jsonforms: { core: {} } as any, dispatch: (a: any) => a },
        optional: true,
      },
    });
    expect(getByTestId('probe').textContent).toBe('undefined');
  });
});

describe('getAjv', () => {
  it('(d) returns the ajv instance from jsonforms.core.ajv inside <JsonForms>', () => {
    const { getByTestId } = render(JsonForms, {
      props: {
        data: {},
        schema: { type: 'object' },
        uischema: { type: 'Label', text: 'hi' },
        renderers: [
          { renderer: AccessorsProbe, tester: rankWith(1, uiTypeIs('Label')) },
        ],
      },
    });
    expect(getByTestId('ajv-validate-type').textContent).toBe('function');
  });

  it('throws when core.ajv is not available in context', () => {
    expect(() =>
      render(GetAjvHost, {
        props: {
          provided: {
            jsonforms: { core: {} } as any,
            dispatch: (a: any) => a,
          },
        },
      })
    ).toThrow(/ajv/);
  });

  it('(e) (optional) returns undefined without throwing when no ancestor set the context', () => {
    const { getByTestId } = render(GetAjvHost, {
      props: { provided: null, optional: true },
    });
    expect(getByTestId('probe').textContent).toBe('undefined');
  });
});
