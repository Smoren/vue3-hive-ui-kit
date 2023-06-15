import { watch, Ref } from 'vue';

const useModelValue = <T>(value: Ref<T>, emit: update<T>) => {
  watch(value, () => {
    emit('update:modelValue', value.value);
  });
};

export type update<T> = (e: 'update:modelValue', value: T) => void;

export default useModelValue;
