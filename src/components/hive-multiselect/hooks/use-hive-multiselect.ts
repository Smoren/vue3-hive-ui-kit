import { type ComputedRef, ref, type Ref, watch } from "vue";
import type { ValueType } from "@hive/common/types";
import useDataContainer, {
  createUnknownNode,
  type DataContainer,
  type DataContainerNode,
  UNKNOWN_KEY,
} from "@hive/common/hooks/base/use-data-container";
import useSearch from "@hive/common/hooks/base/use-search";
import useFilter, {
  CompareMode,
} from "@hive/common/hooks/base/use-filter";

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;
type CurrentValueType = Ref<ValueType[]>;
type ActiveValueType = Ref<ValueType | null>;
type FilteredOptionsType = ComputedRef<DataContainer<OptionType>>;

interface DropDownListMultipleConfig {
  modelValue: string[];
  options: OptionsType;
  keyField?: string;
  valueField?: string;
  titleField?: string;
  minQueryLength: number;
  onlyDistinctValues: boolean;
}

interface DropDownListMultipleExport {
  currentValue: CurrentValueType;
  activeValue: ActiveValueType;
  currentOptions: Ref<OptionsType>;
  filteredOptions: ComputedRef<DataContainer<OptionType>>;
  unfilteredOptions: ComputedRef<DataContainer<OptionType>>;
  searchQuery: Ref<string>;
}

export type {
  CurrentValueType,
  ActiveValueType,
  FilteredOptionsType,
  OptionType,
  OptionsType,
  DropDownListMultipleConfig,
  DropDownListMultipleExport,
};

export default function useHiveMultiselect({
  modelValue,
  valueField,
  titleField,
  options,
  minQueryLength,
  onlyDistinctValues,
}: DropDownListMultipleConfig): DropDownListMultipleExport {
  if (!Array.isArray(modelValue) && modelValue !== null) {
    throw new Error("Model value must be an array in MultiSelect");
  }
  if (modelValue === null) {
    modelValue = [];
  }
  const currentValue = ref(modelValue);
  const currentOptions = ref(
    (options as Array<OptionType>)?.concat(modelValue)
  );
  const unfilteredOptions: ComputedRef<DataContainer<OptionType>> =
    useDataContainer({
      valueField,
      titleField,
      data: currentOptions,
    });

  const { filtered: unselectedOptions } = useFilter({
    items: unfilteredOptions,
    fields: ["value"],
    caseInsensitive: true,
    defaultInvert: true,
    defaultCompareMode: CompareMode.Exact,
    query: currentValue,
    onlyDistinctValues,
  });

  const { filtered: bufferedOptions, query: searchQuery } =
    useSearch<OptionType>({
      items: unselectedOptions,
      fields: ["title"],
      caseInsensitive: true,
      minQueryLength,
    });

  const filteredOptions: ComputedRef<DataContainer<OptionType>> =
    useDataContainer({
      valueField,
      titleField,
      data: bufferedOptions,
    });

  const activeValue = ref(Object.keys(filteredOptions.value)[0]);

  watch(
    () => currentOptions.value,
    () => {
      [activeValue.value] = Object.keys(filteredOptions.value);
    }
  );

  return {
    currentValue,
    activeValue,
    currentOptions,
    filteredOptions,
    unfilteredOptions,
    searchQuery,
  };
}
