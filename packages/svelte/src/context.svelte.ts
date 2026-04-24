import { setContext, getContext } from 'svelte';
import type { JsonFormsSubStates, Dispatch, CoreActions } from '@jsonforms/core';

const JSONFORMS_KEY = Symbol('jsonforms');

export interface JsonFormsContext {
  jsonforms: JsonFormsSubStates;
  dispatch: Dispatch<CoreActions>;
}

export function setJsonFormsContext(ctx: JsonFormsContext): void {
  setContext(JSONFORMS_KEY, ctx);
}

export function getJsonFormsContext(): JsonFormsContext | undefined {
  return getContext<JsonFormsContext | undefined>(JSONFORMS_KEY);
}

/**
 * Like `getJsonFormsContext` but throws if no ancestor provided the context.
 * Use this from composition functions where a missing context is a programmer error.
 */
export function requireJsonFormsContext(): JsonFormsContext {
  const ctx = getJsonFormsContext();
  if (!ctx) {
    throw new Error(
      "'jsonforms' context couldn't be injected. Are you within JSON Forms?"
    );
  }
  return ctx;
}
