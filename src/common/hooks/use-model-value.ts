import { watch, Ref } from 'vue';
import { onUpdateModelValue, Update } from '@/common/mixin/emits';

export const useModelValue = <T>(value: Ref<T>, emit: Update<T>) => {
  watch(value, () => {
    onUpdateModelValue(emit, value);
  });
};

