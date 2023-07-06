import { ComputedRef } from 'vue';
import { DataContainer } from './data-container';

export type Option = string | number | Record<string, unknown>;
export type Options = Array<Option> | Record<string, Option>;
export type FilteredOptions = ComputedRef<DataContainer<Option>>;
