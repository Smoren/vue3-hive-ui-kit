import { computed, ref, type Ref, type WritableComputedRef } from 'vue';
import toDateString from '@hive/common/funcs/to-date-string';
import toTimestamp from '@hive/common/funcs/to-timestamp';
import uniteDateAndTimeTimestamps from '@hive/common/funcs/unite-date-and-time-timestamps';

type ModelValueType = string | number;

interface InputDateTimeExport {
  currentValue: Ref<number>;
  date: Ref<number>;
  time: Ref<string>;
  dateTime: WritableComputedRef<string>;
}

export type { ModelValueType };

export default function useHiveInputDateTime(
  modelValue: ModelValueType,
  withSeconds: boolean
): InputDateTimeExport {
  let currentValue: Ref<number>;
  if(modelValue === null || modelValue === undefined){
    currentValue = ref(toTimestamp(new Date().getTime()));
  }else{
    currentValue = ref(toTimestamp(modelValue));
  }
  const date = ref(currentValue.value);
  const time = ref(
    `${new Date(currentValue.value).getHours()}:${new Date(
      currentValue.value
    ).getMinutes()}${
      withSeconds ? `:${new Date(currentValue.value).getSeconds()}` : ''
    }`
  );

  const dateTime = computed({
    get: () => `${toDateString(date.value, 'date')} ${toDateString(
        time.value,
        'time',
        withSeconds
      )}`,
    set: () => {
      currentValue.value = uniteDateAndTimeTimestamps(
        date.value,
        toTimestamp(time.value)
      );
    },
  });

  return {
    currentValue,
    date,
    time,
    dateTime,
  };
}
