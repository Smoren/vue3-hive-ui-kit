import { type ComputedRef, type Ref, ref, watch, reactive } from "vue";
import useDataContainer, {
  type DataContainer,
} from "@hive/common/hooks/base/use-data-container";
import useFilter, { CompareMode } from "@hive/common/hooks/base/use-filter";
import useSearch from "@hive/common/hooks/base/use-search";
import type { ValueType } from "@hive/common/types";
import type { EventHandler } from "@hive/common/hooks/base/use-event-handler";
import deepClone from "@hive/common/funcs/deepClone";

export type OptionType = string | number | Record<string, unknown>;
export type OptionsType = Array<OptionType> | Record<string, OptionType>;

interface MultiautocompleteConfig {
  currentValue: Ref<string[]>;
  handleEvent: EventHandler;
  modelValue: string[];
  options: OptionsType;
  valueField?: string;
  titleField?: string;
  minQueryLength: number;
  showOnInput: boolean;
  onlyDistinctValues: boolean;
}

interface MultiautocompleteExport {
  currentValue: Ref<string[]>;
  activeValue: Ref<string | null>;
  currentOptions: Ref<OptionsType>;
  filteredOptions: ComputedRef<DataContainer<OptionType>>;
  unfilteredOptions: ComputedRef<DataContainer<OptionType>>;
  searchQuery: Ref<string>;
  isPopupVisible: Ref<boolean>;
  hidePopup: (event: Event) => void;
  searchRef: Ref<null | HTMLInputElement>;
  focusInput: (event: Event) => void;
  addToCurrentValue: (value?: ValueType) => void;
  removeFromCurrentValue: (index: number) => void;
  setPrevActiveValue: () => void;
  setNextActiveValue: () => void;
  inputs: InputsShow[];
  changeCurrentValue: (index: number, value: string) => void;
  isChangeAllowed: Ref<boolean>;
  clearCurrentValue: () => void;
  addToCurrentValueWithoutEvents: (value?: ValueType) => void;
}

interface InputsShow {
  isShown: boolean;
  changed: boolean;
}

export type { MultiautocompleteConfig };

