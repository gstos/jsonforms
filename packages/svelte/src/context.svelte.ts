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

import { setContext, getContext } from 'svelte';
import type {
  JsonFormsSubStates,
  Dispatch,
  CoreActions,
  Translator,
} from '@jsonforms/core';
import type Ajv from 'ajv';

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

export function getJsonForms(): JsonFormsSubStates;
export function getJsonForms(optional: true): JsonFormsSubStates | undefined;
export function getJsonForms(optional?: true) {
  const jsonforms = getJsonFormsContext()?.jsonforms;
  if (!jsonforms && !optional) {
    throw new Error(
      "'jsonforms' context couldn't be injected. Are you within JSON Forms?"
    );
  }
  return jsonforms;
}

export function getDispatch(): Dispatch<CoreActions>;
export function getDispatch(optional: true): Dispatch<CoreActions> | undefined;
export function getDispatch(optional?: true) {
  const dispatch = getJsonFormsContext()?.dispatch;
  if (!dispatch && !optional) {
    throw new Error(
      "'dispatch' context couldn't be injected. Are you within JSON Forms?"
    );
  }
  return dispatch;
}

export function getTranslator(): Translator;
export function getTranslator(optional: true): Translator | undefined;
export function getTranslator(optional?: true) {
  const jsonforms = optional === true ? getJsonForms(true) : getJsonForms();
  if (!jsonforms?.i18n?.translate) {
    if (optional) {
      return undefined;
    }
    throw new Error(
      "'jsonforms i18n' couldn't be injected. Are you within JSON Forms?"
    );
  }
  // Delegate per call so consumers always see the current translator
  // (the context object is reactive state; reads register dependencies).
  const translate = ((key, defaultMessage, values) => {
    const t = jsonforms.i18n?.translate;
    if (!t) {
      throw new Error(
        "'jsonforms i18n' couldn't be injected. Are you within JSON Forms?"
      );
    }
    return t(key, defaultMessage as string, values);
  }) as Translator;
  return translate;
}

export function getAjv(): Ajv;
export function getAjv(optional: true): Ajv | undefined;
export function getAjv(optional?: true) {
  const jsonforms = optional === true ? getJsonForms(true) : getJsonForms();
  if (!optional && !jsonforms?.core?.ajv) {
    throw new Error(
      "'jsonforms ajv' couldn't be injected. Are you within JSON Forms?"
    );
  }
  return jsonforms?.core?.ajv as Ajv;
}
