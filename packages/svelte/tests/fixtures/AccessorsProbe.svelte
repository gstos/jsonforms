<script lang="ts">
  import { getTranslator, getAjv } from '../../src/context.svelte';

  // Registered as a JsonForms renderer so it renders as a real descendant
  // of <JsonForms> and can exercise getTranslator()/getAjv() against the
  // live context that JsonForms.svelte sets up.
  let { schema: _schema, uischema: _uischema, path: _path } = $props();

  const translate = getTranslator();
  const translated = translate('foo', 'default');

  const ajv = getAjv();
</script>

<span data-testid="translated">{translated}</span>
<span data-testid="ajv-validate-type">{typeof ajv?.validate}</span>
