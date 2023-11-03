<script setup lang="ts">
import { Ref, ref, getCurrentInstance } from 'vue';
import { CommonProps } from '@/common/mixin/props';
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
  RowClick,
  onRowClick,
  BeforeEdit,
  BeforeChange,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { Value } from '@/common/types/select';
import { type GridColumns } from './types';
import { VueComponent } from '@/common/types/value';

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

defineSlots<{
  default(props: { rowRef: VueComponent | null }): any;
}>();

const row: Ref<VueComponent | null> = ref(null);

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
    <slot :row-ref="row" />
  </tr>
</template>

<style lang="scss" scoped></style>
