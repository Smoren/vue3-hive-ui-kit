import { Ref } from 'vue';

export type Mount = (e: 'mount') => void;

export const onMount = (emit: Mount) => {
  emit('mount');
};

export type Unmount = (e: 'unmount') => void;

export const onUnmount = (emit: Unmount) => {
  emit('unmount');
};

export type Focusout = (e: 'focusout') => void;

export const onFocusout = (emit: Focusout) => {
  emit('focusout');
};

export type Focusin = (e: 'focusin') => void;

export const onFocusin = (emit: Focusin) => {
  emit('focusin');
};

export type Keydown = (e: 'keydown', event: KeyboardEvent) => void;

export const onKeydown = (emit: Keydown, event: KeyboardEvent) => {
  emit('keydown', event);
};

export type Update<T> = (e: 'update:modelValue', value: T) => void;

export const onUpdateModelValue = <T>(emit: Update<T>, value: Ref<T>) => {
  emit('update:modelValue', value.value);
};

export type Click = (e: 'click', event: MouseEvent) => void;

export const onClick = (emit: Click, event: MouseEvent) => {
  emit('click', event);
};
