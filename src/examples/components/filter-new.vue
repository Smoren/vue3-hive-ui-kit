<script setup lang="ts">
import { computed, watch } from 'vue';
import { HiveMultiautocomplete, HiveMultiselect, HiveButton } from '../../index';
import { useFilterStore } from '../stores/cityhaze';
import { getDefaultOwnerId } from '../stores/helpers';
import type { FilterConfig } from '../services/types';

const emit = defineEmits<{
  (e: 'submit', filterConfig: FilterConfig): void;
}>();

const filterStore = useFilterStore(getDefaultOwnerId());

const submitForm = () => {
  console.log(filterStore.getFilterConfig());
  emit('submit', filterStore.getFilterConfig());
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key == 'Enter') {
    submitForm();
  }
});

const handleFormulaOnSearch = (value: string) => {
  filterStore.loadFormulaOptions(value);
};

const handleFormulaOnChange = () => {
  filterStore.loadDefaultFormulaOptions();
};

const handleFormulaOnKeydown = (event: Event) => {
  //@ts-ignore
  if (event.data?.event?.key === ' ') {
    // TODO
    // if (event.component.searchQuery.trim() !== "") {
    //   event.component.addToCurrentValue();
    // }
    //@ts-ignore
    event.data?.prevent();
  }
};

const handleAuthorsOnSearch = (value: string) => {
  filterStore.loadAuthors(value);
};

const handleTagsOnSearch = (value: string) => {
  if (value !== '') {
    filterStore.loadTags(value);
  }
};

const formulaValues = computed(() => filterStore.formulaValues);
const formulaOptions = computed(() => filterStore.formulaOptions);

const categoriesValues = computed(() => filterStore.categoriesValues);
const categoriesOptions = computed(() => filterStore.categoriesOptions);

const authorsValues = computed(() => filterStore.authorsValues);
const authorsOptions = computed(() => filterStore.authorsOptions);

const tagsValues = computed(() => filterStore.tagsValues);
const tagsOptions = computed(() => filterStore.tagsOptions);
</script>

<template>
  <div class="alert alert-warning" v-if="filterStore.warningMessage" role="alert" style="width: 100%">
    {{ filterStore.warningMessage }}
  </div>
  <div class="fields">
    <div class="field">
      <span class="field-title">Формула</span>
      <hive-multiautocomplete
        placeholder="Введите формулу..."
        v-model="formulaValues"
        :options="formulaOptions"
        :show-on-input="true"
        :distinct="false"
        @search="handleFormulaOnSearch"
        @change="handleFormulaOnChange"
        @keydown="handleFormulaOnKeydown"
      ></hive-multiautocomplete>
    </div>
    <div class="field">
      <span class="field-title">Категории</span>
      <hive-multiselect
        placeholder="Введите категорию..."
        v-model="categoriesValues"
        :options="categoriesOptions"
        title-field="name"
        value-field="value"
      />
    </div>
    <div class="field">
      <span class="field-title">Авторы</span>
      <hive-multiselect
        placeholder="Введите имя автора..."
        v-model="authorsValues"
        :options="authorsOptions"
        title-field="name"
        value-field="name"
        @search="handleAuthorsOnSearch"
      />
    </div>
    <div class="field">
      <span class="field-title">Теги</span>
      <hive-multiselect
        placeholder="Введите тег..."
        v-model="tagsValues"
        :options="tagsOptions"
        title-field="name"
        value-field="name"
        @search="handleTagsOnSearch"
      />
    </div>
    <div class="dates">
      <div>
        <div>Дата начала поиска</div>
        <hive-input-date v-model="filterStore.dateFromValue" />
      </div>
      <div>
        <div>Дата конца поиска</div>
        <hive-input-date v-model="filterStore.dateUntilValue" />
      </div>
    </div>
    <faq />
    <hive-button class="button" @click="submitForm" text="Поиск" />
  </div>
</template>

<style scoped lang="scss">
.fields {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: column;
  width: 100%;

  .field {
    width: 100%;

    &-title {
      font-size: 16px;
    }
  }

  .button {
    height: 100%;
  }
}

.dates {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
}

.dates > div {
  width: 100%;
}

@media (max-width: 768px) {
  .dates {
    display: flex;
    flex-direction: column;
  }
}
</style>
