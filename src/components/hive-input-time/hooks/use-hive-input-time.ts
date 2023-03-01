import { type Ref, ref, watch } from 'vue';
import toTimestamp from '@hive/common/funcs/to-timestamp';
import toDateString from '@hive/common/funcs/to-date-string';

type ModelValueType = string | number;

interface InputTimeExport {
  currentValue: Ref<number>;
  formattedTime: Ref<string>;
}

export type { ModelValueType };

export default function useHiveInputTime(
  modelValue: ModelValueType,
  withSeconds: boolean
): InputTimeExport {

  const currentValue = ref(toTimestamp(modelValue));
  const formattedTime = ref(toDateString(currentValue.value, 'time', withSeconds));

  watch(
    () => currentValue.value,
    (newValue) => {
      formattedTime.value = toDateString(newValue, 'time', withSeconds);
    }
  );

  return {
    currentValue,
    formattedTime,
  };
}
