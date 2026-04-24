import { verticalLayoutRendererEntry } from './VerticalLayoutRenderer';
import { horizontalLayoutRendererEntry } from './HorizontalLayoutRenderer';
import { groupRendererEntry } from './GroupRenderer';
import { categorizationRendererEntry } from './CategorizationRenderer';

export const layoutRenderers = [
  verticalLayoutRendererEntry,
  horizontalLayoutRendererEntry,
  groupRendererEntry,
  categorizationRendererEntry,
];
