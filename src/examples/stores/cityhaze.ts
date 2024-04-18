import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { PostAuthor, PostTag, ChoiceOption, FilterConfig } from '../services/types';
import { mainApi } from '@/examples/services/cityhaze';
import { fromBase64, toBase64 } from './helpers';

const _useFilterStore = defineStore('filter', () => {
  const ownerId: Ref<number> = ref(0);
  const defaultFormulaOptions = ['И', 'ИЛИ', 'НЕ', '(', ')', '<->', '<2>'];
  const formulaOptions: Ref<string[]> = ref([...defaultFormulaOptions]);
  const formulaValues: Ref<string[]> = ref([]);

  const categoriesOptions: Ref<ChoiceOption[]> = ref([
    { name: 'проза', value: 'сказка' },
    { name: 'стихи', value: 'стихи' },
    { name: 'мнимая проза', value: 'мнимая_проза' },
    { name: 'аудиоверсия', value: 'аудиоверсия' },
    { name: 'городской бестиарий', value: 'городской_бестиарий' },
    { name: 'ночной эфир', value: 'ночной_эфир' },
    { name: 'десять сказок о', value: 'десять_сказок_о' },
    { name: 'мини-конкурс', value: 'миниконкурс' },
    { name: 'Игра в одиноком октябре', value: 'Игра_в_одиноком_октябре' },
  ]);
  const categoriesValues: Ref<string[]> = ref(['стихи', 'мнимая_проза', 'Игра_в_одиноком_октябре', 'ночной_эфир']);

  const authorsOptions: Ref<PostAuthor[]> = ref([]);
  const authorsValues: Ref<string[]> = ref([]);

  const tagsOptions: Ref<PostTag[]> = ref([]);
  const tagsValues: Ref<string[]> = ref([]);

  const dateFromValue: Ref<number | null> = ref(null);
  const dateUntilValue: Ref<number | null> = ref(null);

  const warningMessage = ref('');
  const warningTimeout: Ref<number> = ref(-1);

  const setOwnerId = (id: number) => {
    ownerId.value = id;
  };

  async function loadFormulaOptions(query: string) {
    const predictions = await mainApi.getFormulaPredictions(query);
    formulaOptions.value = [...predictions, ...defaultFormulaOptions];
    console.log(query);
  }

  async function loadDefaultFormulaOptions() {
    formulaOptions.value = defaultFormulaOptions;
  }

  async function loadAuthors(query: string) {
    authorsOptions.value = await mainApi.getAuthorList(ownerId.value, query);
  }

  async function loadTags(query: string) {
    tagsOptions.value = await mainApi.getTagList(ownerId.value, query);
  }

  const addTag = (tag: string): void => {
    if (tagsValues.value.includes(tag)) {
      warningMessage.value = 'уже добавлено';
      clearTimeout(warningTimeout.value);
      // @ts-ignore
      warningTimeout.value = setTimeout(() => (warningMessage.value = ''), 2000) as number;
    } else {
      tagsValues.value.push(tag);
    }
  };

  const addAuthor = (author: string): void => {
    if (authorsValues.value.includes(author)) {
      warningMessage.value = 'уже добавлено';
      clearTimeout(warningTimeout.value);
      // @ts-ignore
      warningTimeout.value = setTimeout(() => (warningMessage.value = ''), 2000);
    } else {
      authorsValues.value.push(author);
    }
  };

  const importForm = (hash: string): boolean => {
    if (!hash || hash === '#') {
      return false;
    }

    try {
      const hashValue = hash.slice(1);
      const result = JSON.parse(fromBase64(hashValue));

      formulaValues.value = result.formula;
      categoriesValues.value = result.categories;
      authorsValues.value = result.authors;
      tagsValues.value = result.tags;
      dateFromValue.value = result.dateFrom;
      dateUntilValue.value = result.dateUntil;

      return true;
    } catch (e) {
      console.warn('cannot parse hash');
      return false;
    }
  };

  const exportForm = (): string => {
    const data = {
      formula: formulaValues.value,
      categories: categoriesValues.value,
      authors: authorsValues.value,
      tags: tagsValues.value,
      dateFrom: dateFromValue.value,
      dateUntil: dateUntilValue.value,
    };

    let isEmpty = true;
    // @ts-ignore
    Object.values(data).map((item) => {
      if (item instanceof Array && item.length) {
        isEmpty = false;
        return;
      }

      if (!(item instanceof Array) && item !== null) {
        isEmpty = false;
      }
    });

    if (isEmpty) {
      return '';
    }

    return '#' + toBase64(JSON.stringify(data));
  };

  const getFilterConfig = (): FilterConfig => {
    return {
      command: formulaValues.value,
      authors: authorsValues.value,
      tags: tagsValues.value,
      categories: categoriesValues.value,
      date_from: dateFromValue.value !== null ? Math.round(dateFromValue.value / 1000) : null,
      date_until: dateUntilValue.value !== null ? Math.round(dateUntilValue.value / 1000) + 3600 * 24 : null,
    };
  };

  return {
    formulaOptions,
    formulaValues,
    categoriesOptions,
    categoriesValues,
    authorsOptions,
    authorsValues,
    tagsOptions,
    tagsValues,
    dateFromValue,
    dateUntilValue,
    warningMessage,
    setOwnerId,
    loadFormulaOptions,
    loadDefaultFormulaOptions,
    loadAuthors,
    loadTags,
    addTag,
    addAuthor,
    getFilterConfig,
    importForm,
    exportForm,
  };
});

export const useFilterStore = (ownerId: number) => {
  const store = _useFilterStore();
  store.setOwnerId(ownerId);
  return store;
};
