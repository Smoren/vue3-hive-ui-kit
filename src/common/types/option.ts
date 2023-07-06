import type { ComputedRef } from 'vue';
import { DataContainer } from './data-container';

type Option = string | number | Record<string, unknown>;
type Options = Array<Option> | Record<string, Option>;
type FilteredOptions = ComputedRef<DataContainer<Option>>;

export type { Option, Options, FilteredOptions };
