import { Ref } from 'vue';

export type focusout = (e: 'focusout') => void;

export const emitFocusout = (emit: focusout) => {
  emit('focusout');
};

export type focusin = (e: 'focusin') => void;

export const emitFocusin = (emit: focusin) => {
  emit('focusin');
};

export type keydown = (e: 'keydown') => void;

export const emitKeydown = (emit: keydown) => {
  emit('keydown');
};

export type update<T> = (e: 'update:modelValue', value: T) => void;

export const emitUpdateModelValue = <T>(emit: update<T>, value: Ref<T>) => {
  emit('update:modelValue', value.value);
};
