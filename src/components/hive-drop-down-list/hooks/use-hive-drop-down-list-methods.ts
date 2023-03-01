import type { ValueType, VueComponent } from '@hive/common/types';
import type {
  ActiveValueType,
  CurrentValueType,
  FilteredOptionsType,
} from '@hive/components/hive-drop-down-list/hooks/use-hive-drop-down-list';

interface DropDownListMethodsConfig {
  activeValue: ActiveValueType;
  currentValue: CurrentValueType;
  filteredOptions: FilteredOptionsType;
  context: VueComponent;
  modelValueEventName: string;
  handleEvent: (event: Event) => void;
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
  modelValueEventName,
  handleEvent,
  collapse,
}: DropDownListMethodsConfig): DropDownListMethodsExport {
  const updateCurrentValue = (value: ValueType) => {
    if (!filteredOptions.value[String(activeValue.value)]) {
      collapse();
      return;
    }

    if (currentValue.value !== value) {
      currentValue.value = value;
      handleEvent(new Event(modelValueEventName));
    }
    collapse();
  };

  return {
    updateCurrentValue,
  };
}
