import { Ref } from 'vue';

export type Value = string | number | null | undefined;

export type Option = string | number | Record<string, unknown>;
export type Options = Array<Option> | Record<string, Option>;

export type CurrentOptions = {
  [x: string]: Value;
  prev: string | null;
  next: string | null;
};

export type CurrentOptionsRef = Ref<CurrentOptions | undefined>;
