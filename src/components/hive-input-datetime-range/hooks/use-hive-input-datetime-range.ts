import {
  computed,
  type ComputedRef,
  type Ref,
  ref,
  watch,
  type WritableComputedRef,
} from "vue";
import formatDateTimeModelValue from "@hive/common/funcs/format-date-time-model-value";
import toDateString from "@hive/common/funcs/to-date-string";
import uniteDateAndTimeTimestamps from "@hive/common/funcs/unite-date-and-time-timestamps";
import resetTime from "@hive/common/funcs/reset-time";

type ModelValueType =
  | string
  | Array<number | string>
  | Array<Array<number | string>>;
type CurrentValueType = Array<number[] | number>;

interface InputDateTimeRangeExport {
  currentValue: Ref<CurrentValueType>;
  formattedDateTimeRange: WritableComputedRef<string>;
  getEndMinTime: () => number | string;
  endKey: ComputedRef<number>;
}

export type { ModelValueType };

export default function useHiveInputDateTimeRange(
  modelValue: ModelValueType,
  withSeconds: boolean
): InputDateTimeRangeExport {
  let currentValue: Ref<CurrentValueType>;
  if (
    Array.isArray(
      modelValue === null || modelValue === undefined
        ? modelValue
        : modelValue[0]
    )
  ) {
    currentValue = ref<CurrentValueType>(modelValue as CurrentValueType);
  } else {
    currentValue = ref<CurrentValueType>(formatDateTimeModelValue(modelValue as string));
    currentValue.value = [
      [currentValue.value[0] as number, currentValue.value[0] as number],
      [currentValue.value[1] as number, currentValue.value[1] as number],
    ];
  }

  const formattedDateTimeRange = computed({
    get: () =>
      `${toDateString(
        (currentValue.value[0] as number[])[0],
        "date"
      )}, ${toDateString(
        (currentValue.value[0] as number[])[1],
        "time",
        withSeconds
      )} — ${toDateString(
        (currentValue.value[1] as number[])[0],
        "date"
      )}, ${toDateString(
        (currentValue.value[1] as number[])[1],
        "time",
        withSeconds
      )}`,
    // eslint-disable-next-line
    set: () => {},
  });

  const getEndMinTime = () => {
    const startDate = new Date((currentValue.value[0] as number[])[0]);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    if (
      resetTime((currentValue.value[1] as number[])[0]) <= startDate.getTime()
    ) {
      return (currentValue.value[0] as number[])[1];
    }

    return "00:00:00";
  };

  const endKey = computed(
    () =>
      uniteDateAndTimeTimestamps(
        (currentValue.value[0] as number[])[0],
        (currentValue.value[0] as number[])[1]
      ) + (currentValue.value[1] as number[])[0]
  );

  watch(
    () => [
      ...(currentValue.value as Array<number[]>)[0],
      ...(currentValue.value as Array<number[]>)[1],
    ],
    () => {
      const start = uniteDateAndTimeTimestamps(
        (currentValue.value[0] as number[])[0],
        (currentValue.value[0] as number[])[1]
      );
      const end = uniteDateAndTimeTimestamps(
        (currentValue.value[1] as number[])[0],
        (currentValue.value[1] as number[])[1]
      );

      if (end < start) {
        currentValue.value = [
          [start, start],
          [start, start],
        ];
      }
    }
  );

  return {
    currentValue,
    formattedDateTimeRange,
    getEndMinTime,
    endKey,
  };
}
