import { type ComputedRef, type Ref, ref } from "vue";
import useDataContainer, {
  type DataContainer,
} from "@hive/common/hooks/base/use-data-container";
import type { ValueType } from "@hive/common/types";

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;
type CurrentValueType = Ref<ValueType>;

interface RadioGroupConfig {
  modelValue: string;
  options: OptionsType;
  keyField?: string;
  valueField?: string;
  titleField?: string;
}

interface RadioGroupExport {
  currentValue: CurrentValueType;
  currentOptions: Ref<OptionsType>;
  formattedOptions: ComputedRef<DataContainer<OptionType>>;
}

export type {
  OptionType,
  OptionsType,
  CurrentValueType,
  RadioGroupConfig,
  RadioGroupExport,
};

export default function useRadioGroup({
  modelValue,
  valueField,
  titleField,
  options,
}: RadioGroupConfig): RadioGroupExport {
  const currentValue = ref<ValueType>(modelValue);
  const currentOptions = ref(options);
  const formattedOptions: ComputedRef<DataContainer<OptionType>> =
    useDataContainer({
      valueField,
      titleField,
      data: currentOptions,
    });

  return {
    currentValue,
    currentOptions,
    formattedOptions,
  };
}
