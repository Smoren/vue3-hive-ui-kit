import type { defineComponent, VueElement } from 'vue';

type VueComponent = VueElement | ReturnType<typeof defineComponent>;
type Value = string | number | boolean | unknown | string[];

export type { VueComponent, Value };
