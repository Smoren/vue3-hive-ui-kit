import { computed, type ComputedRef, ref, type Ref, watch } from 'vue';
import type { ValueType } from '@hive/common/types';
import useDataContainer, {
  type DataContainer,
  type DataContainerNode,
  createUnknownNode,
  UNKNOWN_KEY,
} from '@hive/common/hooks/base/use-data-container';
import useSearch from '@hive/common/hooks/base/use-search';

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;
type CurrentValueType = Ref<ValueType>;
type ActiveValueType = Ref<ValueType | null>;
type FilteredOptionsType = ComputedRef<DataContainer<OptionType>>;

interface DropDownListConfig {
  modelValue: string;
  options: OptionsType;
  keyField?: string;
  valueField?: string;
  titleField: string;
  minQueryLength: number;
}

interface DropDownListExport {
  currentValue: CurrentValueType;
  activeValue: ActiveValueType;
  currentOptions: Ref<OptionsType>;
  currentOption: ComputedRef<DataContainerNode<OptionType>>;
  filteredOptions: ComputedRef<DataContainer<OptionType>>;
  searchQuery: Ref<string>;
  valueChangedOnInit: boolean;
}

export type {
  CurrentValueType,
  ActiveValueType,
  FilteredOptionsType,
  OptionType,
  OptionsType,
  DropDownListConfig,
  DropDownListExport,
};

export default function useHiveDropDownList({
  modelValue,
  valueField,
  titleField,
  options,
  minQueryLength,
}: DropDownListConfig): DropDownListExport {
  let valueChangedOnInit = false;
  const currentValue = ref(modelValue);
  const activeValue = ref(modelValue);
  let currentOptions: Ref<OptionType[] | Record<string, OptionType>>;
  if (Array.isArray(options)) {
    currentOptions = ref(Array.from(new Set(options)));
  } else {
    currentOptions = ref(options);
  }
  const searchFields = titleField ? [titleField] : ['title'];
  const { filtered: bufferedOptions, query: searchQuery } = useSearch({
    items: currentOptions,
    fields: searchFields,
    caseInsensitive: true,
    minQueryLength,
  });

  const unfilteredOptions: ComputedRef<DataContainer<OptionType>> =
    useDataContainer({
      valueField,
      titleField,
      data: currentOptions,
    });

  const filteredOptions: ComputedRef<DataContainer<OptionType>> =
    useDataContainer({
      valueField,
      titleField,
      data: bufferedOptions,
    });

  const unfilteredOptionsLength = computed(
    () => Object.keys(unfilteredOptions.value).length
  );

  const onOptionsInit = () => {
    if (
      currentValue.value === undefined ||
      currentValue.value === null ||
      !unfilteredOptions.value[String(currentValue.value)] ||
      !unfilteredOptionsLength.value
    ) {
      if (unfilteredOptionsLength.value) {
        currentValue.value = Object.keys(unfilteredOptions.value)[0];
        valueChangedOnInit = true;
      } else {
        currentValue.value = UNKNOWN_KEY;
        unfilteredOptions.value[UNKNOWN_KEY] =
          createUnknownNode() as unknown as DataContainerNode<OptionType>;
      }
    }
  };

  onOptionsInit();

  watch(
    () => currentOptions.value,
    () => onOptionsInit()
  );

  const currentOption = computed<DataContainerNode<OptionType>>(
    (): DataContainerNode<OptionType> => unfilteredOptions.value[String(currentValue.value)]
  );

  return {
    currentValue,
    activeValue,
    currentOptions,
    currentOption,
    filteredOptions: filteredOptions as ComputedRef<DataContainer<OptionType>>,
    searchQuery,
    valueChangedOnInit,
  };
}
