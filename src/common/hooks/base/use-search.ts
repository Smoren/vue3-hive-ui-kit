import { computed, type ComputedRef, type Ref, ref } from 'vue';
import useAllowedRef from './use-allowed-ref';

type InputCollection<T> = T[] | Record<string, T>;
type FieldCollection<T> = T extends Record<string, unknown> ? Array<keyof T> : never[];
type ItemsType<T> = Ref<InputCollection<T>> | ComputedRef<InputCollection<T>>;

interface SearchConfig<T> {
  items: ItemsType<T>;
  fields?: FieldCollection<T>;
  defaultQuery?: string;
  caseInsensitive?: boolean;
  minQueryLength?: number;
}

interface SearchExport<T> {
  filtered: ComputedRef<InputCollection<T>>;
  query: Ref<string>;
  isChangeAllowed: Ref<boolean>;
}

export type { SearchConfig, SearchExport, InputCollection };

export default function useSearch<T>({
  items,
  fields = [] as FieldCollection<T>,
  defaultQuery = '',
  caseInsensitive = false,
  minQueryLength = 0,
}: SearchConfig<T>): SearchExport<T> {
  const isChangeAllowed = ref(true);

  const query = useAllowedRef(defaultQuery, isChangeAllowed);

  const formatString = (input: string): string => {
    if (caseInsensitive) {
      return input.toLowerCase();
    }

    return input;
  };

  const filtered = computed<InputCollection<T>>((): InputCollection<T> => {
    if (query.value.length < minQueryLength) {
      return [];
    }

    if (!query.value) {
      return items.value;
    }

    const currentQuery = formatString(query.value);

    const bufItems: (T | [string, T])[] = items.value instanceof Array ? [...items.value] : Object.entries(items.value);

    const filteredItems = bufItems.filter((item) => {
      const currentItem = item instanceof Array ? item[1] : item;
      if (!(currentItem instanceof Object)) {
        return formatString(String(currentItem)).includes(currentQuery);
      }

      for (const field of fields) {
        if (formatString(String(currentItem[field])).includes(currentQuery)) {
          return true;
        }
      }

      return false;
    });

    return items.value instanceof Array
      ? (filteredItems as T[])
      : (Object.fromEntries(filteredItems as [string, T][]) as Record<string, T>);
  });

  return {
    filtered,
    query,
    isChangeAllowed,
  };
}
