import type { defineComponent, Ref, VueElement } from 'vue';

type VueComponent = VueElement | ReturnType<typeof defineComponent>;
type Value = string | number | boolean | unknown | string[];

type CurrentValue = Ref<Value>;
type ActiveValue = Ref<Value | null>;

export type { VueComponent, Value, CurrentValue, ActiveValue };
