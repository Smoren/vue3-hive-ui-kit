import type { defineComponent, VueElement } from 'vue';

type VueComponent = VueElement | ReturnType<typeof defineComponent>;
type ValueType = string | number | boolean | unknown | string[];

export type { VueComponent, ValueType };
