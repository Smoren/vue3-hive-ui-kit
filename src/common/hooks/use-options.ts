import { ref } from 'vue';
import type { Options } from '@/common/types/option';
import { CurrentOptions, CurrentOptionsRef, Value } from '@/common/types/select';

export type OptionsConfig = {
  options: Options | undefined;
  modelValue: Value | Value[];
  fieldTitle: string;
  fieldValue: string;
  withUndefined?: boolean;
  withNull?: boolean;
  nullTitle?: string;
};

export const useOptions = ({
  options,
  modelValue,
  withUndefined = false,
  withNull = false,
  nullTitle = '',
  fieldTitle,
  fieldValue,
}: OptionsConfig) => {
  const currentOptions = ref(new Map());
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
            const temp = currentOptions.value.get(prev);
            currentOptions.value.set(prev, { ...temp, next: key });
            currentOptions.value.set(key, { ...option, prev, next: null });
            prev = key;
          } else {
            currentOptions.value.set(key, { ...option, prev: null, next: null });
            prev = key;
          }
        } else {
          if (currentOptions.value.has(String(option))) {
            continue;
          }

          if (prev !== undefined) {
            const temp = currentOptions.value.get(prev);
            currentOptions.value.set(prev, { ...temp, next: String(option) });
            currentOptions.value.set(String(option), { title: String(option), value: option, prev, next: null });
            prev = String(option);
          } else {
            currentOptions.value.set(String(option), { title: String(option), value: option, prev: null, next: null });
            prev = String(option);
          }
        }
      }
    } else if (typeof options === 'object') {
      for (const key in options) {
        if (prev !== undefined) {
          const temp = currentOptions.value.get(prev);
          currentOptions.value.set(prev, { ...temp, next: key });
          currentOptions.value.set(key, { ...(options[key] as object), prev, next: null });
          prev = key;
        } else {
          currentOptions.value.set(key, { ...(options[key] as object), prev: null, next: null });
          prev = key;
        }
      }
    }
  } else {
    currentOptions.value.set(String(modelValue), first);
  }

  return {
    currentOptions,
    nullOption,
  };
};
