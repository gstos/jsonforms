import { controlRenderers } from './controls';
import { layoutRenderers } from './layouts';
import { complexRenderers } from './complex';
import { arrayRenderers } from './array';
import { labelRenderers } from './labels';

export const shadcnRenderers = [
  ...controlRenderers,
  ...layoutRenderers,
  ...complexRenderers,
  ...arrayRenderers,
  ...labelRenderers,
];
