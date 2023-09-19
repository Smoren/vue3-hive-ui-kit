<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Mount, Unmount, Update, onUpdateModelValue } from '@/common/mixin/emits';
import { useOptions } from '@/common/hooks/use-options';
import { useOnMount } from '@/common/hooks/use-mount';
import { Options, Value } from '@/common/types/select';
import HiveCheckbox from '@/components/hive-checkbox/hive-checkbox.vue';

export interface Props extends CommonProps {
  modelValue: Value[];
  options: Options | undefined;
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

type Emit = Mount & Unmount & Update<Value[]>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue: Ref<Value[] | null> = ref(null);

setTimeout(() => {
  currentValue.value = props.modelValue;
}, 200);

const { currentOptions } = useOptions({
  options: props.options,
  modelValue: props.modelValue,
  fieldTitle: props.titleField,
  fieldValue: props.valueField,
});

const changeValue = (value: Value) => {
  if (currentValue.value === null) return;

  const includes = currentValue.value.includes(value);

  if (!includes) {
    currentValue.value?.push(value);

    onUpdateModelValue<Value[]>(emit, currentValue.value);
  } else {
    const index = currentValue.value.indexOf(value);

    if (index !== -1) currentValue.value.splice(index, 1);
  }
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
);
</script>

<template>
  <div class="hive-checkbox__container" :class="{ inline: inline }">
    <hive-checkbox
      v-for="option in currentOptions"
      :key="option[1][valueField]"
      :option="option"
      :title-field="titleField"
      :value-field="valueField"
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
