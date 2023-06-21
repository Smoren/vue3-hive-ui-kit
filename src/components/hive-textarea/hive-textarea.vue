<script lang="ts" setup>
import { ref } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { useModelValue } from '@/common/hooks/use-model-value';

export interface HiveTextariaProps extends CommonProps {
  modelValue: string;
  placeholder?: string;
  rowsCount?: number;
  resizable?: boolean;
  resizeDirection?: 'both' | 'vertical' | 'horizontal';
}

const props = withDefaults(defineProps<HiveTextariaProps>(), {
  modelValue: '',
  placeholder: 'Введите текст...',
  resizable: true,
  resizeDirection: 'both',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const currentValue = ref(props.modelValue);

useModelValue(currentValue, emit);
</script>

<template>
  <textarea
    class="hive-textaria"
    :class="[{ resizable: resizable }, resizeDirection]"
    v-model="currentValue"
    :placeholder="placeholder"
    :rows="rowsCount"
  />
</template>

<style lang="scss" scoped>
$bg-color: #ffffff;
$bg-hover: #d3eafff5;
$text-color: rgba(0, 0, 0, 0.87);
$border-color: #bfbfbf; // rgba(34, 36, 38, 0.15);
$border-radius: 5px;
$border-color-focus: #b2d6f8; // #85b7d9;
$box-shadow-focus: 0 0 0 0 rgba(34, 36, 38, 0.35) inset;
$border-focus: #b2d6f8;

.hive-textaria {
  border: 1px solid transparent;
  border-radius: $border-radius;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-color: $border-color;
  background-color: $bg-color;
  color: $text-color;
  resize: none;
  transition: color 0.1s ease, border-color 0.1s ease;
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 1rem;
  // widthnpm: 100%;

  &.resizable {
    resize: vertical;
    &.both {
      resize: both;
    }
    &.vertical {
      resize: vertical;
    }
    &.horizontal {
      resize: horizontal;
    }
  }

  &:focus,
  focus-visible {
    outline: 1px auto $border-focus;
  }
}
</style>
