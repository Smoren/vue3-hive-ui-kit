<script setup lang="ts">
import { Ref, ref, getCurrentInstance, computed } from 'vue';
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
  RowClick,
  onRowClick,
  BeforeEdit,
  BeforeChange,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { Value } from '@/common/types/select';
import { type GridColumns, CssClassConfig } from './types';
import { VueComponent } from '@/common/types/value';
import { getClassString } from './helpers/get-css-class';

interface Props extends CommonProps {
  row: Record<string, unknown>;
  index: number;
  columns: GridColumns[];
  itemsOnPage: number;
  currentPage: number;
  showAddButtons?: boolean;
  colorAlternation?: boolean;
  cssClass?: CssClassConfig;
  addRow: (up: boolean, index: number) => void;
  deleteRow: (index: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
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
const classString = computed(() => getClassString(props.row, props.cssClass));
</script>

<template>
  <tr
    ref="row"
    class="grid-row"
    :class="[!colorAlternation || index % 2 === 0 ? 'even' : 'odd', classString]"
    @click="rowClick(row as Record<string, unknown>)"
  >
    <slot :row-ref="row" />
  </tr>
</template>

<style lang="scss" scoped></style>
