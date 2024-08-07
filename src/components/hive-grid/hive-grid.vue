<script setup lang="ts">
import { ref, type Ref, WritableComputedRef, watch, onMounted, getCurrentInstance, useSlots, computed } from 'vue';
import useHiveGrid from './hooks/use-hive-grid';
import { CommonProps } from '@/common/types/props';
import {
  Focusin,
  Focusout,
  Keydown,
  Mount,
  Search,
  Unmount,
  Update,
  QueryUpdate,
  AfterEdit,
  AfterChange,
  onQueryUpdate,
  RowClick,
  onRowClick,
  BeforeEdit,
  BeforeChange,
  onAfterEdit,
  onAfterChange,
  onBeforeEdit,
  onBeforeChange,
  UpdatePage,
  Event,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import type { Value } from '@/common/types/select';
import HiveGridHeader from './hive-grid-header.vue';
import HiveGridCell from './hive-grid-cell.vue';
import HiveInput from '../hive-input/hive-input.vue';
import HiveDropDown from '../hive-drop-down/hive-drop-down.vue';
import HiveAutocomplete from '../hive-autocomplete/hive-autocomplete.vue';
import HiveTextarea from '../hive-textarea/hive-textarea.vue';
import HiveButton from '../hive-button/hive-button.vue';
import HiveMultiselect from '../hive-multiselect/hive-multiselect.vue';
import HiveCheckbox from '../hive-checkbox/hive-checkbox.vue';
import HiveGridRow from './hive-grid-row.vue';
import { VueComponent } from '../../../src/common/types/value';
import type { GridColumns, GridConfig } from './types';
import { filterItems } from './hooks/use-filter';
import { CssClassConfig } from './types';
import { ComponentPublicInstance } from 'vue';

interface Props extends CommonProps {
  dataItems: any[] | undefined;
  columns: GridColumns[];
  itemsOnPage?: number;
  showAddButtons?: boolean;
  hasFilter?: boolean;
  colorAlternation?: boolean;
  hideHeader?: boolean;
  query?: string;
  filterFields?: string[];
  filterCaseSensitive?: boolean;
  page?: number;
  rowCssClass?: CssClassConfig;
  extensionFields?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  showAddButtons: false,
  itemsOnPage: 10,
  hasFilter: false,
  colorAlternation: true,
  hideHeader: false,
  query: '',
  page: 1,
});

type Emit = Event &
  Mount &
  Unmount &
  Update<Value> &
  Focusin &
  Focusout &
  Keydown &
  Search<string> &
  QueryUpdate &
  RowClick<typeof HiveGridRow> &
  AfterChange &
  AfterEdit &
  BeforeEdit &
  BeforeChange &
  UpdatePage;
const emit = defineEmits<Emit>();
useOnMount(emit);

const loaded = ref(false);

const incomeData = ref(props.dataItems);

watch(
  () => props.dataItems,
  () => {
    incomeData.value = props.dataItems;
  },
  { deep: true },
);

const { items, sort, deleteRow, itemsLength, addRow, isLoading } = useHiveGrid({
  columns: props.columns,
  dataItems: incomeData,
  extensionFields: props.extensionFields,
} as GridConfig);

const pagginatedItems: Ref<Record<string, any>[][]> = ref([]);
const currentPage = ref(props.page);
const prevPage = (page?: number) => {
  if (currentPage.value === 1) return;
  page === undefined ? currentPage.value-- : (currentPage.value = page);
};

const nextPage = (page?: number) => {
  if (currentPage.value === pagginatedItems.value.length) return;
  page === undefined ? currentPage.value++ : (currentPage.value = page);
};

const paginateItems = (items: WritableComputedRef<object[]>) => {
  pagginatedItems.value.length = 0;
  if (props.itemsOnPage === 0) return;
  for (let i = 0; i < items.value.length / props.itemsOnPage; i++) {
    pagginatedItems.value.push(items.value.slice(i * props.itemsOnPage, i * props.itemsOnPage + props.itemsOnPage));
  }
  if (pagginatedItems.value.length < currentPage.value) {
    currentPage.value = pagginatedItems.value.length;
  }
};

