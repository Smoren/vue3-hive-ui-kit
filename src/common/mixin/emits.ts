import { Ref } from 'vue';

export type Click = (e: 'click', event: MouseEvent) => void;

export const onClick = (emit: Click, event: MouseEvent) => {
  emit('click', event);
};

export type Update<T> = (e: 'update:modelValue', value: T) => void;

export const onUpdateModelValue = <T>(emit: Update<T>, value: Ref<T>) => {
  emit('update:modelValue', value.value);
};
