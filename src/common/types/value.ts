import { defineComponent, Ref, VueElement } from 'vue';

export type VueComponent = VueElement | ReturnType<typeof defineComponent>;
export type Value = string | number | boolean | unknown | string[];

export type CurrentValue = Ref<Value>;
export type ActiveValue = Ref<Value | null>;
