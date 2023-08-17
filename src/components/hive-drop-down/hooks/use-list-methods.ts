import { Ref, computed, ref, watch } from 'vue';
import { InputExpose } from '@/components/hive-input/hive-input.vue';
import { Value, Options, CurrentOptionsRef } from '@/common/types/select';
import { useFilter } from './use-filter';

export type ListMethodsConfig = {
  options: Options | undefined;
  modelValue: Value;
  withUndefined: boolean;
  withNull: boolean;
  nullTitle: string;
  fieldTitle: string;
  fieldValue: string;
};

export const useListMethods = ({
  options,
  modelValue,
  withUndefined,
  withNull,
  nullTitle,
  fieldTitle,
  fieldValue,
}: ListMethodsConfig) => {
  const isExpanded = ref(false);
  const activeValue: Ref<Value | undefined> = ref();
  const currentValue: Ref<Value | undefined> = ref();
  const current: CurrentOptionsRef = ref();
  const searchQuery = ref('');
  const searchRef: Ref<InputExpose | null> = ref(null);
  const searchInput = computed(() => searchRef.value?.input);

  const { filteredOptions, currentOptions, nullOption } = useFilter({
    options,
    modelValue,
    withUndefined,
    withNull,
    nullTitle,
    fieldTitle,
    fieldValue,
  });

  if (withNull || withUndefined) {
    console.log('with');
    
    current.value = nullOption.value;
  }

  if (modelValue !== undefined && filteredOptions.value) {
    // if (modelValue !== null) {
    current.value = filteredOptions.value.get(modelValue);
    console.log('model', current.value);
    // }
  }

  const updateActiveValue = (value: Value) => {
    activeValue.value = value;
  };

  const updateCurrentValue = (value: Value | undefined) => {
    currentValue.value = value;

    if (value === undefined || (value === null && withNull)) {
      console.log('value');
      
      current.value = nullOption.value;
    } else {
      let key = value;
      if (value === null && !withNull) key = 'none';
      current.value = filteredOptions.value.get(key);
    }

    collapse();
  };

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

  watch(searchQuery, () => {
    if (searchQuery.value) {
      filteredOptions.value.clear();

      for (const item of currentOptions.value) {
        if (item[1][fieldTitle].indexOf(searchQuery.value) !== -1) {
          filteredOptions.value.set(item[1][fieldValue], item[1]);
        }
      }
    } else {
      filteredOptions.value = new Map(JSON.parse(JSON.stringify([...currentOptions.value])));
    }
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
