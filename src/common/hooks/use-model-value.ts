import { watch, Ref } from 'vue';
import { emitUpdateModelValue } from '@/common/emits/emits';
import { Update } from '../mixin/emits';

export const useModelValue = <T>(value: Ref<T>, emit: Update<T>) => {
  watch(value, () => {
    emitUpdateModelValue(emit, value);
  });
};

