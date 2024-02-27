import { Ref, computed, ref, watch } from 'vue';
import type { InputExpose } from '@/components/hive-input/hive-input.vue';
import type { Options } from '@/common/types/option';
import { Value, CurrentOptionsRef } from '@/common/types/select';
import { useOptions } from '@/common/hooks/use-options';
import { useSearch } from './use-search';

export type ListMethodsConfig = {
  options: Options | undefined;
  modelValue: Value | Value[];
  withUndefined: boolean;
  withNull: boolean;
  nullTitle: string;
  fieldTitle: string;
  fieldValue: string;
  autocomplete?: boolean;
  distinct?: boolean;
};

export const useListMethods = ({
  options,
  modelValue,
  withUndefined,
  withNull,
  nullTitle,
  fieldTitle,
  fieldValue,
  distinct = true,
}: ListMethodsConfig) => {
  const isExpanded = ref(false);
  const activeValue: Ref<Value | undefined> = ref();
  const currentValue: Ref<Value | Value[] | undefined> = ref(modelValue);
  const current: CurrentOptionsRef = ref();
  const searchQuery = ref('');
  const searchRef: Ref<InputExpose | null> = ref(null);
  const menuRef: Ref<HTMLDivElement | null> = ref(null);
  const searchInput = computed(() => searchRef.value?.input);

  const { currentOptions, nullOption } = useOptions({
    options,
    modelValue,
    withUndefined,
    withNull,
    nullTitle,
    fieldTitle,
    fieldValue,
  });

  const filteredOptions = ref(new Map(currentOptions.value));

  const applyDistinct = () => {
    for (let key of filteredOptions.value.keys()) {
      if (Array.isArray(modelValue) && modelValue.includes(key)) {
        const next = filteredOptions.value.get(key).next;
        const prev = filteredOptions.value.get(key).prev;
        if (next) {
          filteredOptions.value.get(next).prev = prev;
        }
        if (prev) {
          filteredOptions.value.get(prev).next = next;
        }
        filteredOptions.value.delete(key);
      }
    }
  };

  if (distinct) {
    applyDistinct();
  }

  if (withNull || withUndefined) {
    current.value = nullOption.value;
  }

  if (filteredOptions.value) {
    let key = modelValue;
    if (modelValue === null || modelValue === undefined) key = 'none';
    current.value = filteredOptions.value.get(key);
  }

  const updateActiveValue = (value: Value) => {
    activeValue.value = value;
    let element = menuRef.value?.querySelector(`[data-value='${value}']`);
    console.log(element, value);
    if (element) {
      (element as unknown as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const updateCurrentValue = (value: Value | undefined) => {
    currentValue.value = value;

    if (value === undefined || value === null) {
      current.value = nullOption.value;
    } else {
      current.value = filteredOptions.value.get(value);
    }

    collapse();
  };

  const expand = () => {
    isExpanded.value = true;

    if (currentValue.value && !Array.isArray(currentValue.value)) {
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

  watch(searchQuery, () => {
    useSearch(currentOptions, searchQuery.value, modelValue, fieldTitle, fieldValue, filteredOptions);
  });

  watch(filteredOptions, () => {
    useSearch(currentOptions, searchQuery.value, modelValue, fieldTitle, fieldValue, filteredOptions);
  });

  const setPrevActiveValue = () => {
    const node = filteredOptions.value.get(activeValue.value);

    if (node?.prev !== undefined) {
      updateActiveValue(node.prev);
    } else {
      let i = 0;
      const size = filteredOptions.value.size;
      for (const key of filteredOptions.value.keys()) {
        i = i + 1;
        if (i === size) {
          updateActiveValue(key);
          break;
        }
      }
    }
  };

  const setNextActiveValue = () => {
    const node = filteredOptions.value.get(activeValue.value);

    if (node === undefined) {
      for (const key of filteredOptions.value.keys()) {
        updateActiveValue(key);
        break;
      }
    } else {
      updateActiveValue(node.next);
    }
  };

  return {
    isExpanded,
    activeValue,
    updateActiveValue,
    currentValue,
    current,
    updateCurrentValue,
    searchQuery,
    searchRef,
    searchInput,
    expand,
    collapse,
    toggle,
    filteredOptions,
    currentOptions,
    setPrevActiveValue,
    setNextActiveValue,
    menuRef,
  };
};
