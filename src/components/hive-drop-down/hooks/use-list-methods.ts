import { Ref, computed, ref, watch } from 'vue';
import { InputExpose } from '@/components/hive-input/hive-input.vue';
import { Value, Option } from '@/common/types/select';

export type ListMethodsConfig = {
  options: Option[];
  modelValue: Value;
  withNull: boolean;
  nullTitle: string;
  fieldTitle: string;
  fieldValue: string;
};

export const useListMethods = ({
  options,
  modelValue,
  withNull,
  nullTitle,
  fieldTitle,
  fieldValue,
}: ListMethodsConfig) => {
  const isExpanded = ref(false);
  const activeValue: Ref<Value | undefined> = ref();
  const currentValue: Ref<Value | undefined> = ref();
  const current: Ref<Option | undefined> = ref();
  const searchQuery = ref('');
  const searchRef: Ref<InputExpose | null> = ref(null);
  const searchInput = computed(() => searchRef.value?.input);
  const currentOptions = ref(new Map());
  const filteredOptions = ref(new Map());
  const nullOption = ref({
    [fieldTitle]: nullTitle,
    [fieldValue]: null,
    prev: null,
    next: null,
  });

  if (options) {
    let prev;

    if (withNull) {
      filteredOptions.value.set('null', nullOption.value);
      currentOptions.value.set('null', nullOption.value);

      prev = 'null';
    }

    for (const option of options) {
      if (prev) {
        const temp = filteredOptions.value.get(prev);
        filteredOptions.value.set(prev, { ...temp, next: option[fieldValue] });
        filteredOptions.value.set(option[fieldValue], { ...option, prev });
        currentOptions.value.set(prev, { ...temp, next: option[fieldValue] });
        currentOptions.value.set(option[fieldValue], { ...option, prev });
      } else {
        filteredOptions.value.set(option[fieldValue], { ...option, prev: null });
        currentOptions.value.set(option[fieldValue], { ...option, prev: null });
      }
    }
  }

  if (withNull) {
    current.value = nullOption.value;
  }

  if (modelValue) {
    current.value = filteredOptions.value.get(modelValue);
  }

  const updateActiveValue = (value: Value) => {
    activeValue.value = value;
  };

  const updateCurrentValue = (value: Value | undefined) => {
    if (!value) {
      collapse();
      return;
    }

    currentValue.value = value;
    current.value = filteredOptions.value.get(value);
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

  const setPrevActiveValue = () => {};
  const setNextActiveValue = () => {};

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