const currentQuery = ref(props.query);

const updateQuery = (query: string) => {
  currentQuery.value = query;
};

const getRowIndex = (index: number) => {
  return (currentPage.value - 1) * props.itemsOnPage + index;
};

const grid = getCurrentInstance();

watch(currentQuery, () => {
  incomeData.value = filterItems(
    props.dataItems,
    currentQuery.value,
    props.filterFields ?? [],
    props.filterCaseSensitive ?? false,
  );
  onQueryUpdate(emit, currentQuery.value);
});

onMounted(() => {
  paginateItems(items);
});

watch(items, () => {
  paginateItems(items);
  if (itemsLength.value <= 1) currentPage.value = 1;
});

watch(itemsLength, () => {
  paginateItems(items);
});

const slots = useSlots();

const rowClicked = (row: Record<string, unknown>, rowRef: ComponentPublicInstance | null) => {
  // @ts-ignore
  onRowClick<typeof HiveGridRow>(emit, row, rowRef);
};

defineExpose({ items, grid });

const currentPageItems = computed(() => {
  if (pagginatedItems.value.length === 0) return items.value;
  if (currentPage.value <= 0) return pagginatedItems.value[0];
  if (currentPage.value > pagginatedItems.value.length) return pagginatedItems.value[pagginatedItems.value.length - 1];
  return pagginatedItems.value[currentPage.value - 1];
});
</script>

