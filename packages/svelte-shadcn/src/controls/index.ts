import { stringControlRendererEntry } from './StringControlRenderer';
import { numberControlRendererEntry } from './NumberControlRenderer';
import { integerControlRendererEntry } from './IntegerControlRenderer';
import { booleanControlRendererEntry } from './BooleanControlRenderer';
import { enumControlRendererEntry } from './EnumControlRenderer';
import { oneOfEnumControlRendererEntry } from './OneOfEnumControlRenderer';
import { multiStringControlRendererEntry } from './MultiStringControlRenderer';
import { dateControlRendererEntry } from './DateControlRenderer';
import { dateTimeControlRendererEntry } from './DateTimeControlRenderer';
import { sliderControlRendererEntry } from './SliderControlRenderer';

export const controlRenderers = [
  stringControlRendererEntry,
  numberControlRendererEntry,
  integerControlRendererEntry,
  booleanControlRendererEntry,
  enumControlRendererEntry,
  oneOfEnumControlRendererEntry,
  multiStringControlRendererEntry,
  dateControlRendererEntry,
  dateTimeControlRendererEntry,
  sliderControlRendererEntry,
];
