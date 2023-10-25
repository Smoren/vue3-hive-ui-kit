<script setup lang="ts">
import useHiveGrid, { type GridColumns, type GridConfig } from '@/components/hive-grid/hooks/use-hive-grid';
import { CommonProps } from '@/common/mixin/props';
import { ref, computed, Ref, WritableComputedRef, watch, onMounted, getCurrentInstance } from 'vue';
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
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { Value } from '@/common/types/select';
import HiveGridHeader from './hive-grid-header.vue';
import HiveGridCeil from './hive-grid-ceil.vue';
import HiveInput from '../hive-input/hive-input.vue';
import HiveDropDown from '../hive-drop-down/hive-drop-down.vue';
import hiveAutocomplete from '../hive-autocomplete/hive-autocomplete.vue';
import hiveTextarea from '../hive-textarea/hive-textarea.vue';

interface Props extends CommonProps {
  dataItems: any[] | undefined;
  columns: GridColumns[];
  itemsOnPage?: number;
  showAddButtons?: boolean;
  hasFilter?: boolean;
  colorAlternation?: boolean;
  hideHeader?: boolean;
  query?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showAddButtons: false,
  itemsOnPage: 10,
  hasFilter: false,
  colorAlternation: true,
  hideHeader: false,
  query: '',
});

type Emit = Mount &
  Unmount &
  Update<Value> &
  Focusin &
  Focusout &
  Keydown &
  Search<string> &
  QueryUpdate &
  RowClick &
  AfterChange &
  AfterEdit &
  BeforeEdit &
  BeforeChange;
const emit = defineEmits<Emit>();
useOnMount(emit);

const loaded = ref(false);

const { items, sort, deleteRow, itemsLength, addRow, isLoading } = useHiveGrid({
  columns: props.columns,
  dataItems: computed(() => props.dataItems),
} as GridConfig);

const arrayOfSplittedItems: Ref<Record<string, any>[][]> = ref([]);
const currentPage = ref(1);

const prevPage = (page?: number) => {
  if (currentPage.value === 1) return;
  page === undefined ? currentPage.value-- : (currentPage.value = page);
};

const nextPage = (page?: number) => {
  if (currentPage.value === arrayOfSplittedItems.value.length) return;
  page === undefined ? currentPage.value++ : (currentPage.value = page);
};

const pagination = (items: WritableComputedRef<object[]>) => {
  arrayOfSplittedItems.value.length = 0;
  if (props.itemsOnPage === 0) return;
  for (let i = 0; i < items.value.length / props.itemsOnPage; i++) {
    arrayOfSplittedItems.value.push(
      items.value.slice(i * props.itemsOnPage, i * props.itemsOnPage + props.itemsOnPage),
    );
  }
};

const getRowIndex = (index: number) => {
  return (currentPage.value - 1) * props.itemsOnPage + index;
};

const currentQuery = ref(props.query);

const updateQuery = (query: string) => {
  currentQuery.value = query;
};

const grid = getCurrentInstance();

watch(currentQuery, () => {
  onQueryUpdate(emit, currentQuery.value);
});

onMounted(() => {
  pagination(items);
});

watch(items, () => {
  pagination(items);
  if (itemsLength.value <= 1) currentPage.value = 1;
});

watch(itemsLength, () => {
  pagination(items);
});

// const logEvent = (event: EventData) => {
//   if (event.type === 'addTop') {
//     addRow(true, 0);
//   } else if (event.type === 'addBottom') {
//     addRow(false, itemsLength.value - 1);
//   }
// };

const rowClick = (item: Record<string, unknown>) => {
  onRowClick(emit, item);
};

