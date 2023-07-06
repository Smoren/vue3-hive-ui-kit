import { FilteredOptions } from '@/common/types/option';
import type { ActiveValue, CurrentValue, Value } from '@/common/types/value';

export interface ListMethodsConfig {
  activeValue: ActiveValue;
  currentValue: CurrentValue;
  filteredOptions: FilteredOptions;
  collapse: () => void;
}

export interface ListMethodsExport {
  updateCurrentValue: (value: Value) => void;
}

export const useListMethods = ({
  activeValue,
  currentValue,
  filteredOptions,
  collapse,
}: ListMethodsConfig): ListMethodsExport => {
  const updateCurrentValue = (value: Value) => {
    if (!filteredOptions.value[String(activeValue.value)]) {
      collapse();
      return;
    }

    if (currentValue.value !== value) {
      currentValue.value = value;
    }

    collapse();
  };

  return {
    updateCurrentValue,
  };
};
