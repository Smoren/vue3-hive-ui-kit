<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';
import { Update, onUpdateModelValue } from '@/common/mixin/emits';

export interface Props extends CommonProps {
  modelValue: string;
  placeholder?: string;
  rowsCount?: number;
  resizable?: boolean;
  resizeDirection?: 'both' | 'vertical' | 'horizontal';
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  resizable: true,
  resizeDirection: 'both',
});

type Emit = Update<string>;

const emit = defineEmits<Emit>();
</script>

<template>
  <textarea
    class="hive-textaria"
    :class="[{ resizable: resizable }, resizeDirection]"
    :style="style"
    :value="modelValue"
    @input="onUpdateModelValue(emit, ($event.target as HTMLTextAreaElement)?.value)"
    :placeholder="placeholder"
    :rows="rowsCount"
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
