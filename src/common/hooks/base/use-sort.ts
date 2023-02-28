import { computed, type ComputedRef, type Ref, ref, watch } from 'vue';

type ComparatorCallback<T> = (lhs: T, rhs: T) => number;
type Comparator<T> = 'number' | 'string' | ComparatorCallback<T>;
type SortOrder = 'asc' | 'desc';

interface SortField<T> {
  title: string;
  field: keyof T | null;
  comparator: Comparator<T>;
}

interface SortFieldMap<T> {
  [key: string]: SortField<T>;
}

interface SortOrderMap {
  asc: string;
  desc: string;
}

interface SortConfig<T> {
  items: Ref<T[]> | ComputedRef<T[]>;
  fields: SortFieldMap<T>;
  orders?: SortOrderMap;
  defaultOrder?: SortOrder;
  defaultFieldName?: string;
}

interface SortExport<T> {
  sorted: ComputedRef<T[]>;
  fields: SortFieldMap<T>;
  orders: SortOrderMap;
  currentFieldName: Ref<string>;
  currentOrder: Ref<SortOrder>;
}

interface SortExportReactive<T> {
  sorted: ComputedRef<T[]>;
  fields: SortFieldMap<T>;
  orders: SortOrderMap;
  currentFieldName: string;
  currentOrder: SortOrder;
}

export type { SortConfig, SortExport, SortExportReactive };

export default function useSort<T>({
  items,
  fields,
  orders = {
    asc: 'Ascending',
    desc: 'Descending',
  },
  defaultOrder = 'asc',
  defaultFieldName = 'default',
}: SortConfig<T>): SortExport<T> {
  const currentFieldName: Ref<string> = ref(defaultFieldName);
  const currentField: Ref<SortField<T>> = ref(fields[defaultFieldName]) as Ref<
    SortField<T>
  >;
  const currentOrder: Ref<SortOrder> = ref(defaultOrder);
  const updateCurrentField = (): void => {
    currentField.value = fields[currentFieldName.value];
  };

  watch(currentFieldName, updateCurrentField);

  const sorted = computed<T[]>((): T[] => {
    if (
      currentField.value.field === null &&
      currentField.value.comparator instanceof String
    ) {
      return items.value;
    }

    const multiplier: number = currentOrder.value === 'asc' ? 1 : -1;
    const bufItems: Array<T> = [...items.value];

    return bufItems.sort((lhs: T, rhs: T): number => {
      let lhsValue;
      let rhsValue;

      switch (currentField.value.comparator) {
        case 'number':
          lhsValue = lhs[currentField.value.field as keyof T];
          rhsValue = rhs[currentField.value.field as keyof T];
          return multiplier * (+lhsValue - +rhsValue);
        case 'string':
          lhsValue = lhs[currentField.value.field as keyof T];
          rhsValue = rhs[currentField.value.field as keyof T];
          return multiplier * String(lhsValue)?.localeCompare(String(rhsValue));
        default:
          return (
            multiplier *
            (currentField.value.comparator as ComparatorCallback<T>)(lhs, rhs)
          );
      }
    });
  });

  return {
    sorted,
    fields,
    orders,
    currentFieldName,
    currentOrder,
  };
}
