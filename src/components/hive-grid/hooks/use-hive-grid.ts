import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useDeepClone } from '@/common/hooks/use-deep-clone';
import type { GridColumns, GridConfig } from '../types';

type SortedFlags = {
  sorted: boolean;
  field: string;
};

export default function useHiveGrid({ columns, dataItems, extensionFields }: GridConfig) {
  const isLoading = ref(false);

  const isKeyInColumns = (columns: GridColumns[], key: string): boolean => {
    let hasKey = false;
    if (
      key === 'id' ||
      key === 'backgroundColor' ||
      key === 'editable' ||
      key === 'viewType' ||
      extensionFields?.includes(key)
    ) {
      hasKey = true;
    } else {
      columns.forEach((column) => {
        if (column.field === key || column.fields?.find((el) => el === key)) {
          hasKey = true;
        }
      });
    }

    return hasKey;
  };

  const getSelectedFields = (items: object) => {
    //@ts-ignore
    const selectedFields = Object.keys(dataItems.value[0])
      .filter((key) => isKeyInColumns(columns, key))
      .reduce(
        (res, key) =>
          Object.assign(res, {
            [key]: items ?? (items[key] !== undefined && typeof items !== 'string') ? (items as any)[key] : '',
          }),
        {},
      );

    return selectedFields;
  };

  const rawItems = computed({
    get() {
      const rawItems: object[] = [];
      dataItems.value?.forEach((item) => {
        rawItems.push(getSelectedFields(item));
      });

      return rawItems;
    },
    set(newValue) {
      return newValue;
    },
  });

  const itemsLength = ref(rawItems.value.length);

  const deleteRow = (index: number) => {
    rawItems.value = rawItems.value.splice(index, 1);
    itemsLength.value--;
  };

  const objectToDefault = <T>(obj: T) => {
    const res = useDeepClone(obj);
    for (let i in res) {
      if (i === 'id') {
        //@ts-ignore
        res[i] = uuidv4();
      } else if (typeof res[i] === 'number') {
        //@ts-ignore
        res[i] = 0;
      } else if (Array.isArray(res[i])) {
        //@ts-ignore
        res[i] = null;
      } else {
        //@ts-ignore
        res[i] = '';
      }
    }
    return res;
  };

  const addRow = (up: boolean, index: number) => {
    const element = objectToDefault(rawItems.value[index]);
    //@ts-ignore
    rawItems.value = rawItems.value.splice(up ? index : index + 1, 0, element);
    itemsLength.value++;
  };

  const findByField = (field: string): number | null => {
    let index = -1;
    columns.forEach((item, i) => {
      if (item.field === field) {
        index = i;
      }
    });
    return index === -1 ? null : index;
  };

  let itemsCopy = useDeepClone<typeof rawItems.value>(rawItems.value);

  const sortedFlags: SortedFlags[] = [];

  columns.forEach((item) => {
    sortedFlags.push({ sorted: false, field: item.field });
  });

  const sort = (field: string) => {
    const index = findByField(field);

    if (index === null) return;
    const isSorted = sortedFlags[index]?.sorted;
    const element = columns[index];

    if (element !== undefined && element.sortable) {
      if (isSorted) {
        itemsCopy.forEach((item: object, index: number) => {
          rawItems.value[index] = item;
        });
        sortedFlags.forEach((item) => (item.sorted = false));
      } else if (element.sort !== undefined) {
        //@ts-ignore
        rawItems.value.sort((a, b) => element?.sort(a[field], b[field]));
        if (sortedFlags[index]?.sorted !== undefined) {
          //@ts-ignore
          sortedFlags[index].sorted = true;
        }
      } else {
        //@ts-ignore
        rawItems.value.sort((item1, item2) => item2[field] - item1[field]);
        if (sortedFlags[index]?.sorted !== undefined) {
          //@ts-ignore
          sortedFlags[index].sorted = true;
        }
      }
    }
  };

  return {
    items: rawItems,
    sort,
    deleteRow,
    itemsLength,
    addRow,
    isLoading,
  };
}
