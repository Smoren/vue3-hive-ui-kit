import { watch, Ref } from 'vue';

export const useModelValue = <T>(value: Ref<T>, emit: update<T>) => {
  watch(value, () => {
    emit('update:modelValue', value.value);
  });
};

export type update<T> = (e: 'update:modelValue', value: T) => void;
