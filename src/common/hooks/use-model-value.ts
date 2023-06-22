import { watch, Ref } from 'vue';
import { Update } from '../mixin/emits';

export const useModelValue = <T>(value: Ref<T>, emit: Update<T>) => {
  watch(value, () => {
    emit('update:modelValue', value.value);
  });
};

