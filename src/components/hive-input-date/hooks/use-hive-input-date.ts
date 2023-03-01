import { type Ref, ref, watch, computed } from "vue";
import toDateString from "@hive/common/funcs/to-date-string";
import toTimestamp from "@hive/common/funcs/to-timestamp";

type CurrentValueType = string | number;

interface InputDateExport {
  currentValue: Ref<number>;
  formattedDate: Ref<string>;
}

export type { CurrentValueType };

export default function useHiveInputDate(
  modelValue: CurrentValueType,
): InputDateExport {
  const value = modelValue;
  
  const currentValue = ref(
    value === null ? toTimestamp(value) : toTimestamp(value)
  );

  const formattedDate = ref(toDateString(value, "date"));

  watch(
    () => currentValue.value,
    (newValue) => {
      formattedDate.value = toDateString(newValue, "date");
    }
  );

  return {
    currentValue,
    formattedDate,
  };
}
