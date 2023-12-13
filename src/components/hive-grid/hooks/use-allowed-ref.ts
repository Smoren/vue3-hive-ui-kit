import { type Ref, customRef } from 'vue';

export const useAllowedRef = <T>(value: T, isChangeAllowed: Ref<boolean>, row?: Record<string, T>, field?: string) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: T) {
        if (isChangeAllowed.value) {
          value = newValue;
        } else {
          if (row && field) {
            value = row[field] as T;
          }
        }
        trigger();
      },
    };
  });
};
