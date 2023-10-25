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
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { Value } from '@/common/types/select';

interface Props extends CommonProps {
  item: Record<string, unknown>;
  index: number;
  columns: GridColumns[];
  itemsOnPage: number;
  currentPage: number;
  showAddButtons?: boolean;
  colorAlternation?: boolean;
  addRow: (up: boolean, index: number) => void;
  deleteRow: (index: number) => void;
}

withDefaults(defineProps<Props>(), {
  showAddButtons: false,
  colorAlternation: false,
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

const row = ref(null);

const rowClick = (item: Record<string, unknown>) => {
  onRowClick(emit, item, row.value);
};
</script>

<template>
  <tr
    ref="row"
    class="grid-row"
    :class="[!colorAlternation || index % 2 === 0 ? 'even' : 'odd']"
    @click="rowClick(item as Record<string, unknown>)"
  >
    <slot />
  </tr>
</template>

<style lang="scss" scoped></style>
