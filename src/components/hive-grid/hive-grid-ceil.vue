<script setup lang="ts">
import { CommonProps } from '@/common/mixin/props';
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
} from '@/common/mixin/emits';

interface Props extends CommonProps {
  name: string;
  object: any;
  field: string;
  fields: string[];
  editable: boolean;
  valueType: string;
  width: number;
  borderTop: boolean;
  inEditMode: boolean;
}

const props = withDefaults(defineProps<Partial<Props>>(), {
  editable: true,
  valueType: 'string',
  borderTop: false,
  inEditMode: false,
});

type Emit = Mount & Unmount & BeforeEdit & AfterEdit & BeforeChange & AfterChange & Updated;
const emit = defineEmits<Emit>();
useOnMount(emit);

const flag = ref(props.inEditMode);

const setTrueFlag = () => {
  onBeforeEdit(emit);
  flag.value = true;
};

function useAllowedRef<T>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: T) {
        if (isChangeAllowed.value) {
          value = newValue;
        } else {
          value = props.object && props.field ? props.object[props.field] : '';
        }
        trigger();
      },
    };
  });
}

const currentValue = useAllowedRef(props.object && props.field ? props.object[props.field] : '');

const viewValue = ref('');

const onInput = (value: typeof currentValue.value) => {
  currentValue.value = value;
};

const customChange = (value: string, view = '') => {
  currentValue.value = value;
  viewValue.value = view;
};

const toggleFlag = () => {
  if (flag.value) {
    onAfterEdit(emit);
  } else {
    onBeforeEdit(emit);
  }
  setTimeout(() => {
    flag.value = !flag.value;
  }, 0);
};

const emitOnAfterEdit = () => {
  onAfterEdit(emit);
};

const hideEdit = () => {
  onAfterEdit(emit);

  setTimeout(() => {
    flag.value = false;
  }, 10);
};

const currentObject = computed(() => props.object);
const isChangeAllowed = ref(true);

const preventChange = () => {
  isChangeAllowed.value = false;
};

const getIsChangeAllowed = () => isChangeAllowed.value;

watch(currentValue, (newValue) => {
  onBeforeChange(emit);
  if (props.object && props.field && isChangeAllowed.value) {
    // eslint-disable-next-line vue/no-mutating-props
    props.object[props.field] = newValue;
    onAfterChange(emit);
  }
});

watch(isChangeAllowed, (newValue) => {
  if (!newValue) {
    currentValue.value = props.object && props.field ? props.object[props.field] : '';
  }
});

watch(currentObject, () => {
  currentValue.value = props.object && props.field ? props.object[props.field] : '';
  onUpdated(emit);
});

const logEvent = (event: Event) => {
  console.log(event);
};
</script>

<template>
  <td
    class="ceil"
    @click="setTrueFlag"
    @keydown.enter="hideEdit"
    :width="width ? width : ''"
    :style="{ 'background-color': object?.backgroundColor }"
    :class="{ borderTop: borderTop }"
  >
    <slot
      @click.left="hideEdit"
      name="edit"
      v-if="flag && editable && object?.editable !== false"
      :value="currentValue"
      :update="onInput"
      :isChangeAllowed="getIsChangeAllowed()"
      :toggle="toggleFlag"
      :customChange="customChange"
      :row="object"
      :hideEdit="hideEdit"
      :emitOnAfterEdit="emitOnAfterEdit"
    />
    <slot
      v-else
      @click.stop="setTrueFlag"
      name="view"
      :value="currentValue"
      :view="viewValue"
      :row="object"
      :setTrueFlag="setTrueFlag"
    />
  </td>
</template>

<style lang="scss" scoped>
.ceil {
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: inherit;
  padding: 4px;

  &.borderTop {
    border-width: 0 0 1px 1px;
  }

  &:first-child {
    border-left: 0;
  }
}
</style>
