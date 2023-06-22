import { Ref } from 'vue';

export const onClick = (emit: Click, event: MouseEvent) => {
  emit('click', event);
};

export type Click = (e: 'click', event: MouseEvent) => void;


export const onUpdateModelValue = <T>(emit: Update<T>, value: Ref<T>) => {
  emit('update:modelValue', value.value);
};

export type Update<T> = (e: 'update:modelValue', value: T) => void;
