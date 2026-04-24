import {
  type ControlElement,
  type CoreActions,
  type Dispatch,
  type JsonFormsState,
  type Scopable,
  type UISchemaElement,
  type JsonSchema,
  createId,
  isControl,
  mapDispatchToControlProps,
  mapStateToControlProps,
  removeId,
} from '@jsonforms/core';
import { requireJsonFormsContext } from './context.svelte';
import type { ControlProps, Required } from './types';

/**
 * Generic composition primitive. Subscribes to the jsonforms context and
 * exposes a reactive `control` object derived from a core state mapper,
 * plus optional dispatch methods from a core dispatch mapper.
 *
 * Id lifecycle: allocates a fresh core id whenever `props.schema` changes
 * (including on initial setup) and releases it on unmount or before
 * re-allocating.
 */
export function useControl<
  R,
  D,
  P extends { schema: JsonSchema; uischema: UISchemaElement & Scopable }
>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R
): { control: Required<P & R> };
export function useControl<
  R,
  D,
  P extends { schema: JsonSchema; uischema: UISchemaElement & Scopable }
>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap: (dispatch: Dispatch<CoreActions>) => D
): { control: Required<P & R> } & D;
export function useControl<
  R,
  D,
  P extends { schema: JsonSchema; uischema: UISchemaElement & Scopable }
>(
  props: P,
  stateMap: (state: JsonFormsState, props: P) => R,
  dispatchMap?: (dispatch: Dispatch<CoreActions>) => D
) {
  const { jsonforms, dispatch } = requireJsonFormsContext();

  let id = $state<string | undefined>(undefined);

  // Derived mapped control object; readers get reactive updates because
  // accessing `props.schema` / `props.uischema` / `jsonforms.core.*` during
  // the deriver's eval registers a dependency.
  const derived = $derived({
    ...props,
    ...stateMap({ jsonforms }, props),
    id,
  }) as Required<P & R>;

  // Expose derived via a getter so cross-module consumers preserve reactivity.
  // Using getter-based object instead of Proxy to ensure reliable reactivity
  // when accessed from a .svelte component's template, since Svelte's reactivity
  // tracks property reads through the getter on each access.
  const control = {
    get id() { return derived.id; },
  } as Required<P & R>;

  // Build a proper getter-proxy that forwards all property accesses to `derived`.
  // This is needed because `derived` is the live reactive object — each property
  // access goes through the getter, re-reading the $derived value and registering
  // the dependency in whatever reactive context the caller is in.
  const controlProxy = new Proxy(control as object, {
    get(_target, key) {
      return (derived as Record<string | symbol, unknown>)[key as string];
    },
    has(_target, key) {
      return key in (derived as object);
    },
    ownKeys() {
      return Reflect.ownKeys(derived as object);
    },
    getOwnPropertyDescriptor(_target, key) {
      return Object.getOwnPropertyDescriptor(derived as object, key);
    },
  }) as Required<P & R>;

  // Id allocation — runs on mount and whenever props.schema changes.
  $effect(() => {
    const u = props.uischema;
    // Track schema so effect re-runs when it changes.
    void props.schema;
    if (u && isControl(u as UISchemaElement) && (u as Scopable).scope) {
      id = createId((u as Scopable).scope!);
    }
    return () => {
      if (id) {
        removeId(id);
        id = undefined;
      }
    };
  });

  const dispatchMethods = dispatchMap?.(dispatch);

  return {
    control: controlProxy,
    ...(dispatchMethods as D),
  };
}

/**
 * Generic control bindings. Use when no specialized binding applies.
 * Returns `{ control, handleChange }`.
 */
export const getJsonFormsControl = (props: ControlProps) => {
  return useControl(props, mapStateToControlProps, mapDispatchToControlProps);
};
