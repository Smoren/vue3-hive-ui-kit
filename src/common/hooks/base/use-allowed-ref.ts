import { customRef, type Ref, ref } from 'vue';

export default function useAllowedRef<T>(value: T, isAllowed = ref(true)): Ref<T> {
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue: T) {
      if (isAllowed.value) {
        value = newValue;
      }
      trigger();
    },
  }));
}
