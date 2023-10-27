import { VueComponent } from '../types/value';

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

export const onFileAdd = (emit: FileAdd) => {
  emit('onFileAdd');
};
export type FileRemove = (e: 'onFileRemove') => void;

export const onFileRemove = (emit: FileRemove) => {
  emit('onFileRemove');
};

export type Close = (e: 'close') => void;

export const onClose = (emit: Close) => {
  emit('close');
};

export type BeforeEdit = (e: 'beforeEdit', value: unknown) => void;

export const onBeforeEdit = (emit: BeforeEdit, value: unknown) => {
  emit('beforeEdit', value);
};

export type AfterEdit = (e: 'afterEdit', value: unknown) => void;

export const onAfterEdit = (emit: AfterEdit, value: unknown) => {
  emit('afterEdit', value);
};

export type BeforeChange = (e: 'beforeChange', value: unknown) => void;

export const onBeforeChange = (emit: BeforeChange, value: unknown) => {
  emit('beforeChange', value);
};

export type AfterChange = (e: 'afterChange', value: unknown) => void;

export const onAfterChange = (emit: AfterChange, value: unknown) => {
  emit('afterChange', value);
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

export type RowClick = (e: 'rowClick', row: Record<string, unknown>, rowRef: VueComponent | null) => void;

export const onRowClick = (emit: RowClick, row: Record<string, unknown>, rowRef: VueComponent | null) => {
  emit('rowClick', row, rowRef);
};

export type DragStart<T> = (e: 'dragStart', value: T) => void;

export const onDragStart = <T>(emit: DragStart<T>, value: T) => {
  emit('dragStart', value);
};

export type DragEnd<T> = (e: 'dragEnd', value: T) => void;

export const onDragEnd = <T>(emit: DragEnd<T>, value: T) => {
  emit('dragEnd', value);
};

export type NodeChoose<T> = (e: 'nodeChoose', value: T) => void;

export const onNodeChoose = <T>(emit: NodeChoose<T>, value: T) => {
  emit('nodeChoose', value);
};

export type NodeCheck<T> = (e: 'nodeCheck', value: T, check: boolean) => void;

export const onNodeCheck = <T>(emit: NodeCheck<T>, value: T, check: boolean) => {
  emit('nodeCheck', value, check);
};

export type NodeMounted<T> = (e: 'nodeMounted', value: T) => void;

export const onNodeMounted = <T>(emit: NodeMounted<T>, value: T) => {
  emit('nodeMounted', value);
};

export type UpdateCheckedNodes<T> = (e: 'updateCheckedNodes', value: T) => void;

export const onUpdateCheckedNodes = <T>(emit: UpdateCheckedNodes<T>, value: T) => {
  emit('updateCheckedNodes', value);
};

export type ChildrenShow = (e: 'childrenShow', id: string, show: boolean) => void;

export const onChildrenShow = (emit: ChildrenShow, id: string, show: boolean) => {
  emit('childrenShow', id, show);
};
