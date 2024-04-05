<script setup lang="ts">
import { CommonProps } from '@/common/types/props';
import { Click, Mount, Unmount, onClick, Event } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

export interface Props extends CommonProps {
  title?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'Button',
  disabled: false,
});

type Emit = Event & Mount & Unmount & Click;
const emit = defineEmits<Emit>();
useOnMount(emit);
</script>

<template>
  <button class="hive-button" :style="style" :disabled="disabled" @click="onClick(emit, $event)">
    <slot name="before" />
    <slot>
      {{ title }}
    </slot>
    <slot name="after" />
  </button>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';
$height: var(--height, calc($common-widget-height + 2px));
.hive-button {
  cursor: pointer;
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--border-radius, $border-radius);
  text-rendering: auto;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-color: var(--border, $border);
  background-color: var(--bg-button, $bg-button);
  font-size: 1rem;
  color: var(--text);
  height: $height;
  line-height: 1rem;

  &:hover {
    background: var(--bg-hover, $bg-hover);
  }

  &:focus,
  focus-visible {
    outline: none;
  }

  &[disabled] {
    border-color: var(--border-disabled, $border-disabled);
    color: var(--text-disabled, $text-disabled);
    //pointer-events: none;
    cursor: not-allowed;

    &:hover {
      background: var(--bg-button, $bg-button);
    }
  }
}
</style>
