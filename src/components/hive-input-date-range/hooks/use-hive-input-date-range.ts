import { computed, type Ref, ref, watch, type WritableComputedRef } from 'vue';
import toDateString from '@hive/common/funcs/to-date-string';
import formatDateTimeModelValue from '@hive/common/funcs/format-date-time-model-value';

type ModelValueType = string | Array<number | string>;

interface InputDateRangeExport {
  currentValue: Ref<number[]>;
  formattedDates: WritableComputedRef<string>;
}

export type { ModelValueType };

export default function useHiveInputDateRange(
  modelValue: ModelValueType
): InputDateRangeExport {
  const currentValue = ref(formatDateTimeModelValue(modelValue));
  const formattedDates = computed({
    get: () => `${toDateString(currentValue.value[0], 'date')} — ${toDateString(
        currentValue.value[1],
        'date'
      )}`,
    // eslint-disable-next-line
    set: () => {},
  });

  watch(
    () => [...currentValue.value],
    (newValue) => {
      const start = newValue[0];
      const end = newValue[1];

      if (end < start) {
        currentValue.value = [start, start];
      }
    }
  );

  return {
    currentValue,
    formattedDates,
  };
}