defineExpose({ items, grid });
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
        <tr
          class="grid-row"
          v-for="(item, index) in arrayOfSplittedItems.length === 0 ? items : arrayOfSplittedItems[currentPage - 1]"
          :key="(item as any).id"
          :class="[!colorAlternation || index % 2 === 0 ? 'even' : 'odd']"
          @click="rowClick(item as Record<string, unknown>)"
        >
          <hive-grid-ceil v-if="showAddButtons" :editable="false" :border-top="!colorAlternation">
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
          </hive-grid-ceil>
          <hive-grid-ceil
            @after-edit="onAfterEdit(emit)"
            @after-change="onAfterChange(emit)"
            @before-edit="onBeforeEdit(emit)"
            @before-change="onBeforeChange(emit)"
            v-for="element in columns"
            :key="element.field"
            :text="(item as any)[element.field]?.text ?? (item as any)[element.field]"
            :object="item"
            :field="element.field"
            :fields="element.fields"
            :editable="element.editable"
            :valueType="element.viewType === 'list' ? 'array' : 'string'"
            :width="element.width"
            :in-edit-mode="element.inEditMode ?? false"
            :border-top="!colorAlternation"
          >
            <template #edit="{ value, update, isChangeAllowed, toggle, customChange, row, hideEdit, emitOnAfterEdit }">
              <slot
                :name="(element.field ?? (element.fields ? element.fields[0] : '')) + '-edit'"
                :value="value"
                :update="update"
                :is-change-allowed="isChangeAllowed"
                :toggle="toggle"
                :customChange="customChange"
                :row="row"
                :hideEdit="hideEdit"
                :emitOnAfterEdit="emitOnAfterEdit"
              >
                <hive-input
                  v-if="element.editType === 'number'"
                  type="number"
                  @click.stop
                  :model-value="value"
                  @input="update"
                  :is-invalid="!isChangeAllowed"
                />
                <hive-drop-down
                  v-else-if="element.editType === 'dropdown-list'"
                  :model-value="value"
                  :options="element.options"
                  :is-invalid="!isChangeAllowed"
                  focusOnMount
                  @model-value-updated="update"
                  @focusout="toggle"
                />
                <hive-textarea
                  v-else-if="element.editType === 'textarea'"
                  :model-value="value"
                  :is-invalid="!isChangeAllowed"
                  @input="update"
                  @focusout="hideEdit"
                />
                <hive-autocomplete
                  style="width: fit-content"
                  v-else-if="element.editType === 'autocomplete'"
                  @change="update($event)"
                  :model-value="value"
                  :options="element.options"
                  :is-invalid="!isChangeAllowed"
                  @focusout="hideEdit"
                />
                <hive-multiselect
                  v-else-if="element.editType === 'multiselect'"
                  :model-value="value"
                  :options="element.options"
                />
                <div
                  v-else-if="element.editType === 'checkbox'"
                  style="width: 100%; display: flex; align-items: center; justify-content: center"
                >
                  <hive-checkbox
                    :model-value="value"
                    @change="update($event)"
                    :is-invalid="!isChangeAllowed"
                    @focus-out="hideEdit"
                    title=""
                  />
                </div>
                <hive-input
                  v-else
                  @click.stop
                  :model-value="element.viewType === 'list' ? value.join(',') : value"
                  @input="update"
                  :is-invalid="!isChangeAllowed"
                  focus-on-mount
                  @focusout="hideEdit"
                  @keydown.enter="hideEdit"
                />
              </slot>
            </template>
            <template #view="{ value, view, row, setTrueFlag }">
              <slot
                :name="element.field ?? (element.fields ? element.fields[0] : '')"
                :item="(item as any)[element.field]"
                :row="row"
                :setTrueFlag="setTrueFlag"
              >
                <template v-if="element.viewType === 'list'">
                  <div v-if="!element.separator">
                    <div v-for="e in value">
                      {{ e }}
                    </div>
                  </div>
                  <div v-else>
                    {{ value !== null && Array.isArray(value) ? value.join(element.separator) : value }}
                  </div>
                </template>
                <template v-else-if="element.viewType === 'checkbox'">
                  <div style="width: 100%; display: flex; align-items: center; justify-content: center">
                    {{ value ? '✔️' : '❌' }}
                  </div>
                </template>
                <template v-else-if="element.viewType === 'file'">
                  <img :src="view" alt="Картинка" class="hive-image" />
                </template>
                <template v-else-if="element.viewType === 'function'">
                  <hive-button @click="element.function" />
                </template>
                <div v-else>
                  {{ view ? view : value }}
                </div>
              </slot>
            </template>
          </hive-grid-ceil>
        </tr>
      </tbody>
    </table>
    <div v-if="arrayOfSplittedItems.length > 1" class="pagination-item">
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
        :class="{ disabled: currentPage === arrayOfSplittedItems.length }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 11.71875 22.5 L 10.375 21.15625 L 16.5625 14.96875 L 10.375 8.78125 L 11.71875 7.4375 L 19.25 14.96875 Z M 11.71875 22.5 "
          />
        </g>
      </svg>
      <svg
        @click="nextPage(arrayOfSplittedItems.length)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === arrayOfSplittedItems.length }"
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
.wrapper {
  height: fit-content;
  overflow-y: visible;
  // overflow-x: auto;
}

.hive-grid {
  height: 100%;
  border-spacing: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow-y: visible;
  overflow-x: visible;
  width: 100%;

  &.hideBorders {
    border: 0;
  }

  & tr.even {
    background-color: #ffffff;
  }

  & tr.odd {
    background-color: rgba(0, 0, 0, 0.04);
  }

  & td {
    padding: 8px 12px;
    border-width: 0 0 0 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.08);
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
