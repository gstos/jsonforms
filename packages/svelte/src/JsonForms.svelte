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
  const generatorData = isObject(data) ? data : {};
  const schemaToUse: JsonSchema = schema ?? Generate.jsonSchema(generatorData);
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
      jsonforms.core as JsonFormsCore,
      action,
      coreReducer
    );
  }

  setJsonFormsContext({ jsonforms, dispatch });
</script>

<DispatchRenderer
  schema={jsonforms.core!.schema}
  uischema={jsonforms.core!.uischema}
  path=""
/>
