import { ref, watch, type Ref } from "vue";
import toDateString from "@hive/common/funcs/to-date-string";

const getTimezone = (withTimezone: boolean): number =>
  withTimezone ? 0 : new Date().getTimezoneOffset() * 60 * 1000;

export { getTimezone };

interface TimezoneExport {
  formattedDate: Ref<string>;
  outerValue: Ref<number>;
}

export default function useTimezone(
  currentValue: Ref<number>,
  timezone: number
): TimezoneExport {
  const outerValue = ref(currentValue.value);
  const formattedDate = ref(
    toDateString(outerValue.value === -1 ? '' : outerValue.value, "date")
  );

  watch(
    () => currentValue.value,
    (newValue) => {
      if (newValue === null) {
        outerValue.value = newValue;
      } else {
        outerValue.value = newValue + timezone + 1;
      }
    }
  );

  watch(
    () => outerValue.value,
    (newValue) => {
      formattedDate.value = toDateString(newValue, "date");
    }
  );

  return {
    formattedDate,
    outerValue,
  };
}
