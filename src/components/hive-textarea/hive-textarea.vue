<script lang="ts" setup>
import { StyleValue, ref } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Update } from '@/common/mixin/emits';

export interface HiveTextariaProps extends CommonProps {
  modelValue: string;
  placeholder?: string;
  rowsCount?: number;
  resizable?: boolean;
  resizeDirection?: 'both' | 'vertical' | 'horizontal';
  style?: StyleValue;
}

withDefaults(defineProps<HiveTextariaProps>(), {
  modelValue: '',
  resizable: true,
  resizeDirection: 'both',
});

const emit = defineEmits<Update<string>>();
</script>

<template>
  <textarea
    class="hive-textaria"
    :class="[{ resizable: resizable }, resizeDirection]"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value)"
    :placeholder="placeholder"
    :rows="rowsCount"
    :style="style"
  />
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.hive-textaria {
  border: 1px solid transparent;
  border-radius: var(--border-radius, $border-radius);
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-color: var(--border, $border);
  background-color: var(--bg-input, $bg-input);
  color: var(--text, $text);
  resize: none;
  transition: color 0.1s ease, border-color 0.1s ease;
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 1rem;
  box-sizing: border-box;
  max-width: 100%;

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
    outline: 1px auto var(--border-focus, $border-focus);
  }
}
</style>
