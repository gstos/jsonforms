import { objectRendererEntry } from './ObjectRenderer';
import { oneOfRendererEntry } from './OneOfRenderer';
import { anyOfRendererEntry } from './AnyOfRenderer';
import { allOfRendererEntry } from './AllOfRenderer';
import { enumArrayRendererEntry } from './EnumArrayRenderer';

export const complexRenderers = [
  objectRendererEntry,
  oneOfRendererEntry,
  anyOfRendererEntry,
  allOfRendererEntry,
  enumArrayRendererEntry,
];
