import { computed, provide, reactive, ref, watch } from "vue";
import deepClone from "@hive/common/funcs/deepClone";
import type { EventData } from "@hive/common/hooks/base/use-event-handler";
import type { VueComponent } from "@hive/common/types";
import { v4 as uuidv4 } from "uuid";

export interface GridColumns {
  field: string;
  title: string;
  width?: number;
  editable?: boolean;
  editType?:
    | "text"
    | "number"
    | "date"
    | "dropdown-list"
    | "date-range"
    | "date-time-range"
    | "time-range"
    | "date-time"
    | "time"
    | "textarea"
    | "autocomplete"
    | "multiselect";
  sortable?: boolean;
  sort?: (a: object, b: object) => number;
  viewType?: "text" | "list";
  separator?: string;
  options?: string[] | number[];
}

export interface GridConfig {
  columns: GridColumns[];
  dataItems: object[];
}

interface SortedFlags {
  sorted: boolean;
  field: string;
}

interface HelperFunctionConfig {
  event: EventData;
  handleChange: (value: EventData["value"], view?: unknown) => void;
  handleToggle: () => void;
}

interface HelperFunction {
  event: EventData;
  handleChange: (
    value: EventData["value"],
    view?: VueComponent["value"]
  ) => void;
  handleToggle: () => void;
}

export default function useHiveGrid({ columns, dataItems }: GridConfig) {
  const isLoading = ref(false);

  const isKeyInColumns = (columns: GridColumns[], key: string): boolean => {
    let hasKey = false;
    if (key === "id") {
      hasKey = true;
    } else {
      columns.forEach((column) => {
        if (column.field === key) {
          hasKey = true;
        }
      });
    }

    return hasKey;
  };

  const getSelectedFileds = (items: object) => {
    const selectedFields = Object.keys(dataItems[0])
      .filter((key) => isKeyInColumns(columns, key))
      .reduce(
        (res, key) =>
          Object.assign(res, {
            [key]:
              items ?? (items[key] !== undefined && typeof items !== "string")
                ? (items as any)[key]
                : "",
          }),
        {}
      );

    return selectedFields;
  };

  const rawItems = computed({
    get() {
      const rawItems: object[] = [];
      dataItems.forEach((item) => {
        rawItems.push(getSelectedFileds(item));
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

  const objectToDefault = (obj: any) => {
    const res = deepClone(obj);
    for (let i in res) {
      console.log(i);
      if (i === "id") {
        console.log("here");
        res[i] = uuidv4();
      } else if (typeof res[i] === "number") {
        res[i] = 0;
      } else if (Array.isArray(res[i])) {
        res[i] = null;
      } else {
        res[i] = "";
      }
    }
    console.log(obj, res);
    return res;
  };

  const addRow = (up: boolean, index: number) => {
    const element = objectToDefault(rawItems.value[index]);
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

  let itemsCopy = deepClone(rawItems.value);

  const sortedFlags: SortedFlags[] = [];

  columns.forEach((item) => {
    sortedFlags.push({ sorted: false, field: item.field });
  });

  const sort = (field: string) => {
    const index = findByField(field);

    if (index === null) return;

    const isSorted = sortedFlags[index].sorted;
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
        sortedFlags[index].sorted = true;
      } else {
        //@ts-ignore
        rawItems.value.sort((item1, item2) => item2[field] - item1[field]);
        sortedFlags[index].sorted = true;
      }
    }
  };

  const dropDownChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "focusout") {
      handleChange(event.value);
      handleToggle();
    }
  };

  const dateChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedDate);
      handleToggle();
    }
  };

  const dateRangeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedDates);
      handleToggle();
    }
  };

  const dateTimeRangeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(
        event.component.currentValue,
        event.component.formattedDateTimeRange
      );
      handleToggle();
    }
  };

  const timeRangeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedTime);
      handleToggle();
    }
  };

  const timeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedTime);
      handleToggle();
    }
  };

  const autocompleteChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value);
    }
  };

  const multiselectChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "focusout") {
      handleChange(event.value);
      handleToggle();
    }
  };

  return {
    items: rawItems,
    sort,
    dropDownChangeHelper,
    dateChangeHelper,
    dateRangeChangeHelper,
    dateTimeRangeChangeHelper,
    timeChangeHelper,
    timeRangeChangeHelper,
    autocompleteChangeHelper,
    multiselectChangeHelper,
    deleteRow,
    itemsLength,
    addRow,
    isLoading,
  };
}
