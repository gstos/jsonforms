<script lang="ts">
  import { getJsonFormsControl, type ControlProps } from '../../src';

  let props: ControlProps = $props();
  const { control, handleChange } = getJsonFormsControl(props);

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    handleChange(control.path, target.value);
  }
</script>

<input data-testid="name" value={control.data ?? ''} oninput={onInput} />
