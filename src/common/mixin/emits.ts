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

export type Change<T> = (e: 'change', value: T) => void;

export const onChange = <T>(emit: Change<T>, value: T) => {
  emit('change', value);
};

export type ModelValueUpdated<T> = (e: 'model-value-updated', value: T) => void;

export type Update<T> = ((e: 'update:modelValue', value: T) => void) & ModelValueUpdated<T>;

export const onUpdateModelValue = <T>(emit: Update<T>, value: T) => {
  emit('update:modelValue', value);
  emit('model-value-updated', value);
};

export type Click = (e: 'click', event: MouseEvent) => void;

export const onClick = (emit: Click, event: MouseEvent) => {
  emit('click', event);
};

export type Search<T> = (e: 'search', query: T) => void;

export const onSearch = <T>(emit: Search<T>, query: T) => {
  emit('search', query);
};

export type Input<T> = (e: 'input', value: T) => void;

export const onInput = <T>(emit: Input<T>, value: T) => {
  emit('input', value);
};
