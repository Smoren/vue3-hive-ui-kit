<script lang="ts" setup>
import { Ref, computed, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import {
  Mount,
  Unmount,
  Update,
  onUpdateModelValue,
  Change,
  onChange,
  Focusout,
  onFocusout,
} from '@/common/mixin/emits';
import { useOptions } from '@/common/hooks/use-options';
import { useOnMount } from '@/common/hooks/use-mount';
import { CurrentOptions, Value } from '@/common/types/select';

export interface Props extends CommonProps {
  option: [string, CurrentOptions] | undefined;
  checked?: boolean;
  modelValue?: boolean;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  name?: string;
  minusIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  name: 'radio-group',
  minusIcon: false,
});

type Emit = Mount & Unmount & Update<boolean> & Change<boolean> & Focusout;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue = ref(props.modelValue ?? false);

if (props.checked) {
  currentValue.value = true;
}

const currentInputValue = ref(props.checked);

const model = computed({
  get() {
    if (props.checked) {
      return true;
    }
    return props.modelValue;
  },
  set(value) {
    onUpdateModelValue(emit, value);
  },
});

const checkbox = ref(null);

watch(currentValue, (newValue) => {
  onUpdateModelValue(emit, newValue);
});
</script>

<template>
  <div v-if="option" class="ui checkbox">
    <input
      v-model="currentValue"
      :checked="checked"
      :value="true"
      :id="`hive-checkbox-${option[1][valueField]}`"
      class="hidden"
      tabindex="0"
      type="checkbox"
      @change="onChange(emit, currentValue)"
      @focusout="onFocusout(emit)"
    />
    <label :for="`hive-checkbox-${option[1][valueField]}`" :class="{ minus: minusIcon }">
      {{ option[1][titleField] }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
// @import '../../assets/css/semantic.css';

// .minus {
//   color: rgba(0, 0, 0, 0.95) !important;

//   &::after {
//     content: '\e800';
//   }
// }
</style>
