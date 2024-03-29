<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { CommonProps } from '@/common/types/props';
import {
  Mount,
  Unmount,
  Update,
  onUpdateModelValue,
  Focusout,
  onFocusout,
  Focusin,
  onFocusin,
 Event } from '@/common/mixin/emits';
import { useOptions } from '@/common/hooks/use-options';
import { useOnMount } from '@/common/hooks/use-mount';
import type { Options } from '@/common/types/option';
import { Value } from '@/common/types/select';
import HiveCheckbox from '@/components/hive-checkbox/hive-checkbox.vue';

export interface Props extends CommonProps {
  options: Options | undefined;
  modelValue: Value[];
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
  name: 'checkbox-group',
});

type Emit = Event & Mount & Unmount & Update<Value[]> & Focusout & Focusin;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue: Ref<Value[]> = ref(props.modelValue);

const { currentOptions } = useOptions({
  options: props.options,
  modelValue: props.modelValue,
  fieldTitle: props.titleField,
  fieldValue: props.valueField,
});

setTimeout(() => {
  currentOptions.value = useOptions({
    options: props.options,
    modelValue: props.modelValue,
    fieldTitle: props.titleField,
    fieldValue: props.valueField,
  }).currentOptions.value;
});

const changeValue = (value: Value) => {
  const includes = currentValue.value.includes(value);

  if (!includes) {
    currentValue.value?.push(value);
  } else {
    const index = currentValue.value.indexOf(value);

    if (index !== -1) currentValue.value.splice(index, 1);
  }
  onUpdateModelValue<Value[]>(emit, currentValue.value);
};

watch(
  () => props.modelValue,
  () => {
    currentValue.value = props.modelValue;
  },
);

watch(
  () => props.options,
  () => {
    currentOptions.value = useOptions({
      options: props.options,
      modelValue: props.modelValue,
      fieldTitle: props.titleField,
      fieldValue: props.valueField,
    }).currentOptions.value;
  },
  { deep: true },
);
</script>

<template>
  <div
    class="hive-checkbox__container"
    :class="{ inline: inline }"
    @focusout="onFocusout(emit)"
    @focusin="onFocusin(emit)"
  >
    <hive-checkbox
      v-for="option in currentOptions"
      :key="option[1][valueField]"
      :option="option"
      :value-field="valueField"
      :title="option[1][titleField]"
      :minus-icon="minusIcon"
      :checked="(currentValue as string[])?.includes(option[1][valueField])"
      @change="changeValue(option[1][valueField])"
    />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$gap: 15px;

.hive-checkbox {
  &__container {
    width: fit-content;

    &.inline {
      display: flex;
      gap: $gap;
      flex-wrap: wrap;
    }
  }
}
</style>
