import { computed, type ComputedRef, type Ref, ref } from "vue";

enum CompareMode {
  Exact,
  Substr,
}

type InputCollection<T> = T[] | Record<string, T>;
type FieldCollection<T> = T extends Record<string, unknown>
  ? Array<keyof T>
  : never[];
type QueryCollection<T> = Array<T>;

interface FilterConfig<T> {
  items: Ref<InputCollection<T>> | ComputedRef<InputCollection<T>>;
  query: Ref<QueryCollection<string>> | ComputedRef<QueryCollection<string>>;
  fields?: FieldCollection<T>;
  defaultCompareMode?: CompareMode;
  defaultInvert?: boolean;
  caseInsensitive?: boolean;
  onlyDistinctValues?: boolean;
}

interface FilterExport<T> {
  filtered: ComputedRef<InputCollection<T>>;
  compareMode: Ref<CompareMode>;
  invert: Ref<boolean>;
}

export { CompareMode };
export type { FilterConfig, FilterExport };

export default function useFilter<T>({
  items,
  query,
  fields = [] as FieldCollection<T>,
  defaultCompareMode = CompareMode.Substr,
  defaultInvert = false,
  caseInsensitive = false,
  onlyDistinctValues = false,
}: FilterConfig<T>): FilterExport<T> {
  const compareMode = ref(defaultCompareMode);
  const invert = ref(defaultInvert);

  const formatString = (input: string): string => {
    if (caseInsensitive) {
      return input.toLowerCase();
    }

    return input;
  };

  const comparator = (input: boolean): boolean => {
    if (invert.value) {
      return !input;
    }
    return input;
  };

  const compareStrings = (
    lhs: string,
    rhs: string,
    mode: CompareMode
  ): boolean => {
    switch (mode) {
      case CompareMode.Exact:
        return lhs === rhs;
      case CompareMode.Substr:
      default:
        return formatString(lhs).includes(rhs);
    }
  };

  const filtered = computed<InputCollection<T>>((): InputCollection<T> => {
    if (!query.value || !onlyDistinctValues) {
      return items.value;
    }

    const bufItems: (T | [string, T])[] =
      items.value instanceof Array
        ? [...items.value]
        : //@ts-ignore
          Object.entries(items.value);

    const filteredItems = bufItems.filter((item) => {
      const currentItem = item instanceof Array ? item[1] : item;
      let isFitting = false;

      for (const currentQuery of query.value) {
        if (!(currentItem instanceof Object)) {
          if (
            compareStrings(String(currentItem), currentQuery, compareMode.value)
          ) {
            isFitting = true;
            break;
          }
        }

        for (const field of fields) {
          if (
            compareStrings(
              String(currentItem[field]),
              currentQuery,
              compareMode.value
            )
          ) {
            isFitting = true;
            break;
          }
        }
      }

      return comparator(isFitting);
    });

    return items.value instanceof Array
      ? (filteredItems as T[])
      : (Object.fromEntries(filteredItems as [string, T][]) as Record<
          string,
          T
        >);
  });

  return {
    filtered,
    compareMode,
    invert,
  };
}
