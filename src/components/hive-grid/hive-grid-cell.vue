<script setup lang="ts">
import { ref, watch, customRef, computed } from 'vue';
import { useOnMount } from '@/common/hooks/use-mount';
import { Updated, onUpdated } from '../../common/mixin/emits';
import {
  BeforeEdit,
  onBeforeEdit,
  AfterEdit,
  BeforeChange,
  AfterChange,
  onAfterEdit,
  onBeforeChange,
  onAfterChange,
  Unmount,
  Mount,
  Event,
} from '@/common/mixin/emits';
import type { CommonProps } from '@/common/types/props';
import type { CssClassConfig } from './types';
import { getClassString } from './helpers/get-css-class';
import { useAllowedRef } from './hooks/use-allowed-ref';

interface Props extends CommonProps {
  name?: string;
  row: Record<string, unknown>; // TODO переименовать ЪуЪ
  field?: string;
  fields?: string[];
  editable?: boolean | ((row: Record<string, unknown>) => boolean);
  valueType?: string;
  width?: number | string;
  borderTop?: boolean;
  inEditMode?: boolean;
  cssClass?: CssClassConfig;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  valueType: 'string',
  borderTop: false,
  inEditMode: false,
});

type Emit = Event & Mount & Unmount & BeforeEdit & AfterEdit & BeforeChange & AfterChange & Updated;
const emit = defineEmits<Emit>();
useOnMount(emit);

const slots = defineSlots<{
  edit(props: {
    value: unknown;
    update: (value: unknown) => void;
    isChangeAllowed: boolean;
    toggle: () => void;
    customChange: (value: string, view?: string) => void;
    row: Record<string, unknown> | undefined;
    hideEdit: () => void;
    setTrueFlag: () => void;
  }): any;
  view(props: {
    value: unknown;
    view: string;
    row: Record<string, unknown> | undefined;
    setTrueFlag: () => void;
  }): any;
}>();

const flag = ref(props.inEditMode);

const setTrueFlag = () => {
  onBeforeEdit(emit, props.row);
  flag.value = true;
};

const isChangeAllowed = ref(true);

const currentValue = useAllowedRef(
  props.row && props.field ? props.row[props.field] : '',
  isChangeAllowed,
  props.row,
  props.field,
);

const viewValue = ref('');

const onInput = (value: typeof currentValue.value) => {
  currentValue.value = value;
};

const customChange = (value: string, view = '') => {
  currentValue.value = value;
  viewValue.value = view;
};

const toggleFlag = () => {
  setTimeout(() => {
    flag.value = !flag.value;
  }, 0);
};

watch(flag, () => {
  if (flag.value) {
    onBeforeEdit(emit, props.row);
  } else {
    onAfterEdit(emit, props.row);
  }
});

const hideEdit = () => {
  setTimeout(() => {
    flag.value = false;
  }, 10);
};

const currentObject = computed(() => props.row);

const preventChange = () => {
  isChangeAllowed.value = false;
};

const getIsChangeAllowed = () => isChangeAllowed.value;

watch(currentValue, (newValue) => {
  onBeforeChange(emit, props.row);
  if (props.row && props.field && isChangeAllowed.value) {
    // eslint-disable-next-line vue/no-mutating-props
    props.row[props.field] = newValue;
    onAfterChange(emit, props.row);
  }
});

watch(isChangeAllowed, (newValue) => {
  if (!newValue) {
    currentValue.value = props.row && props.field ? props.row[props.field] : '';
  }
});

watch(currentObject, () => {
  currentValue.value = props.row && props.field ? props.row[props.field] : '';
  onUpdated(emit);
});

const classString = computed(() => getClassString(props.row, props.cssClass));
</script>

<template>
  <td
    class="cell"
    @click="setTrueFlag"
    @keydown.enter="hideEdit"
    :width="width ? width : ''"
    :style="{ 'background-color': row?.backgroundColor as string }"
    :class="[{ borderTop: borderTop }, classString]"
  >
    <slot
      @click.left="hideEdit"
      name="edit"
      v-if="flag && (typeof editable === 'boolean' ? editable : editable(row)) && row?.editable !== false"
      :value="currentValue"
      :update="onInput"
      :isChangeAllowed="getIsChangeAllowed()"
      :toggle="toggleFlag"
      :customChange="customChange"
      :row="row"
      :hideEdit="hideEdit"
      :setTrueFlag="setTrueFlag"
    />
    <slot
      v-else
      @click.stop="setTrueFlag"
      name="view"
      :value="currentValue"
      :view="viewValue"
      :row="row"
      :setTrueFlag="setTrueFlag"
    />
  </td>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.cell {
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: var(--border, $border);
  padding: 4px;

  &.borderTop {
    border-width: 0 0 1px 1px;
  }

  &:first-child {
    border-left: 0;
  }
}
</style>
