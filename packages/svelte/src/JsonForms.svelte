<script lang="ts">
  import type Ajv from 'ajv';
  import type { ErrorObject } from 'ajv';
  import {
    Actions,
    Generate,
    coreReducer,
    configReducer,
    i18nReducer,
    defaultMiddleware,
    type CoreActions,
    type JsonFormsCellRendererRegistryEntry,
    type JsonFormsCore,
    type JsonFormsI18nState,
    type JsonFormsRendererRegistryEntry,
    type JsonFormsSubStates,
    type JsonFormsUISchemaRegistryEntry,
    type JsonSchema,
    type Middleware,
    type UISchemaElement,
    type ValidationMode,
  } from '@jsonforms/core';
  import { untrack } from 'svelte';
  import { setJsonFormsContext } from './context.svelte';
  import DispatchRenderer from './DispatchRenderer.svelte';
  import type { JsonFormsChangeEvent, MaybeReadonly } from './types';

  const isObject = (elem: unknown): elem is object =>
    !!elem && typeof elem === 'object';

  let {
    data,
    schema,
    uischema,
    renderers,
    cells = [],
    config,
    readonly = false,
    uischemas = [],
    validationMode = 'ValidateAndShow',
    ajv,
    i18n,
    additionalErrors = [],
    middleware = defaultMiddleware,
    onchange,
  } = $props<{
    data?: unknown;
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    renderers: MaybeReadonly<JsonFormsRendererRegistryEntry[]>;
    cells?: MaybeReadonly<JsonFormsCellRendererRegistryEntry[]>;
    config?: unknown;
    readonly?: boolean;
    uischemas?: MaybeReadonly<JsonFormsUISchemaRegistryEntry[]>;
    validationMode?: ValidationMode;
    ajv?: Ajv;
    i18n?: JsonFormsI18nState;
    additionalErrors?: ErrorObject[];
    middleware?: Middleware;
    onchange?: (event: JsonFormsChangeEvent) => void;
  }>();

  // --- Initial schema / uischema resolution ---
  const initGeneratorData = isObject(data) ? data : {};
  const schemaToUse: JsonSchema = schema ?? Generate.jsonSchema(initGeneratorData);
  const uischemaToUse: UISchemaElement =
    uischema ?? Generate.uiSchema(schemaToUse, undefined, undefined, schemaToUse);

  // --- Initial core state via middleware ---
  const initialCore = middleware(
    { data, schema: schemaToUse, uischema: uischemaToUse },
    Actions.init(data, schemaToUse, uischemaToUse, {
      validationMode,
      ajv,
      additionalErrors,
    }),
    coreReducer
  );

  // --- Full JsonFormsSubStates held as $state ---
  let jsonforms = $state<JsonFormsSubStates>({
    core: initialCore,
    config: configReducer(undefined, Actions.setConfig(config)),
    i18n: i18nReducer(
      i18n,
      Actions.updateI18n(i18n?.locale, i18n?.translate, i18n?.translateError)
    ),
    renderers: renderers as JsonFormsRendererRegistryEntry[],
    cells: cells as JsonFormsCellRendererRegistryEntry[],
    uischemas: uischemas as JsonFormsUISchemaRegistryEntry[],
    readonly,
  });

  function dispatch(action: CoreActions) {
    jsonforms.core = middleware(
      untrack(() => jsonforms.core as JsonFormsCore),
      action,
      coreReducer
    );
  }

  setJsonFormsContext({ jsonforms, dispatch });

  // --- Reactive prop updates ---

  // renderers / cells / uischemas / readonly → assign directly into the state.
  $effect(() => {
    jsonforms.renderers = renderers as JsonFormsRendererRegistryEntry[];
  });
  $effect(() => {
    jsonforms.cells = cells as JsonFormsCellRendererRegistryEntry[];
  });
  $effect(() => {
    jsonforms.uischemas = uischemas as JsonFormsUISchemaRegistryEntry[];
  });
  $effect(() => {
    jsonforms.readonly = readonly;
  });

  // config changes → reinitialize config slice.
  $effect(() => {
    jsonforms.config = configReducer(undefined, Actions.setConfig(config));
  });

  // i18n changes → reinitialize i18n slice.
  // Use untrack to read current i18n without creating a circular dependency.
  $effect(() => {
    // Track only the incoming i18n prop; read current state via untrack.
    const newI18n = i18n;
    jsonforms.i18n = i18nReducer(
      untrack(() => jsonforms.i18n),
      Actions.updateI18n(newI18n?.locale, newI18n?.translate, newI18n?.translateError)
    );
  });

  // schema + uischema + data + validationMode + ajv + additionalErrors → updateCore.
  // Derive the resolved schema/uischema reactively, then apply updateCore.
  // Use untrack when reading jsonforms.core to avoid circular dependency.
  $effect(() => {
    const generatorData = isObject(data) ? data : {};
    const newSchema = schema ?? Generate.jsonSchema(generatorData);
    const newUischema =
      uischema ??
      Generate.uiSchema(newSchema, undefined, undefined, newSchema);

    jsonforms.core = middleware(
      untrack(() => jsonforms.core as JsonFormsCore),
      Actions.updateCore(data, newSchema, newUischema, {
        validationMode,
        ajv,
        additionalErrors,
      }),
      coreReducer
    );
  });

  // onchange: fires on mount (first effect run) and on every subsequent
  // change to core.data or core.errors.
  $effect(() => {
    const event: JsonFormsChangeEvent = {
      data: jsonforms.core!.data,
      errors: jsonforms.core!.errors ?? [],
    };
    onchange?.(event);
  });
</script>

<DispatchRenderer
  schema={jsonforms.core!.schema}
  uischema={jsonforms.core!.uischema}
  path=""
/>
