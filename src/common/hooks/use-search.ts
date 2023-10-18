import { Ref } from 'vue';
import { Value } from '../types/value';

export const smartSearch = (
  input: Ref<Map<any, any>>,
  searchString: string,
  modelValue: Value | Value[],
  fieldTitle: string,
  fieldValue: string,
  filteredOptions: Ref<Map<any, any>>,
) => {
  if (!searchString) {
    filteredOptions.value = new Map(JSON.parse(JSON.stringify([...input.value])));
  }
  filteredOptions.value.clear();

  searchString = searchString.toLowerCase();

  const words = searchString.replace(/[ \t\n]+/, ' ').split(' ');

  for (const item of input.value.values()) {
    if (item.id === null || item[fieldTitle] === null) {
      continue;
    }

    const matchCount = words
      .map((word) =>
        Number(
          item[fieldTitle]
            .toLowerCase()
            .replace(/[ \t\n]+/, ' ')
            .split(' ')
            .reduce((partialSum: boolean, a: string) => partialSum || a.startsWith(word), false),
        ),
      )
      .reduce((partialSum, a) => partialSum + a, 0);

    if (matchCount === words.length) {
      if (Array.isArray(modelValue)) {
        if (!modelValue.includes(item[fieldValue])) {
          filteredOptions.value.set(item[fieldValue], item);
        }
      } else {
        filteredOptions.value.set(item[fieldValue], item);
      }
    }
    console.log(filteredOptions.value);
  }
};
