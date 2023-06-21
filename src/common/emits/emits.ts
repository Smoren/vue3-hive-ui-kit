import { Ref } from 'vue';

export type mount = (e: 'mount') => void;

export const emitMount = (emit: mount) => {
  emit('mount');
};

export type unmount = (e: 'unmount') => void;

export const emitUnmount = (emit: unmount) => {
  emit('unmount');
};

export type focusout = (e: 'focusout') => void;

export const emitFocusout = (emit: focusout) => {
  emit('focusout');
};

export type focusin = (e: 'focusin') => void;

export const emitFocusin = (emit: focusin) => {
  emit('focusin');
};

export type keydown = (e: 'keydown', event: KeyboardEvent) => void;

export const emitKeydown = (emit: keydown, event: KeyboardEvent) => {
  emit('keydown', event);
};

export type update<T> = (e: 'update:modelValue', value: T) => void;

export const emitUpdateModelValue = <T>(emit: update<T>, value: Ref<T>) => {
  emit('update:modelValue', value.value);
};
