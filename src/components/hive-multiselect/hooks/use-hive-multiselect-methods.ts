import type { ValueType } from "@hive/common/types";
import type {
  ActiveValueType,
  CurrentValueType,
  FilteredOptionsType,
} from "@hive/components/hive-multiselect/hooks/use-hive-multiselect";
import type { Ref } from "vue";

interface DropDownListMultipleMethodsConfig {
  activeValue: ActiveValueType;
  currentValue: CurrentValueType;
  filteredOptions: FilteredOptionsType;
  collapse: () => void;
  searchQuery: Ref<string>;
  handleEvent: (event: Event, data: any) => void;
}

interface DropDownListMultipleMethodsExport {
  addToCurrentValue: (value: ValueType, fromModelValue?: boolean) => void;
  removeFromCurrentValue: (value: ValueType) => void;
  onBackspace: (e: KeyboardEvent) => void;
}

export type {
  DropDownListMultipleMethodsConfig,
  DropDownListMultipleMethodsExport,
};

export default function useHiveMultiselectMethods({
  activeValue,
  currentValue,
  filteredOptions,
  searchQuery,
  handleEvent,
}: DropDownListMultipleMethodsConfig): DropDownListMultipleMethodsExport {
  const addToCurrentValues = (value: ValueType, fromModelValue = false) => {
    if (!filteredOptions.value[String(activeValue.value)] && !fromModelValue) {
      return;
    }

    let isAllowed = true;

    if (!fromModelValue) {
      const prevent = () => {
        isAllowed = false;
      };
      const updateValue = (changedValue: string) => {
        value = changedValue;
      };

      handleEvent(new Event("onBeforeChange"), {
        prevent,
        value,
        updateValue,
      });
    }
    if (fromModelValue) {
      if (!currentValue.value.includes(value)) {
        currentValue.value.push(value);
      }
    } else if (isAllowed) {
      const prevNode = filteredOptions.value[String(value)].prev;
      const nextNode = filteredOptions.value[String(value)].next;

      currentValue.value.push(value);
      searchQuery.value = "";

      if (nextNode) {
        activeValue.value = String(nextNode.value);
      } else if (prevNode) {
        activeValue.value = String(prevNode.value);
      }

      handleEvent(new Event("onAfterChange"), value)
    }
  };

  const removeFromCurrentValues = (value: ValueType) => {
    currentValue.value.splice(currentValue.value.indexOf(value), 1);
    activeValue.value = value;
  };

  const onBackspace = (e: KeyboardEvent) => {
    if (e.key === "Backspace" && !searchQuery.value.length) {
      currentValue.value.pop();
    }
  };

  return {
    addToCurrentValue: addToCurrentValues,
    removeFromCurrentValue: removeFromCurrentValues,
    onBackspace,
  };
}
