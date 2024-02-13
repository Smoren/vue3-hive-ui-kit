import { ContextMenuItem } from '@/components/hive-context-menu/types';
import { VueComponent } from '../types/value';
import { ComponentPublicInstance } from 'vue';

export type Mount = (e: 'mount') => void;

export const onMount = (emit: Mount & Event) => {
  emit('mount');
  onEvent(emit, { event: 'mount' });
};

export type Unmount = (e: 'unmount') => void;

export const onUnmount = (emit: Unmount & Event) => {
  emit('unmount');
  onEvent(emit, { event: 'unmount' });
};

export type Focusout = (e: 'focusout') => void;

export const onFocusout = (emit: Focusout & Event) => {
  emit('focusout');
  onEvent(emit, { event: 'focusout' });
};

export type Focusin = (e: 'focusin') => void;

export const onFocusin = (emit: Focusin & Event) => {
  emit('focusin');
  onEvent(emit, { event: 'focusin' });
};

export type Keydown = (e: 'keydown', event: KeyboardEvent) => void;

export const onKeydown = (emit: Keydown & Event, event: KeyboardEvent) => {
  emit('keydown', event);
  onEvent(emit, { event: 'keydown', ...event });
};

export type Change<T> = (e: 'change', value: T) => void;

export const onChange = <T>(emit: Change<T> & Event, value: T) => {
  emit('change', value);
  onEvent(emit, { event: 'change', ...value });
};

export type ModelValueUpdated<T> = (e: 'model-value-updated', value: T) => void;

export type Update<T> = ((e: 'update:modelValue', value: T) => void) & ModelValueUpdated<T>;

export const onUpdateModelValue = <T>(emit: Update<T> & Event, value: T) => {
  emit('update:modelValue', value);
  emit('model-value-updated', value);
  onEvent(emit, { event: 'model-value-updated', ...value });
};

export type Click = (e: 'click', event: MouseEvent) => void;

export const onClick = (emit: Click & Event, event: MouseEvent) => {
  emit('click', event);
  onEvent(emit, { event: 'click', ...event });
};

export type Search<T> = (e: 'search', query: T) => void;

export const onSearch = <T>(emit: Search<T> & Event, query: T) => {
  emit('search', query);
  onEvent(emit, { event: 'search', ...query });
};

export type Input<T> = (e: 'input', value: T) => void;

export const onInput = <T>(emit: Input<T> & Event, value: T) => {
  emit('input', value);
  onEvent(emit, { event: 'input', ...value });
};

export type FileAdd = (e: 'fileAdd') => void;

export const onFileAdd = (emit: FileAdd & Event) => {
  emit('fileAdd');
  onEvent(emit, { event: 'fileAdd' });
};

export type FileRemove = (e: 'fileRemove') => void;

export const onFileRemove = (emit: FileRemove & Event) => {
  emit('fileRemove');
  onEvent(emit, { event: 'fileRemove' });
};

export type Close = (e: 'close') => void;

export const onClose = (emit: Close & Event) => {
  emit('close');
  onEvent(emit, { event: 'close' });
};

export type BeforeEdit = (e: 'beforeEdit', value: unknown) => void;

export const onBeforeEdit = (emit: BeforeEdit & Event, value: unknown) => {
  emit('beforeEdit', value);
  onEvent(emit, { event: 'beforeEdit', value });
};

export type AfterEdit = (e: 'afterEdit', value: unknown) => void;

export const onAfterEdit = (emit: AfterEdit & Event, value: unknown) => {
  emit('afterEdit', value);
  onEvent(emit, { event: 'afterEdit', value });
};

export type BeforeChange = (e: 'beforeChange', value: unknown) => void;

export const onBeforeChange = (emit: BeforeChange & Event, value: unknown) => {
  emit('beforeChange', value);
  onEvent(emit, { event: 'beforeChange', value });
};

export type AfterChange = (e: 'afterChange', value: unknown) => void;

export const onAfterChange = (emit: AfterChange & Event, value: unknown) => {
  emit('afterChange', value);
  onEvent(emit, { event: 'afterChange', value });
};

