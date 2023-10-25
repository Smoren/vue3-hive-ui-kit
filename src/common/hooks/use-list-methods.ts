import { Ref, computed, ref, toRaw, watch } from 'vue';
import { InputExpose } from '@/components/hive-input/hive-input.vue';
import { Value, Options, CurrentOptionsRef } from '@/common/types/select';
import { useOptions } from '@/common/hooks/use-options';
import { smartSearch } from './use-search';

export type ListMethodsConfig = {
  options: Options | undefined;
  modelValue: Value | Value[];
  withUndefined: boolean;
  withNull: boolean;
  nullTitle: string;
  fieldTitle: string;
  fieldValue: string;
  autocomplete?: boolean;
};

export const useListMethods = ({
  options,
  modelValue,
  withUndefined,
  withNull,
  nullTitle,
  fieldTitle,
  fieldValue,
  autocomplete = false,
}: ListMethodsConfig) => {
  const isExpanded = ref(false);
  const activeValue: Ref<Value | undefined> = ref();
  const currentValue: Ref<Value | Value[] | undefined> = ref(modelValue);
  const current: CurrentOptionsRef = ref();
  const searchQuery = ref('');
  const searchRef: Ref<InputExpose | null> = ref(null);
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

  const distinct = () => {
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

  distinct();

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
  };

  const updateCurrentValue = (value: Value | undefined) => {
    currentValue.value = value;

    if (value === undefined || value === null) {
      current.value = nullOption.value;
    } else if (autocomplete) {
      // current.value = value;
    } else {
      let key = value;
      current.value = filteredOptions.value.get(key);
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
    smartSearch(currentOptions, searchQuery.value, modelValue, fieldTitle, fieldValue, filteredOptions);

    // if (searchQuery.value) {
    //   filteredOptions.value.clear();

    //   for (const item of currentOptions.value.values()) {
    //     if (item[1][fieldTitle].toLowerCase().indexOf(searchQuery.value.toLowerCase()) !== -1) {
    //       if (Array.isArray(modelValue)) {
    //         if (!modelValue.includes(item[1][fieldValue])) {
    //           filteredOptions.value.set(item[1][fieldValue], item[1]);
    //         }
    //       } else {
    //         filteredOptions.value.set(item[1][fieldValue], item[1]);
    //       }
    //     }
    //   }
    // } else {
    //   filteredOptions.value = new Map(JSON.parse(JSON.stringify([...currentOptions.value])));
    //   distinct();
    // }
  });

  const setPrevActiveValue = () => {
    const node = filteredOptions.value.get(activeValue.value);

    if (node?.prev !== undefined) {
      updateActiveValue(node.prev);
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
  };
};