<template>
  <div class="wrapper">
    <table class="hive-grid" :style="style">
      <hive-grid-header
        :columns="columns"
        @sort="sort"
        :show-add-buttons="showAddButtons"
        v-if="!hideHeader"
        :has-filter="hasFilter"
        :query="currentQuery"
        @queryUpdate="updateQuery"
      />
      <tbody>
        <hive-grid-row
          v-for="(item, index) in currentPageItems"
          :key="(item as any).id"
          :index="index"
          :columns="columns"
          :row="(item as Record<string, unknown>)"
          :items-on-page="itemsOnPage"
          :current-page="currentPage"
          :show-add-buttons="showAddButtons"
          :color-alternation="colorAlternation"
          :add-row="addRow"
          @row-click="rowClicked"
          :delete-row="deleteRow"
          :css-class="rowCssClass"
        >
          <template #="{ rowRef }">
            <hive-grid-cell
              v-if="showAddButtons"
              :editable="false"
              :border-top="!colorAlternation"
              :row="(item as Record<string, unknown>)"
            >
              <template #view>
                <div class="gap">
                  <HiveButton text="AddUp" @click="addRow(true, getRowIndex(index))">
                    <template #after>
                      <span class="delete-icon">+</span>
                    </template>
                  </HiveButton>
                  <HiveButton text="Delete" @click="deleteRow(getRowIndex(index))">
                    <template #after>
                      <span class="delete-icon">&times;</span>
                    </template>
                  </HiveButton>
                  <HiveButton text="AddDown" @click="addRow(false, getRowIndex(index))">
                    <template #after>
                      <span class="delete-icon">+</span>
                    </template>
                  </HiveButton>
                </div>
              </template>
            </hive-grid-cell>
            <hive-grid-cell
              v-for="column in columns"
              :key="column.field"
              :text="(item as any)[column.field]?.text ?? (item as any)[column.field]"
              :row="(item as Record<string, unknown>)"
              :field="column.field"
              :fields="column.fields"
              :editable="column.editable"
              :valueType="column.viewType === 'list' ? 'array' : 'string'"
              :width="column.width ?? 'auto'"
              :in-edit-mode="column.inEditMode ?? false"
              :border-top="!colorAlternation"
              :css-class="column.cssClass"
              @after-edit="onAfterEdit(emit, $event)"
              @after-change="onAfterChange(emit, $event)"
              @before-edit="onBeforeEdit(emit, $event)"
              @before-change="onBeforeChange(emit, $event)"
            >
              <template #view="{ value, view, row, setTrueFlag }">
                <slot
                  :name="column.field ?? (column.fields ? column.fields[0] : '')"
                  :item="(item as any)[column.field]"
                  :row="row"
                  :setTrueFlag="setTrueFlag"
                  extensionFields
                >
                  <template v-if="column.viewType === 'list'">
                    <div v-if="!column.separator">
                      <div v-for="e in value">
                        {{ e }}
                      </div>
                    </div>
                    <div v-else>
                      {{ value !== null && Array.isArray(value) ? value.join(column.separator) : value }}
                    </div>
                  </template>
                  <template v-else-if="column.viewType === 'checkbox'">
                    <div style="width: 100%; display: flex; align-items: center; justify-content: center">
                      {{ value ? '✔️' : '❌' }}
                    </div>
                  </template>
                  <template v-else-if="column.viewType === 'file'">
                    <img :src="view" alt="Картинка" class="hive-image" />
                  </template>
                  <template v-else-if="column.viewType === 'function'">
                    <hive-button @click="column.function" />
                  </template>
                  <div v-else>
                    {{ view ? view : value }}
                  </div>
                </slot>
              </template>
              <template #edit="{ value, update, isChangeAllowed, toggle, customChange, row, hideEdit, setTrueFlag }">
                <slot
                  :name="(column.field ?? (column.fields ? column.fields[0] : '')) + '-edit'"
                  :value="value"
                  :update="update"
                  :is-change-allowed="isChangeAllowed"
                  :toggle="toggle"
                  :customChange="customChange"
                  :row="row"
                  :hideEdit="hideEdit"
                  :item="(item as any)[column.field]"
                  :setTrueFlag="setTrueFlag"
                  :row-ref="rowRef"
                >
                  <hive-input
                    v-if="column.editType === 'number'"
                    type="number"
                    @click.stop
                    :model-value="(value as number)"
                    @input="update"
                    :is-invalid="!isChangeAllowed"
                    focus-on-mount
                    @focusout="hideEdit"
                    @keydown.enter="hideEdit"
                    style="width: 100%"
                    :integer="column.inputProps?.integer ?? false"
                    :step="column.inputProps?.step ?? 0.01"
                    :min="column.inputProps?.min"
                    :max="column.inputProps?.max"
                    :mask="column.inputProps?.mask"
                  />
                  <hive-drop-down
                    v-else-if="column.editType === 'dropdown-list'"
                    :model-value="(value as Value)"
                    :options="column.options"
                    :is-invalid="!isChangeAllowed"
                    focusOnMount
                    @model-value-updated="update"
                    @focusout="toggle"
                    style="width: 100%"
                  />
                  <hive-textarea
                    v-else-if="column.editType === 'textarea'"
                    :model-value="(value as string)"
                    :is-invalid="!isChangeAllowed"
                    @input="update"
                    @focusout="hideEdit"
                    style="width: 100%"
                  />
                  <hive-autocomplete
                    style="width: fit-content"
                    v-else-if="column.editType === 'autocomplete'"
                    @change="update($event)"
                    :model-value="(value as Value)"
                    :options="column.options"
                    :is-invalid="!isChangeAllowed"
                    @focusout="hideEdit"
                  />
                  <hive-multiselect
                    v-else-if="column.editType === 'multiselect'"
                    :model-value="(value as Value[])"
                    :options="column.options"
                    style="width: 100%"
                  />
                  <div
                    v-else-if="column.editType === 'checkbox'"
                    style="width: 100%; display: flex; align-items: center; justify-content: center"
                  >
                    <hive-checkbox
                      :checked="(value as boolean)"
                      :is-invalid="!isChangeAllowed"
                      title=""
                      @change="update($event), hideEdit()"
                    />
                  </div>
                  <hive-input
                    v-else
                    @click.stop
                    :model-value="column.viewType === 'list' ? (value as unknown[]).join(',') : value as string"
                    @input="update"
                    :is-invalid="!isChangeAllowed"
                    focus-on-mount
                    @focusout="hideEdit"
                    @keydown.enter="hideEdit"
                    style="width: 100%"
                    :mask="column.inputProps?.mask"
                  />
                </slot>
              </template>
            </hive-grid-cell>
          </template>
        </hive-grid-row>
      </tbody>
    </table>
    <div v-if="pagginatedItems.length > 1" class="pagination-item">
      <svg
        @click="prevPage(1)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === 1 }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 14.15625 22.46875 L 6.65625 14.96875 L 14.15625 7.46875 L 15.46875 8.78125 L 9.28125 14.96875 L 15.46875 21.15625 Z M 22.0625 22.46875 L 14.5625 14.96875 L 22.0625 7.46875 L 23.375 8.78125 L 17.1875 14.96875 L 23.375 21.15625 Z M 22.0625 22.46875 "
          />
        </g>
      </svg>
      <svg
        @click="prevPage()"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === 1 }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 17.53125 22.5 L 10 14.96875 L 17.53125 7.4375 L 18.875 8.78125 L 12.6875 14.96875 L 18.875 21.15625 Z M 17.53125 22.5 "
          />
        </g>
      </svg>
      <span class="pagination_navigation-current">{{ currentPage }}</span>
      <svg
        @click="nextPage()"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === pagginatedItems.length }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 11.71875 22.5 L 10.375 21.15625 L 16.5625 14.96875 L 10.375 8.78125 L 11.71875 7.4375 L 19.25 14.96875 Z M 11.71875 22.5 "
          />
        </g>
      </svg>
      <svg
        @click="nextPage(pagginatedItems.length)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === pagginatedItems.length }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 7.96875 22.46875 L 6.65625 21.15625 L 12.84375 14.96875 L 6.65625 8.78125 L 7.96875 7.46875 L 15.46875 14.96875 Z M 15.875 22.46875 L 14.5625 21.15625 L 20.75 14.96875 L 14.5625 8.78125 L 15.875 7.46875 L 23.375 14.96875 Z M 15.875 22.46875 "
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.wrapper {
  height: fit-content;
  overflow-y: visible;
  // overflow-x: auto;
}

