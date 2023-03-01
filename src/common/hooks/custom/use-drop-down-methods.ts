import { type Ref, ref } from 'vue';
import type { ValueType } from '@hive/common/types';
import type {
  ActiveValueType,
  FilteredOptionsType,
  OptionType,
} from '@hive/components/hive-multiselect/hooks/use-hive-multiselect';
import type { DataContainerNode } from '@hive/common/hooks/base/use-data-container';

interface DropDownListsCommonMethodsConfig {
  searchQuery: Ref<string>;
  activeValue: ActiveValueType;
  currentValue?: Ref<ValueType | null>;
  filteredOptions: FilteredOptionsType;
  handleEvent: (event: Event) => void;
}

interface DropDownListsCommonMethodsExport {
  isExpanded: Ref<boolean>;
  searchRef: Ref<null>;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  updateActiveValue: (value: ValueType) => void;
  setActiveValueToFirst: () => void;
  setPrevActiveValue: () => void;
  setNextActiveValue: () => void;
  onAppear: (option: DataContainerNode<OptionType>) => void;
  onDisappear: (option: DataContainerNode<OptionType>) => void;
}

export type { DropDownListsCommonMethodsConfig, DropDownListsCommonMethodsExport };

export default function useDropDownMethods({
  searchQuery,
  activeValue,
  currentValue = ref(null),
  filteredOptions,
}: DropDownListsCommonMethodsConfig): DropDownListsCommonMethodsExport {
  const isExpanded = ref(false);
  const searchRef = ref(null);

  const expand = () => {
    isExpanded.value = true;

    if (currentValue.value) {
      activeValue.value = currentValue.value;
    }
  };
  const collapse = () => {
    isExpanded.value = false;
    searchQuery.value = '';
    (searchRef.value as unknown as HTMLElement)?.blur();
  };
  const toggle = () => {
    if (!isExpanded.value) {
      setTimeout(() => (searchRef.value as unknown as HTMLElement).focus());
    }
  };

  const updateActiveValue = (value: ValueType) => {
    activeValue.value = value;
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
      updateActiveValue(node.value as ValueType);
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
      updateActiveValue(node.value as ValueType);
    }
  };

  const onAppear = (option: DataContainerNode<OptionType>) => {
    option.visible = true;
  };
  const onDisappear = (option: DataContainerNode<OptionType>) => {
    option.visible = false;
  };

  return {
    isExpanded,
    searchRef,
    expand,
    collapse,
    toggle,
    updateActiveValue,
    setActiveValueToFirst,
    setPrevActiveValue,
    setNextActiveValue,
    onAppear,
    onDisappear,
  };
}
