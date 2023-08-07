import { ComputedRef } from 'vue';

export type Value = string | number | null;

export type Option = {
  [key: string]: Value
};

export type OptionsRef = ComputedRef<Option[] | undefined>
