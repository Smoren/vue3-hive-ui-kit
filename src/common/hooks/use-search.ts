import { Ref } from 'vue';
import { Value } from '../types/value';

export const useSearch = (
  input: Ref<Map<any, any>>,
  searchString: string,
  modelValue: Value | Value[],
  fieldTitle: string,
  fieldValue: string,
  filteredOptions: Ref<Map<any, any>>,
  distinct: boolean,
  withNull: boolean,
) => {
  if (!searchString) {
    filteredOptions.value = new Map(JSON.parse(JSON.stringify([...input.value])));
  }
  filteredOptions.value.clear();

  if (typeof searchString === 'string') {
    searchString = searchString.toLowerCase();
  }

  const words = searchString.replace(/[ \t\n]+/, ' ').split(' ');
  let prev = null;

  for (const item of input.value.values()) {
    if (!withNull && (item.id === null || item[fieldTitle] === null)) {
      continue;
    }

    const matchCount = words
      .map((word) =>
        Number(
          String(item[fieldTitle])
            .toLowerCase()
            .replace(/[ \t\n]+/, ' ')
            .split(' ')
            .reduce((partialSum: boolean, a: string) => partialSum || a.startsWith(word), false),
        ),
      )
      .reduce((partialSum, a) => partialSum + a, 0);

    if (matchCount === words.length) {
      if (Array.isArray(modelValue)) {
        if (!distinct || !modelValue.includes(item[fieldValue])) {
          if (prev) {
            item.prev = prev[fieldValue];
            prev.next = item[fieldValue];
          }
          filteredOptions.value.set(item[fieldValue], item);
          prev = item;
        }
      } else {
        if (prev) {
          item.prev = prev[fieldValue];
          prev.next = item[fieldValue];
        }
        filteredOptions.value.set(item[fieldValue], item);
        prev = item;
      }
    }
  }
};
