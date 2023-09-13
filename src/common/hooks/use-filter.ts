import { ref } from 'vue';
import { CurrentOptions, CurrentOptionsRef, Options, Value } from '@/common/types/select';

export type FilterConfig = {
  options: Options | undefined;
  modelValue: Value;
  fieldTitle: string;
  fieldValue: string;
  withUndefined?: boolean;
  withNull?: boolean;
  nullTitle?: string;
};

export const useFilter = ({
  options,
  modelValue,
  withUndefined = false,
  withNull = false,
  nullTitle = '',
  fieldTitle,
  fieldValue,
}: FilterConfig) => {
  const currentOptions = ref(new Map());
  const filteredOptions = ref(new Map());
  const nullOption: CurrentOptionsRef = ref({
    [fieldTitle]: nullTitle,
    [fieldValue]: withUndefined ? undefined : null,
    prev: null,
    next: null,
  });

  const first: CurrentOptions = {
    [fieldTitle]: String(modelValue) || '',
    [fieldValue]: modelValue,
    prev: null,
    next: null,
  };

  if (options) {
    let prev;

    if (withNull || withUndefined) {
      filteredOptions.value.set('none', nullOption.value);
      currentOptions.value.set('none', nullOption.value);

      prev = 'none';
    }

    if (Array.isArray(options)) {
      for (const option of options) {
        if (typeof option === 'object') {
          let key = option[fieldValue];

          if (key === null) key = 'none';

          if (currentOptions.value.has(key)) {
            continue;
          }

          if (prev !== undefined) {
            const temp = filteredOptions.value.get(prev);
            filteredOptions.value.set(prev, { ...temp, next: key });
            filteredOptions.value.set(key, { ...option, prev, next: null });
            currentOptions.value.set(prev, { ...temp, next: key });
            currentOptions.value.set(key, { ...option, prev, next: null });
            prev = key;
          } else {
            filteredOptions.value.set(key, { ...option, prev: null, next: null });
            currentOptions.value.set(key, { ...option, prev: null, next: null });
            prev = key;
          }
        } else {
          if (currentOptions.value.has(String(option))) {
            continue;
          }

          if (prev !== undefined) {
            const temp = filteredOptions.value.get(prev);
            filteredOptions.value.set(prev, { ...temp, next: String(option) });
            filteredOptions.value.set(String(option), { title: String(option), value: option, prev, next: null });
            currentOptions.value.set(prev, { ...temp, next: String(option) });
            currentOptions.value.set(String(option), { title: String(option), value: option, prev, next: null });
            prev = String(option);
          } else {
            filteredOptions.value.set(String(option), { title: String(option), value: option, prev: null, next: null });
            currentOptions.value.set(String(option), { title: String(option), value: option, prev: null, next: null });
            prev = String(option);
          }
        }
      }
    } else if (typeof options === 'object') {
      for (const key in options) {
        if (prev !== undefined) {
          const temp = filteredOptions.value.get(prev);
          filteredOptions.value.set(prev, { ...temp, next: key });
          filteredOptions.value.set(key, { ...(options[key] as object), prev, next: null });
          currentOptions.value.set(prev, { ...temp, next: key });
          currentOptions.value.set(key, { ...(options[key] as object), prev, next: null });
          prev = key;
        } else {
          filteredOptions.value.set(key, { ...(options[key] as object), prev: null, next: null });
          currentOptions.value.set(key, { ...(options[key] as object), prev: null, next: null });
          prev = key;
        }
      }
    }
  } else {
    filteredOptions.value.set(String(modelValue), first);
    currentOptions.value.set(String(modelValue), first);
  }

  return {
    filteredOptions,
    currentOptions,
    nullOption,
  };
};
