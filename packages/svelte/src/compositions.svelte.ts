import {
  type CoreActions,
  type Dispatch,
  type JsonFormsState,
  type Layout,
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
  }) as unknown as Required<P & R> & { id?: string };

  // Expose derived via a getter so cross-module consumers preserve reactivity.
  // Using getter-based object instead of Proxy to ensure reliable reactivity
  // when accessed from a .svelte component's template, since Svelte's reactivity
  // tracks property reads through the getter on each access.
  const control = {
    get id() { return derived.id; },
  } as unknown as Required<P & R>;

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

import {
  mapStateToAllOfProps,
  mapStateToAnyOfProps,
  mapStateToControlWithDetailProps,
  mapStateToEnumControlProps,
  mapStateToOneOfEnumControlProps,
  mapStateToOneOfProps,
} from '@jsonforms/core';

/** Bindings for controls exposing a `detail` (e.g. array/object renderers). */
export const getJsonFormsControlWithDetail = (props: ControlProps) =>
  useControl(props, mapStateToControlWithDetailProps, mapDispatchToControlProps);

/** Bindings for `enum` schema controls. */
export const getJsonFormsEnumControl = (props: ControlProps) =>
  useControl(props, mapStateToEnumControlProps, mapDispatchToControlProps);

/** Bindings for `oneOf` enums (label-augmented enums). */
export const getJsonFormsOneOfEnumControl = (props: ControlProps) =>
  useControl(props, mapStateToOneOfEnumControlProps, mapDispatchToControlProps);

/** Bindings for `allOf` schema controls. */
export const getJsonFormsAllOfControl = (props: ControlProps) =>
  useControl(props, mapStateToAllOfProps, mapDispatchToControlProps);

/** Bindings for `anyOf` schema controls. */
export const getJsonFormsAnyOfControl = (props: ControlProps) =>
  useControl(props, mapStateToAnyOfProps, mapDispatchToControlProps);

/** Bindings for `oneOf` schema controls. */
export const getJsonFormsOneOfControl = (props: ControlProps) =>
  useControl(props, mapStateToOneOfProps, mapDispatchToControlProps);

import {
  mapDispatchToArrayControlProps,
  mapDispatchToMultiEnumProps,
  mapStateToArrayControlProps,
  mapStateToMultiEnumControlProps,
} from '@jsonforms/core';

/**
 * Explicit return type to avoid TS2732 caused by AJV's ErrorObject type.
 * Mirrors the Vue binding's `UseJsonFormsArrayControlReturnType` workaround.
 */
type ArrayControlReturn = {
  control: Required<ReturnType<typeof mapStateToArrayControlProps>>;
} & ReturnType<typeof mapDispatchToArrayControlProps>;

/** Bindings for array-schema controls (add/remove/move). */
export const getJsonFormsArrayControl: (props: ControlProps) => ArrayControlReturn =
  (props: ControlProps) =>
    useControl(
      props,
      mapStateToArrayControlProps,
      mapDispatchToArrayControlProps
    ) as unknown as ArrayControlReturn;

/** Bindings for multi-select enum (array-of-enum) controls. */
export const getJsonFormsMultiEnumControl = (props: ControlProps) =>
  useControl(
    props,
    mapStateToMultiEnumControlProps,
    mapDispatchToMultiEnumProps
  );

import {
  type Categorization,
  type LabelElement,
  type OwnPropsOfMasterListItem,
  type StatePropsOfJsonFormsRenderer,
  defaultMapStateToEnumCellProps,
  mapStateToArrayLayoutProps,
  mapStateToCellProps,
  mapStateToDispatchCellProps,
  mapStateToJsonFormsRendererProps,
  mapStateToLabelProps,
  mapStateToLayoutProps,
  mapStateToMasterListItemProps,
  mapStateToOneOfEnumCellProps,
} from '@jsonforms/core';
import type { LayoutProps, MasterListItemProps, RendererProps } from './types';

/** Bindings for layout elements (VerticalLayout, HorizontalLayout, Group, etc.). */
export const getJsonFormsLayout = (props: LayoutProps) => {
  const { control, ...other } = useControl(props, mapStateToLayoutProps);
  return { layout: control, ...other };
};

/** Bindings for array elements that render as a layout (not a control). */
export const getJsonFormsArrayLayout = (props: ControlProps) => {
  const { control, ...other } = useControl(props, mapStateToArrayLayoutProps);
  return { layout: control, ...other };
};

/** Bindings for Label elements. */
export const getJsonFormsLabel = (props: RendererProps<LabelElement>) => {
  const { control, ...other } = useControl(props, mapStateToLabelProps);
  return { label: control, ...other };
};

/** Bindings for master-list items in a master-detail array control. */
export const getJsonFormsMasterListItem = (props: MasterListItemProps) => {
  const { control, ...other } = useControl<
    Omit<OwnPropsOfMasterListItem, 'handleSelect' | 'removeItem'>,
    OwnPropsOfMasterListItem
  >(props as unknown as OwnPropsOfMasterListItem, mapStateToMasterListItemProps);
  return { item: control, ...other };
};

/** Bindings for cells (minimal inputs without error validation). */
export const getJsonFormsCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

export const getJsonFormsEnumCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    defaultMapStateToEnumCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

export const getJsonFormsOneOfEnumCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToOneOfEnumCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

export const getJsonFormsDispatchCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToDispatchCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Specialized bindings used by DispatchRenderer / DispatchCell to pick the
 * best-matching renderer from the registry. Returns `{ renderer, rootSchema }`
 * where both are reactive.
 */
export const getJsonFormsRenderer = (props: RendererProps) => {
  const { jsonforms } = requireJsonFormsContext();

  const raw = $derived(
    mapStateToJsonFormsRendererProps({ jsonforms }, props) as Required<StatePropsOfJsonFormsRenderer>
  );
  const rootSchema = $derived(raw.rootSchema);
  const renderer = $derived.by(() => {
    const { rootSchema: _root, ...rest } = raw;
    return rest;
  });

  return {
    get renderer() {
      return renderer;
    },
    get rootSchema() {
      return rootSchema;
    },
  };
};

/**
 * Bindings for Categorization elements. Returns the usual `layout` plus a
 * `categories` array where each entry is a sub-layout binding for one category.
 */
export const getJsonFormsCategorization = (props: LayoutProps) => {
  const { layout, ...other } = getJsonFormsLayout(props);

  const categories = (layout.uischema as Categorization).elements.map(
    (category) => {
      const categoryProps: LayoutProps = {
        ...props,
        uischema: category as Layout,
      };
      return getJsonFormsLayout(categoryProps).layout;
    }
  );

  return { layout, categories, ...other };
};
