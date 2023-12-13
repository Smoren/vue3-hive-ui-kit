import type { Ref } from 'vue';

export type Value = string | number | boolean | null | undefined;

export type CurrentOptions = {
  [x: string]: Value | Value[];
  prev: string | null;
  next: string | null;
};

export type CurrentOptionsRef = Ref<CurrentOptions | undefined>;
