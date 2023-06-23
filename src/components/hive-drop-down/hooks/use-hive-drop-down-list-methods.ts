import type { ValueType } from '@/common/types/valueType';
import type {
  ActiveValueType,
  CurrentValueType,
  FilteredOptionsType,
} from '@/components/hive-drop-down/hooks/use-hive-drop-down-list';

interface DropDownListMethodsConfig {
  activeValue: ActiveValueType;
  currentValue: CurrentValueType;
  filteredOptions: FilteredOptionsType;
  collapse: () => void;
}

interface DropDownListMethodsExport {
  updateCurrentValue: (value: ValueType) => void;
}

export type { DropDownListMethodsConfig, DropDownListMethodsExport };

export default function useHiveDropDownListMethods({
  activeValue,
  currentValue,
  filteredOptions,
  collapse,
}: DropDownListMethodsConfig): DropDownListMethodsExport {
  const updateCurrentValue = (value: ValueType) => {
    if (!filteredOptions.value[String(activeValue.value)]) {
      collapse();
      return;
    }

    if (currentValue.value !== value) {
      currentValue.value = value;
    }
    // handleEvent(new Event(modelValueEventName));
    collapse();
  };

  return {
    updateCurrentValue,
  };
}
