import { computed, type ComputedRef, ref, type Ref, watch } from 'vue';
import type { ActiveValue, CurrentValue } from '@/common/types/value';
import useDataContainer, { createUnknownNode, UNKNOWN_KEY } from '@/common/hooks/use-data-container';
import useSearch from '@/common/hooks/use-search';
import { Option, Options } from '@/common/types/option';
import { DataContainer, DataContainerNode } from '@/common/types/data-container';

export interface ListConfig {
  modelValue: string;
  options: Options;
  valueField?: string;
  titleField?: string;
  minQueryLength?: number;
  empty?: boolean;
  withNull?: boolean;
  nullTitle?: string;
}

export interface ListExport {
  currentValue: CurrentValue;
  activeValue: ActiveValue;
  currentOptions: Ref<Options>;
  currentOption: ComputedRef<DataContainerNode<Option>>;
  filteredOptions: ComputedRef<DataContainer<Option>>;
  searchQuery: Ref<string>;
  valueChangedOnInit: boolean;
}

export const useList = ({
  modelValue,
  valueField,
  titleField,
  options,
  minQueryLength,
  empty,
  withNull,
  nullTitle,
}: ListConfig): ListExport => {
  let valueChangedOnInit = false;
  const currentValue = ref(modelValue);
  const activeValue = ref(modelValue);
  let currentOptions: Ref<Option[] | Record<string, Option>>;
  if (Array.isArray(options)) {
    if (withNull && valueField) {
      options.unshift({
        [titleField!]: nullTitle,
        [valueField ?? 'value']: null,
      });
    }
    const opt = JSON.parse(JSON.stringify(options));
    currentOptions = ref(Array.from(new Set(opt)) as Option[] | Record<string, Option>);
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

  const unfilteredOptions: ComputedRef<DataContainer<Option>> = useDataContainer({
    valueField,
    titleField,
    data: currentOptions,
  });

  const filteredOptions: ComputedRef<DataContainer<Option>> = useDataContainer({
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
        unfilteredOptions.value[UNKNOWN_KEY] = createUnknownNode() as unknown as DataContainerNode<Option>;
      }
    }
  };

  onOptionsInit();

  watch(
    () => currentOptions.value,
    () => onOptionsInit(),
  );

  const emptyNode = {
    key: '',
    value: '',
    title: '',
    visible: false,
    raw: null,
    prev: null,
    next: null,
  };

  const currentOption = computed<DataContainerNode<Option>>(
    (): DataContainerNode<Option> =>
      empty && currentValue.value === '' ? emptyNode : unfilteredOptions.value[String(currentValue.value)],
  );

  return {
    currentValue,
    activeValue,
    currentOptions,
    currentOption,
    filteredOptions: filteredOptions as ComputedRef<DataContainer<Option>>,
    searchQuery,
    valueChangedOnInit,
  };
};