export type Updated = (e: 'updated') => void;

export const onUpdated = (emit: Updated & Event) => {
  emit('updated');
  onEvent(emit, { event: 'updated' });
};

export type Sort = (e: 'sort', value: string) => void;

export const onSort = (emit: Sort & Event, value: string) => {
  emit('sort', value);
  onEvent(emit, { event: 'sort', value });
};

export type QueryUpdate = (e: 'queryUpdate', value: string) => void;

export const onQueryUpdate = (emit: QueryUpdate & Event, value: string) => {
  emit('queryUpdate', value);
  onEvent(emit, { event: 'queryUpdate', value });
};

export type RowClick<T = ComponentPublicInstance> = (
  e: 'rowClick',
  row: Record<string, unknown>,
  rowRef: VueComponent<T> | null,
) => void;

export const onRowClick = <T = ComponentPublicInstance>(
  emit: RowClick<T> & Event,
  row: Record<string, unknown>,
  rowRef: VueComponent<T> | null,
) => {
  emit('rowClick', row, rowRef);
  onEvent(emit, { event: 'rowClick', row, rowRef });
};

export type DragStart<T> = (e: 'dragStart', value: T) => void;

export const onDragStart = <T>(emit: DragStart<T> & Event, value: T) => {
  emit('dragStart', value);
  onEvent(emit, { event: 'dragStart', value });
};

export type DragEnd<T> = (e: 'dragEnd', value: T) => void;

export const onDragEnd = <T>(emit: DragEnd<T> & Event, value: T) => {
  emit('dragEnd', value);
  onEvent(emit, { event: 'dragEnd', value });
};

export type NodeChoose<T> = (e: 'nodeChoose', value: T) => void;

export const onNodeChoose = <T>(emit: NodeChoose<T> & Event, value: T) => {
  emit('nodeChoose', value);
  onEvent(emit, { event: 'nodeChoose', value });
};

export type NodeCheck<T> = (e: 'nodeCheck', value: T, check: boolean) => void;

export const onNodeCheck = <T>(emit: NodeCheck<T> & Event, value: T, check: boolean) => {
  emit('nodeCheck', value, check);
  onEvent(emit, { event: 'nodeCheck', value, check });
};

export type NodeMounted<T> = (e: 'nodeMounted', value: T) => void;

export const onNodeMounted = <T>(emit: NodeMounted<T> & Event, value: T) => {
  emit('nodeMounted', value);
  onEvent(emit, { event: 'nodeMounted', value });
};

export type UpdateCheckedNodes<T> = (e: 'updateCheckedNodes', value: T) => void;

export const onUpdateCheckedNodes = <T>(emit: UpdateCheckedNodes<T> & Event, value: T) => {
  emit('updateCheckedNodes', value);
  onEvent(emit, { event: 'updateCheckedNodes', value });
};

export type ChildrenShow = (e: 'childrenShow', id: string, show: boolean) => void;

export const onChildrenShow = (emit: ChildrenShow & Event, id: string, show: boolean) => {
  emit('childrenShow', id, show);
  onEvent(emit, { event: 'childrenShow', id, show });
};

export type CloseContextMenu = (e: 'closeContextMenu') => void;

export const onCloseContextMenu = (emit: CloseContextMenu & Event) => {
  emit('closeContextMenu');
  onEvent(emit, { event: 'closeContextMenu' });
};

export type ContextItemClick = (e: 'contextItemClick', item: ContextMenuItem) => void;

export const onContextItemClick = (emit: ContextItemClick & Event, item: ContextMenuItem) => {
  emit('contextItemClick', item);
  onEvent(emit, { event: 'contextItemClick', item });
};

export type UpdatePage = (e: 'update:page', page: number) => void;

export const onUpdatePage = (emit: UpdatePage & Event, page: number) => {
  emit('update:page', page);
  onEvent(emit, { event: 'update-page', page });
};

export type Event = (e: 'event', value: Record<string, unknown | Record<string, unknown>>) => void;

export const onEvent = (emit: Event, value: Record<string, unknown>) => {
  emit('event', value);
};
