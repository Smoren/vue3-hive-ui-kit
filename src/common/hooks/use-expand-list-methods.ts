import { Ref, ref, computed } from 'vue';
import { InputExpose } from '@/components/hive-input/hive-input.vue';
import { ActiveValue, Value } from '../types/value';
import { Option, FilteredOptions } from '../types/option';
import { DataContainerNode } from '../types/data-container';

export interface ExpandListsCommonMethodsConfig {
  searchQuery: Ref<string>;
  activeValue: ActiveValue;
  currentValue?: Ref<Value | null>;
  filteredOptions: FilteredOptions;
  handleEvent?: (event: Event) => void;
}

export interface ExpandListsCommonMethodsExport {
  isExpanded: Ref<boolean>;
  searchRef: Ref<InputExpose | null>;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  updateActiveValue: (value: Value) => void;
  setActiveValueToFirst: () => void;
  setPrevActiveValue: () => void;
  setNextActiveValue: () => void;
  onAppear: (option: DataContainerNode<Option>) => void;
  onDisappear: (option: DataContainerNode<Option>) => void;
}

export const useExpandListMethods = ({
  searchQuery,
  activeValue,
  currentValue = ref(null),
  filteredOptions,
}: ExpandListsCommonMethodsConfig): ExpandListsCommonMethodsExport => {
  const isExpanded = ref(false);
  const searchRef: Ref<InputExpose | null> = ref(null);

  const searchInput = computed(() => searchRef.value?.input);

  const expand = () => {
    isExpanded.value = true;

    if (currentValue.value) {
      activeValue.value = currentValue.value;
    }
  };

  const collapse = () => {
    isExpanded.value = false;
    searchQuery.value = '';
    searchInput.value?.blur();
  };

  const toggle = () => {
    if (!isExpanded.value) {
      setTimeout(() => searchInput.value?.focus());
    }
  };

  const updateActiveValue = (value: Value) => {
    activeValue.value = value;
  };

  const setActiveValueToFirst = () => {
    const opts = Object.values(filteredOptions.value);

    if (!opts.length) {
      activeValue.value = null;
    } else if (!filteredOptions.value[String(activeValue.value)]) {
      activeValue.value = opts[0].value as Value;
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
      updateActiveValue(node.value as Value);
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
      updateActiveValue(node.value as Value);
    }
  };

  const onAppear = (option: DataContainerNode<Option>) => {
    option.visible = true;
  };
  const onDisappear = (option: DataContainerNode<Option>) => {
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
