import type {
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';

export interface MountFormArgs {
  schema: JsonSchema;
  uischema?: UISchemaElement;
  data?: unknown;
  renderers: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

/** Re-export for convenience so test files don't need to know import paths. */
export { JsonForms } from '@jsonforms/svelte';
