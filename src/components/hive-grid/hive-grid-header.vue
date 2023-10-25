<script setup lang="ts">
import { type GridColumns } from '@/components/hive-grid/hooks/use-hive-grid';
import { CommonProps } from '@/common/mixin/props';
import { ref, watch } from 'vue';
import { Focusin, Focusout, Keydown, Mount, Search, Unmount, Update, Sort, onSort } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { Value } from '@/common/types/select';
import getRows from '@/components/hive-grid/helpers/get-rows';
import { ColumnWithChildren, ColumnWithoutChildren } from '@/components/hive-grid/types';
import hiveButton from '../hive-button/hive-button.vue';
import hiveInputSearch from '../hive-input-search/hive-input-search.vue';

interface Props extends CommonProps {
  columns: GridColumns[];
  showAddButtons?: boolean;
  hasFilter?: boolean;
  query: string;
}

const props = defineProps<Props>();

const currentQuery = ref(props.query);

type Emit = Mount & Unmount & Update<Value> & Focusin & Focusout & Keydown & Search<string> & Sort;
const emit = defineEmits<Emit>();
useOnMount(emit);

const rows = getRows(props.columns as ColumnWithChildren[] | ColumnWithoutChildren[]);

const addTop = () => {
  // handleEvent(new Event('addTop'));
};

const addBottom = () => {
  // handleEvent(new Event('addBottom'));
};

const updateQuery = () => {
  // context.emit('queryUpdate', currentQuery.value);
};

watch(currentQuery, () => {
  // console.log(currentQuery.value);
  // context.emit('queryUpdate', currentQuery.value);
});
</script>

<template>
  <thead class="hive-grid__header">
    <tr v-if="hasFilter">
      <th :colspan="columns?.length">
        <hive-input-search v-model="currentQuery" :is-opened="true" placeholder="Поиск" />
      </th>
    </tr>
    <tr>
      <th v-if="showAddButtons">
        <hive-button text="Add Top" @click="addTop" />
        <hive-button text="Add Bottom" @click="addBottom" />
      </th>
      <th
        v-for="item in columns"
        :key="item.field"
        @click="onSort(emit, item.field)"
        :class="{ 'cursor-pointer': item.sortable }"
      >
        {{ item.title }}
      </th>
    </tr>
  </thead>
</template>

<style lang="scss" scoped>
.hive-grid__header {
  background-color: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1;

  & th {
    border-width: 0 0 1px 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.08);
    padding: 4px;
    user-select: none;

    &:first-child {
      border-left-width: 0;
    }
    &:first-of-type {
      padding: 10px;
    }
  }
}
</style>
