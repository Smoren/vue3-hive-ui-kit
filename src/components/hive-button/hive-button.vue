<script lang="ts" setup>
import { StyleValue } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Click, onClick } from '@/common/mixin/emits';

export interface HiveButtonProps extends CommonProps {
  title?: string;
  disabled?: boolean;
  style?: StyleValue;
}

withDefaults(defineProps<HiveButtonProps>(), {
  title: 'Button',
  disabled: false,
});

const emit = defineEmits<Click>();

</script>

<template>
  <button
    class="hive-button"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    @click="onClick(emit, $event)"
    :style="style"
  >
    <slot name="before" />
    <slot>
      {{ title }}
    </slot>
    <slot name="after" />
  </button>
</template>

<style lang="scss" scoped>
$bg-color: #f2f2f2;
$bg-hover: #d3eafff5;
$text-color: #3f3f3f;
$border-color: #bfbfbf;
$border-color-disabled: #bfbfbf7c;
$border-radius: 5px;
$border-width: 1px;
$border-focus: #b2d6f8;

.hive-button {
  cursor: pointer;
  width: 100%;
  border: 1px solid transparent;
  border-radius: $border-radius;
  text-rendering: auto;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-color: $border-color;
  background-color: $bg-color;
  font-size: 1rem;
  color: $text-color;

  &:hover {
    background: $bg-hover;
  }

  &:focus,
  focus-visible {
    outline: 1px auto $border-focus;
  }

  &.disabled {
    border-color: $border-color-disabled;
    opacity: 0.4;
    pointer-events: none;

    &:hover {
      background: $bg-color;
    }
  }
}
</style>
