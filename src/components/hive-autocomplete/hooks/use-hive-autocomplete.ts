import useSearch, { type InputCollection } from '@/ui-kit/src/common/hooks/base/use-search';
import { type ComputedRef, type Ref, ref, watch } from 'vue';
import useDataContainer, {
  type DataContainer,
  type DataContainerNode,
} from '@/ui-kit/src/common/hooks/base/use-data-container';
import type { ValueType } from '@/ui-kit/src/common/types';

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;

interface AutocompleteConfig {
  currentValue: Ref<string>;
  options: OptionsType;
  valueField?: string;
  titleField?: string;
  minQueryLength: number;
  handleEvent: (event: Event) => void;
}

interface AutocompleteExport {
  activeValue: Ref<ValueType | null>;
  searchRef: Ref<null | HTMLInputElement>;
  currentOptions: Ref<OptionsType>;
  filteredOptions: ComputedRef<InputCollection<DataContainerNode<OptionType>>>;
  searchQuery: Ref<string>;
  clearSearchQuery: () => void;
  isPopupVisible: Ref<boolean>;
  showPopup: () => void;
  hidePopup: (event: Event) => void;
  updateSearchQuery: (value: ValueType) => void;
  setPrevActiveValue: () => void;
  setNextActiveValue: () => void;
  focusInput: () => void;
  setActiveValueToFirst: () => void;
  isChangeAllowed: Ref<boolean>;
}

export type { AutocompleteConfig };

export default function useHiveAutocomplete({
  currentValue,
  options,
  valueField,
  titleField,
  minQueryLength,
  handleEvent,
}: AutocompleteConfig): AutocompleteExport {
  const currentOptions = ref(options);
  const isPopupVisible = ref(false);
  const activeValue = ref<ValueType | null>(null);
  const searchRef = ref<null | HTMLInputElement>(null);

  const formattedOptions = useDataContainer({
    data: currentOptions,
    valueField,
    titleField,
  });

  const {
    filtered: bufferedOptions,
    query: searchQuery,
    isChangeAllowed,
  } = useSearch({
    items: formattedOptions,
    fields: ['title'],
    caseInsensitive: true,
    minQueryLength,
  });

  if (currentValue.value) {
    searchQuery.value = currentValue.value;
  }

  const filteredOptions: ComputedRef<DataContainer<OptionType>> = useDataContainer({
    valueField,
    titleField,
    data: bufferedOptions,
  });

  const clearSearchQuery = () => {
    searchQuery.value = '';
  };

  const showPopup = () => {
    isPopupVisible.value = true;
  };

  const hidePopup = (event: Event) => {
    if (
      (event as FocusEvent).relatedTarget &&
      ((event as FocusEvent).relatedTarget as unknown as HTMLElement).closest('.hive-autocomplete')
    ) {
      return;
    }

    isPopupVisible.value = false;
    activeValue.value = null;
    handleEvent(new Event('focusout'));
  };

  const updateSearchQuery = (value: ValueType) => {
    const currentOption = formattedOptions.value[String(value)];

    if (!value || !currentOption) {
      return;
    }

    setTimeout(() => {
      isPopupVisible.value = false;
    }, 0);

    if (searchQuery.value !== currentOption.title) {
      searchQuery.value = currentOption.title;
    }
  };

  const setActiveValueToFirst = () => {
    const opts = Object.values(filteredOptions.value);

    if (!opts.length) {
      activeValue.value = null;
    } else if (!filteredOptions.value[String(activeValue.value)]) {
      activeValue.value = opts[0].value as ValueType;
    }
  };

  const setPrevActiveValue = () => {
    let node = null;
    try {
      node = filteredOptions.value[String(activeValue.value)].prev;
    } catch (e) {
      setActiveValueToFirst();
      return;
    }

    if (node !== null) {
      activeValue.value = node.value as ValueType;
    }
  };

  const setNextActiveValue = () => {
    let node = null;
    try {
      node = filteredOptions.value[String(activeValue.value)].next;
    } catch (e) {
      setActiveValueToFirst();
      return;
    }

    if (node !== null) {
      activeValue.value = node.value as ValueType;
    }
  };

  const focusInput = () => {
    (searchRef.value as HTMLInputElement).focus();
  };

  watch(
    () => searchQuery.value,
    (newValue) => {
      showPopup();
      if (currentValue.value !== newValue) {
        currentValue.value = newValue;
      }
    }
  );

  return {
    activeValue,
    searchRef,
    currentOptions,
    filteredOptions,
    searchQuery,
    clearSearchQuery,
    isPopupVisible,
    showPopup,
    hidePopup,
    updateSearchQuery,
    setPrevActiveValue,
    setNextActiveValue,
    focusInput,
    setActiveValueToFirst,
    isChangeAllowed,
  };
}
