import { computed, type Ref, ref, type WritableComputedRef } from "vue";
import toTimestamp from "@hive/common/funcs/to-timestamp";
import toDateString from "@hive/common/funcs/to-date-string";

type ModelValueType = string | Array<number | string>;

interface InputTimeRangeExport {
  startTime: Ref<number>;
  endTime: Ref<number>;
  currentValue: Ref<ModelValueType>;
  formattedTime: WritableComputedRef<string>;
}

export type { ModelValueType };

export default function useHiveInputTimeRange(
  modelValue: ModelValueType,
  withSeconds: boolean
): InputTimeRangeExport {
  const currentValue = ref(modelValue ?? [new Date().getTime(), new Date().getTime()]);
  const startTime = computed({
    get: () => {
      if (typeof currentValue.value === "string") {
        return toTimestamp(currentValue.value.split(" ")[0]);
      }
      return toTimestamp(currentValue.value[0]);
    },
    set: (val: number) => {
      // eslint-disable-next-line
      currentValue.value = [val, endTime.value];
    },
  });

  const endTime = computed({
    get: () => {
      const result =
        typeof currentValue.value === "string"
          ? toTimestamp(currentValue.value.split(" ")[1])
          : toTimestamp(currentValue.value[1]);

      if (result < startTime.value) {
        return startTime.value;
      }

      return result;
    },
    set: (val: number) => {
      currentValue.value = [startTime.value, val];
    },
  });

  const formattedTime = computed({
    get: () =>
      `${toDateString(
        toTimestamp(startTime.value),
        "time",
        withSeconds
      )} — ${toDateString(toTimestamp(endTime.value), "time", withSeconds)}`,
    // eslint-disable-next-line
    set: () => {},
  });

  return {
    startTime,
    endTime,
    currentValue,
    formattedTime,
  };
}
