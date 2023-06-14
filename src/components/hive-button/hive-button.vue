<script lang="ts" setup>
import { StyleValue } from 'vue';
import { CommonProps } from '../../common/mixin/props';

interface Props extends CommonProps {
  text?: string;
  buttonClasses?: StyleValue[] | StyleValue;
  buttonStyle?: StyleValue;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  text: '',
  disabled: false,
});

const emit = defineEmits(['clickLeft', 'clickRight']);

const leftClick = () => {
  emit('clickLeft');
};

const rightClick = () => {
  emit('clickRight');
};
</script>

<template>
  <div
    class="button__wrapper"
    :class="{ disabled: disabled, ...classes }"
    :style="style"
    @click="leftClick"
    @click.right.prevent="rightClick"
  >
    <button class="button" :class="buttonClasses" :style="buttonStyle" :disabled="disabled">
      <slot name="before" />
      <span class="button__text">{{ text }}</span>
      <!-- <span class="button__text">{{ text }}</span> -->
      <slot name="after" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #f2f2f2;
$bg-hover: #d3eafff5;
$text-color: #3f3f3f;
$border-color: #bfbfbf;
$border-color-disabled: #bfbfbf7c;
$border-radius: 5px;

.button {
  user-select: none;
  border: none;
  text-rendering: auto;
  color: initial;
  display: inline-block;
  text-align: start;
  margin: 0;
  font-size: 1rem;
  background-color: $bg-color;
  color: $text-color;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  height: 100%;
  background: none;
  width: 100%;
  text-align: center;
  display: flex;

  &:hover {
    cursor: pointer;
  }

  &__wrapper {
    border-style: solid;
    border-radius: $border-radius;
    border-width: 1px;
    padding: 0.5rem 1rem;
    transition: background 0.2s;
    max-height: 100%;
    border-color: $border-color;
    background-color: $bg-color;

    &:hover {
      cursor: pointer;
      background: $bg-hover;
    }

    &.disabled {
      border-color: $border-color-disabled;
      opacity: 0.4;
      pointer-events: none;

      .button {
        &:hover {
          cursor: auto;
        }
      }

      &:hover {
        background: $bg-color;
        cursor: auto;
      }
    }
  }

  &__text {
    text-align: center;
    flex-grow: 100;
  }
}
</style>
