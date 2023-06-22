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
@import '@/assets/variables.scss';

.hive-button {
  cursor: pointer;
  width: 100%;
  border: 1px solid transparent;
  border-radius: $border-radius;
  text-rendering: auto;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-color: $border;
  background-color: $bg-button;
  font-size: 1rem;
  color: $text;

  &:hover {
    background: $bg-hover;
  }

  &:focus,
  focus-visible {
    outline: 1px auto $border-focus;
  }

  &.disabled {
    border-color: $border-disabled;
    opacity: 0.4;
    pointer-events: none;

    &:hover {
      background: $bg-button;
    }
  }
}
</style>
