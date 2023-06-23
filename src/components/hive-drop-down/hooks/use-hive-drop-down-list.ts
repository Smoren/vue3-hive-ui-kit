import { computed, type ComputedRef, ref, type Ref, watch } from 'vue';
import type { ValueType } from '@/common/types/valueType';
import useDataContainer, {
  type DataContainer,
  type DataContainerNode,
  createUnknownNode,
  UNKNOWN_KEY,
} from '@/common/hooks/use-data-container';
import useSearch from '@/common/hooks/use-search';

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
  empty: boolean;
  withNull: boolean;
  nullTitle: string;
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
  empty,
  withNull,
  nullTitle,
}: DropDownListConfig): DropDownListExport {
  let valueChangedOnInit = false;
  const currentValue = ref(modelValue);
  const activeValue = ref(modelValue);
  let currentOptions: Ref<OptionType[] | Record<string, OptionType>>;
  if (Array.isArray(options)) {
    if (withNull) {
      options.unshift({
        [titleField]: nullTitle,
        [valueField ?? 'value']: null,
      });
    }
    const opt = JSON.parse(JSON.stringify(options));
    currentOptions = ref(Array.from(new Set(opt)) as OptionType[] | Record<string, OptionType>);
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

  const unfilteredOptions: ComputedRef<DataContainer<OptionType>> = useDataContainer({
    valueField,
    titleField,
    data: currentOptions,
  });

  const filteredOptions: ComputedRef<DataContainer<OptionType>> = useDataContainer({
    valueField,
    titleField,
    data: bufferedOptions,
  });

  const unfilteredOptionsLength = computed(() => Object.keys(unfilteredOptions.value).length);

  const onOptionsInit = () => {
    if (
      currentValue.value === undefined ||
      currentValue.value === null ||
      !unfilteredOptions.value[String(currentValue.value)] ||
      !unfilteredOptionsLength.value
    ) {
      if (unfilteredOptionsLength.value && !empty) {
        currentValue.value = Object.keys(unfilteredOptions.value)[0];
        valueChangedOnInit = true;
      } else if (empty) {
        currentValue.value = '';
      } else {
        currentValue.value = UNKNOWN_KEY;
        unfilteredOptions.value[UNKNOWN_KEY] = createUnknownNode() as unknown as DataContainerNode<OptionType>;
      }
    }
  };

  onOptionsInit();

  watch(
    () => currentOptions.value,
    () => onOptionsInit(),
  );

  const emtyNode = {
    key: '',
    value: '',
    title: '',
    visible: false,
    raw: null,
    prev: null,
    next: null,
  };

  const currentOption = computed<DataContainerNode<OptionType>>(
    (): DataContainerNode<OptionType> =>
      empty && currentValue.value === '' ? emtyNode : unfilteredOptions.value[String(currentValue.value)],
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
