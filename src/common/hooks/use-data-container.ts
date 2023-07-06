import { computed, type ComputedRef, type Ref } from 'vue';
import { DataContainer, DataContainerNode, DataContainerNodeWithRaw } from '../types/data-container';

type DataType<T> = Array<T> | Record<string, T>;
type DataRefType<T> = Ref<DataType<T>> | ComputedRef<DataType<T>>;
type DataItemKey = string | number;

interface DataContainerConfig<T> {
  data: DataRefType<T>;
  valueField?: string;
  titleField?: string;
}

const UNKNOWN_KEY = '';

function createUnknownNode(): DataContainerNode<null> {
  return {
    key: UNKNOWN_KEY,
    value: null,
    title: '',
    visible: false,
    raw: null,
    prev: null,
    next: null,
  };
}

export { createUnknownNode, UNKNOWN_KEY };

export default function useDataContainer<T>({
  data,
  valueField,
  titleField = 'title',
}: DataContainerConfig<T>): ComputedRef<DataContainer<T>> {
  const getValue = (item: T, key: DataItemKey): unknown => {
    if (valueField !== undefined && typeof item === 'object') {
      const value = (item as Record<string, unknown>)[valueField];
      return value === undefined ? (item as Record<string, unknown>).value : value;
    }
    if (data.value instanceof Array) {
      return item;
    }
    return key;
  };

  const getKey = (item: T, key: DataItemKey): string => String(getValue(item, key));

  const getTitle = (item: T): string => {
    if (item instanceof Object) {
      if (titleField !== undefined) {
        const title = (item as Record<string, unknown>)[titleField];
        return title === undefined ? String((item as Record<string, unknown>).title) : String(title);
      }
      throw new Error('use title-field option please');
    }
    return String(item);
  };

  return computed<DataContainer<T>>((): DataContainer<T> => {
    const result: DataContainer<T> = {};

    let prev: DataContainerNode<T> | null = null;

    if (data.value) {
      for (const [key, value] of Object.entries(data.value)) {
        const dataKey = getKey(value, key);
        const current: DataContainerNodeWithRaw<T> = {
          key: dataKey,
          value: getValue(value, key),
          title: getTitle(value),
          visible: false,
          raw: value,
          prev,
          next: null,
        };

        if (prev !== null) {
          prev.next = current as DataContainerNode<T>;
        }

        result[dataKey] = current as DataContainerNode<T>;
        prev = current as DataContainerNode<T>;
      }
    }

    return result;
  });
}
