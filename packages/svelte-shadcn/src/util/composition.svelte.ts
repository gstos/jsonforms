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

import {
  findUISchema,
  isDescriptionHidden,
  type ControlElement,
} from '@jsonforms/core';

type ControlInput = {
  control: any;
  handleChange: (path: string, value: unknown) => void;
};

export interface UseShadcnControlOptions {
  input: ControlInput;
  adaptValue?: (value: unknown) => unknown;
}

/**
 * Wraps the result of any `getJsonFormsXxxControl(props)` from `@jsonforms/svelte`.
 * Adds: merged options (config + uischema.options), a uniform `controlWrapper`
 * prop bundle for `<ControlWrapper>`, `onChange(value)`, and `isFocused` state.
 *
 * Proxy pattern: `appliedOptions` and `controlWrapper` are exposed through the
 * returned object's getters which re-read `$derived` on every access. This
 * preserves reactivity across module boundaries — see the Svelte 5 Proxy pattern
 * in `packages/svelte/src/compositions.svelte.ts`.
 */
export function useShadcnControl(opts: UseShadcnControlOptions) {
  const { input, adaptValue } = opts;
  const { control, handleChange } = input;

  const appliedOptions = $derived({
    ...(control.config ?? {}),
    ...((control.uischema as ControlElement)?.options ?? {}),
  });

  let isFocused = $state(false);

  const onChange = (value: unknown) => {
    handleChange(control.path, adaptValue ? adaptValue(value) : value);
  };

  const controlWrapper = $derived({
    id: control.id,
    description: control.description,
    errors: control.errors,
    // Pass the raw label; ControlWrapper renders the required asterisk
    // as a styled, aria-hidden span rather than a plain '*' suffix.
    label: control.label,
    visible: control.visible,
    // `required` here means "show the required asterisk". Suppress when
    // hideRequiredAsterisk is set via config or uischema.options.
    required: control.required && !appliedOptions.hideRequiredAsterisk,
    descriptionHidden: isDescriptionHidden(
      control.visible,
      control.description,
      isFocused,
      !!appliedOptions.showUnfocusedDescription
    ),
  });

  return {
    control,
    handleChange,
    get appliedOptions() {
      return appliedOptions;
    },
    get controlWrapper() {
      return controlWrapper;
    },
    get isFocused() {
      return isFocused;
    },
    set isFocused(v: boolean) {
      isFocused = v;
    },
    onChange,
  };
}

export interface UseShadcnLayoutOptions {
  input: { layout: any };
}

export function useShadcnLayout(opts: UseShadcnLayoutOptions) {
  const { layout } = opts.input;
  const appliedOptions = $derived({
    ...(layout.config ?? {}),
    ...(layout.uischema?.options ?? {}),
  });
  return {
    layout,
    get appliedOptions() {
      return appliedOptions;
    },
  };
}

export interface UseShadcnArrayControlOptions {
  input: {
    control: any;
    handleChange: (path: string, value: unknown) => void;
    addItem: (path: string, value: unknown) => () => void;
    removeItems?: (path: string, toDelete: number[]) => () => void;
    moveUp?: (path: string, toMove: number) => () => void;
    moveDown?: (path: string, toMove: number) => () => void;
  };
}

export function useShadcnArrayControl(opts: UseShadcnArrayControlOptions) {
  const base = useShadcnControl({ input: opts.input as ControlInput });

  const childUiSchema = $derived(
    findUISchema(
      base.control.uischemas ?? [],
      base.control.schema,
      base.control.uischema.scope,
      base.control.path,
      undefined,
      base.control.uischema,
      base.control.rootSchema
    )
  );

  const translations = $derived({
    addTooltip: 'Add',
    removeTooltip: 'Remove',
    upTooltip: 'Move up',
    downTooltip: 'Move down',
    noData: 'No data',
  });

  return {
    ...base,
    addItem: opts.input.addItem,
    removeItems: opts.input.removeItems,
    moveUp: opts.input.moveUp,
    moveDown: opts.input.moveDown,
    get childUiSchema() {
      return childUiSchema;
    },
    get translations() {
      return translations;
    },
    childLabelForIndex(index: number): string {
      return String(index + 1);
    },
  };
}
