import { watch, Ref } from 'vue';
import { OnUpdateModelValue, Update } from '@/common/mixin/emits';

export const useModelValue = <T>(value: Ref<T>, emit: Update<T>) => {
  watch(value, () => {
    OnUpdateModelValue(emit, value);
  });
};

