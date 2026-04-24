import type {
  ControlElement,
  CoreActions,
  Dispatch,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsCore,
  JsonFormsRendererRegistryEntry,
  JsonFormsSubStates,
  JsonSchema,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';

export interface InjectJsonFormsState {
  jsonforms: JsonFormsSubStates;
}

export interface InjectJsonFormsDispatch {
  dispatch: Dispatch<CoreActions>;
}

export type JsonFormsChangeEvent = Pick<JsonFormsCore, 'data' | 'errors'>;

export type MaybeReadonly<T> = T | Readonly<T>;

/**
 * Props shared by all renderer components. Svelte components should
 * destructure these via `$props()` in their script block.
 */
export interface RendererProps<U = UISchemaElement> {
  schema: JsonSchema;
  uischema: U;
  path: string;
  enabled?: boolean;
  readonly?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  config?: unknown;
}

export interface ControlProps extends RendererProps {
  uischema: ControlElement;
}

export interface LayoutProps extends RendererProps {
  uischema: Layout;
}

/**
 * Props for a master-list item renderer (used inside array-master-detail setups).
 * Equivalent to Vue's `OwnPropsOfMasterListItem`.
 */
export interface MasterListItemProps {
  index: number;
  selected: boolean;
  path: string;
  schema: JsonSchema;
  handleSelect?: (index: number) => void;
  removeItem?: (path: string, value: number) => void;
}

/**
 * Utility: makes every property of T non-optional and non-null.
 * Used to describe the shape of the merged `control` / `layout` objects
 * returned by the composition functions.
 */
export type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;