.hive-grid {
  height: 100%;
  border-spacing: 0;
  border: 1px solid var(--border-grid, $border-grid);
  overflow-y: visible;
  overflow-x: visible;
  width: 100%;

  &.hideBorders {
    border: 0;
  }

  & tr.even {
    background-color: var(--bg-grid, $bg-grid);
  }

  & tr.odd {
    background-color: var(--bg-grid-odd, $bg-grid-odd);
  }

  & td {
    padding: 8px 12px;
    border-width: 0 0 0 1px;
    border-style: solid;
    border-color: var(--border-grid, $border-grid);
  }

  &.hideBorders td {
    border: 0;
  }

  & .hive-image {
    max-width: 128px;
  }
}

.pagination-item {
  display: flex;
  align-items: center;
  width: fit-content;
  margin-top: 6px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  justify-content: space-between;
  user-select: none;
  color: rgb(80, 80, 80);

  .pagination-item_svg {
    fill: rgb(80, 80, 80);
    transition: fill 0.2s;
    height: 25px;
    width: 25px;

    &:hover {
      fill: rgba(176, 221, 255, 0.8980392157);
      cursor: pointer;

      &.disabled {
        fill: rgb(80, 80, 80);

        cursor: not-allowed;
      }
    }
  }

  .pagination_navigation-current {
    font-size: 20px;
  }

  .delete-icon {
    font-size: 10px;
    color: red;
  }

  .gap {
    gap: 5px;
  }
}
</style>
