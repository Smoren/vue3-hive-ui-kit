import { onUpdateModelValue, Update } from '@/common/mixin/emits';

export const useModelValue = <T>(value: T, emit: Update<T>) => {
  onUpdateModelValue(emit, value);
};
