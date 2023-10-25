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

export type FileAdd = (e: 'onFileAdd') => void;

export const onFileAdd = <T>(emit: FileAdd) => {
  emit('onFileAdd');
};
export type FileRemove = (e: 'onFileRemove') => void;

export const onFileRemove = <T>(emit: FileRemove) => {
  emit('onFileRemove');
};

export type Close = (e: 'close') => void;

export const onClose = (emit: Close) => {
  emit('close');
};

export type BeforeEdit = (e: 'beforeEdit') => void;

export const onBeforeEdit = (emit: BeforeEdit) => {
  emit('beforeEdit');
};

export type AfterEdit = (e: 'afterEdit') => void;

export const onAfterEdit = (emit: AfterEdit) => {
  emit('afterEdit');
};

export type BeforeChange = (e: 'beforeChange') => void;

export const onBeforeChange = (emit: BeforeChange) => {
  emit('beforeChange');
};

export type AfterChange = (e: 'afterChange') => void;

export const onAfterChange = (emit: AfterChange) => {
  emit('afterChange');
};

export type Updated = (e: 'updated') => void;

export const onUpdated = (emit: Updated) => {
  emit('updated');
};

export type Sort = (e: 'sort', value: string) => void;

export const onSort = (emit: Sort, value: string) => {
  emit('sort', value);
};

export type QueryUpdate = (e: 'queryUpdate', value: string) => void;

export const onQueryUpdate = (emit: QueryUpdate, value: string) => {
  emit('queryUpdate', value);
};

export type RowClick = (e: 'rowClick', row: Record<string, unknown>) => void;

export const onRowClick = (emit: RowClick, row: Record<string, unknown>) => {
  emit('rowClick', row);
};