export default function useHiveMultiautocomplete({
  currentValue,
  handleEvent,
  modelValue,
  options,
  valueField,
  titleField,
  minQueryLength,
  showOnInput,
  onlyDistinctValues,
}: MultiautocompleteConfig): MultiautocompleteExport {
  const activeValue = ref<string | null>(null);
  const currentOptions = ref(options);
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
    query: currentValue as Ref<string[]>,
    onlyDistinctValues,
  });

  const {
    filtered: bufferedOptions,
    query: searchQuery,
    isChangeAllowed,
  } = useSearch<OptionType>({
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

  const isPopupVisible = ref(false);
  const searchRef = ref<null | HTMLInputElement>(null);

  const showPopup = () => {
    isPopupVisible.value = true;
  };

  const hidePopup = (event: Event) => {
    if (
      (event as FocusEvent).relatedTarget &&
      ((event as FocusEvent).relatedTarget as unknown as HTMLElement).closest(
        ".hive-multiautocomplete"
      )
    ) {
      return;
    }

    isPopupVisible.value = false;
    activeValue.value = null;
  };

  const focusInput = (event: Event) => {
    if (
      (event.target as HTMLElement).classList.contains(
        "hive-multiautocomplete__input-item"
      )
    ) {
      (searchRef.value as HTMLInputElement).blur();
      return;
    }

    if (showOnInput) {
      isPopupVisible.value = true;
    }

    (searchRef.value as HTMLInputElement).focus();
  };

  const inCurrentValue = (title: string) => {
    if (!onlyDistinctValues) {
      return false;
    }
    const value = Object.entries(unfilteredOptions.value).find(
      //@ts-ignore
      (item: string[]) => item[1].title === title
    );

    if (value) {
      return currentValue.value.includes(String(value[1].value));
    }

    return currentValue.value.includes(title);
  };

  const clearSearchQuery = () => {
    searchQuery.value = "";
    activeValue.value = null;
  };

  const inputs: InputsShow[] = reactive([]);

  const addToInputs = () => {
    if (inputs.length < currentValue.value.length) {
      inputs.push({
        isShown: true,
        changed: false,
      });
    } else {
      inputs.length = currentValue.value.length;
    }
  };

  const pushToCurrentValue = (value: string) => {
    let isValueChangeAllowed = true;
    const prevent = () => {
      isValueChangeAllowed = false;
    };
    const updateValue = (changedValue: string) => {
      value = changedValue;
    };
    handleEvent(new Event("onBeforeChange"), {
      prevent,
      value,
      updateValue,
      pushing: true,
    });
    if (isValueChangeAllowed) {
      currentValue.value.push(value);
    }
  };

  function addToCurrentValue(value?: ValueType) {
    if (value && !inCurrentValue(value as string)) {
      pushToCurrentValue(String(value));
      addToInputs();
      activeValue.value = null;
      clearSearchQuery();
      return;
    }

    if (
      isPopupVisible.value &&
      activeValue.value !== null &&
      !inCurrentValue(searchQuery.value)
    ) {
      pushToCurrentValue(activeValue.value);
      clearSearchQuery();
      addToInputs();
      return;
    }

    if (!inCurrentValue(searchQuery.value)) {
      const value = Object.entries(unfilteredOptions.value).find(
        //@ts-ignore
        (item) => item[1].title === searchQuery.value
      );

      if (value) {
        pushToCurrentValue(String(value[1].value));
        clearSearchQuery();
        addToInputs();
        return;
      }

      if (searchQuery.value === "") {
        return;
      }
      pushToCurrentValue(searchQuery.value);
      addToInputs();

      clearSearchQuery();
    } else {
      clearSearchQuery();
    }
  }

  function addToCurrentValueWithoutEvents(value?: ValueType) {
    if (value && !inCurrentValue(value as string)) {
      currentValue.value.push(String(value));
      addToInputs();
      activeValue.value = null;
      clearSearchQuery();
      return;
    }

    if (
      isPopupVisible.value &&
      activeValue.value !== null &&
      !inCurrentValue(searchQuery.value)
    ) {
      currentValue.value.push(activeValue.value);
      clearSearchQuery();
      addToInputs();
      return;
    }

    if (!inCurrentValue(searchQuery.value)) {
      const value = Object.entries(unfilteredOptions.value).find(
        //@ts-ignore
        (item) => item[1].title === searchQuery.value
      );

      if (value) {
        currentValue.value.push(String(value[1].value));
        clearSearchQuery();
        addToInputs();
        return;
      }

      if (searchQuery.value === "") {
        return;
      }
      currentValue.value.push(searchQuery.value);
      addToInputs();

      clearSearchQuery();
    } else {
      clearSearchQuery();
    }
  }

  const changeCurrentValue = (index: number, value: string) => {
    if (value === "") {
      return;
    }
    if (inCurrentValue(value)) {
      // inCurrentValue also checks if onlyDisctinctValue is true
      const val = Object.entries(unfilteredOptions.value).find(
        //@ts-ignore
        (item: string[]) => item[1].title === value
      );

      let placement = -1;

      if (val) {
        placement = currentValue.value.findIndex(
          (el) => String(val[1].value) === el
        );
      }

      if (placement === -1) {
        placement = currentValue.value.findIndex((el) => {
          return el === value;
        });
      }

      if (placement === index) {
        return;
      }

      currentValue.value[index] = value;

      let allowedToDelete = true;
      const prevent = () => {
        allowedToDelete = false;
      };

      handleEvent(new Event("onBeforeChange"), {
        prevent,
        value,
      });

      handleEvent(new Event("onBeforeDelete"), {
        value,
        index: placement,
        prevent,
      });

      if (allowedToDelete) {
        currentValue.value.splice(placement, 1);
      }
    } else {
      let isValueChangeAllowed = true;

      const prevent = () => {
        isValueChangeAllowed = false;
      };

      const updateValue = (changedValue: string) => {
        value = changedValue;
      };

      handleEvent(new Event("onBeforeChange"), {
        value,
        prevent,
        pushing: false,
        updateValue,
      });

      if (isValueChangeAllowed) {
        currentValue.value[index] = value;
      }
    }
  };

  const removeFromCurrentValue = (index: number) => {
    let allowedToDelete = true;
    const prevent = () => {
      allowedToDelete = false;
    };
    if (searchQuery.value === "" || searchQuery.value === null) {
      handleEvent(new Event("onBeforeDelete"), {
        value: currentValue.value[index],
        index,
        prevent,
      });
      if (allowedToDelete) {
        inputs.forEach((input) => (input.isShown = true));
        currentValue.value.splice(index, 1);
      }
    }
  };

  const setActiveValueToFirst = () => {
    const opts = Object.values(filteredOptions.value);

    if (!opts.length) {
      activeValue.value = null;
      return;
    }

    activeValue.value = String(opts[0].value);
  };

  const setActiveValueToLast = () => {
    const opts = Object.values(filteredOptions.value);

    if (!opts.length) {
      setActiveValueToSearchQuery();
      return;
    }

    activeValue.value = String(opts[opts.length - 1].value);
  };

  const setPrevActiveValue = () => {
    if (activeValue.value === null) {
      return;
    }

    const node = filteredOptions.value[String(activeValue.value)] ?? null;

    if (node === null) {
      setActiveValueToLast();
      return;
    }

    const prevNode = node.prev ?? null;

    if (prevNode === null) {
      return;
    }

    activeValue.value = String(prevNode.value);
  };

  const setNextActiveValue = () => {
    if (activeValue.value === null) {
      if (Object.values(filteredOptions.value).length === 0) {
        setActiveValueToSearchQuery();
        return;
      }

      setActiveValueToFirst();
      return;
    }

    const nextNode =
      filteredOptions.value[String(activeValue.value)]?.next ?? null;

    if (nextNode === null) {
      setActiveValueToSearchQuery();
      return;
    }

    activeValue.value = String(nextNode.value);
  };

  const setActiveValueToSearchQuery = () => {
    if (!searchQuery.value) {
      return;
    }

    if (filteredOptions.value[String(searchQuery.value)] !== undefined) {
      return;
    }

    activeValue.value = String(searchQuery.value);
  };

  const isActiveValueSearchQuery = () => {
    return activeValue.value === searchQuery.value;
  };

  watch(
    () => searchQuery.value,
    () => {
      showPopup();
    }
  );

  const clearCurrentValue = () => {
    let isClearAllowed = true;
    const prevent = () => {
      isClearAllowed = false;
    };
    const clearedValue = deepClone(currentValue.value);
    handleEvent(new Event("onBeforeClear"), {
      isClearAllowed,
      prevent,
    });
    if (isClearAllowed) {
      currentValue.value.length = 0;
      handleEvent(new Event("onAfterClear"), {
        clearedValue,
      });
    }
  };

  return {
    currentValue,
    activeValue,
    currentOptions,
    filteredOptions,
    unfilteredOptions,
    searchQuery,
    isPopupVisible,
    hidePopup,
    searchRef,
    focusInput,
    addToCurrentValue,
    removeFromCurrentValue,
    setPrevActiveValue,
    setNextActiveValue,
    inputs,
    changeCurrentValue,
    isChangeAllowed,
    clearCurrentValue,
    addToCurrentValueWithoutEvents,
  };
}
