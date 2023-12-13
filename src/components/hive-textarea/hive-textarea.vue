<script setup lang="ts">
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount, Update, onUpdateModelValue } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

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

type Emit = Mount & Unmount & Update<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);
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

<style scoped lang="scss">
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
    outline: none;
    border-color: var(--border-focus, $border-focus);
  }

  &:disabled {
    border-color: var(--border-disabled, $border-disabled);
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
