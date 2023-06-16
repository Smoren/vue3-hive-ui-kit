<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';

interface Props extends CommonProps {
  modelValue: string;
  modelValueEventName?: string;
  placeholder?: string;
  isInvalid?: boolean;
  type: string;
  mask?: {
    mask: Mask | Mask[]
    lazy?: boolean;
    min?: number;
    max?: number;
  };
}

type Mask = String | Number | Date | ((value: string) => boolean);

withDefaults(defineProps<Props>(), {
  modelValueEventName: 'input',
  placeholder: 'placeholder',
  isInvalid: false,
});

</script>

<template>
  <div v-bind="attrs" :style="style" class="ui input">
    <input
      :type="type"
      :class="{ error: isInvalid, ...classes }"
      :placeholder="placeholder"
      class="hive-input"
      ref="input"
      v-mask="mask"
    />
  </div>
</template>

<style scoped lang="scss">
$bg-color: #ffffff;
$border-color-focus: #85b7d9;
$text-color: rgba(0, 0, 0, 0.87);
$border-radius: 5px;
$border-color: rgba(34, 36, 38, 0.15);
$highlight-color: rgba(255, 255, 255, 0);
$bg-color-error: #fff6f6;
$border-color-error: #e0b4b4;
$text-color-error: #9f3a38;

.hive-input {
  -webkit-tap-highlight-color: $highlight-color;
  height: fit-content;
  margin: 0;
  max-width: 100%;
  flex: 1 0 auto;
  outline: none;
  text-align: left;
  line-height: 1.2rem;
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  padding: 0.7rem 1rem;
  background: $bg-color;
  border: 1px solid $border-color;
  color: $text-color;
  border-radius: $border-radius;
  transition: box-shadow 0.1s ease, border-color 0.1s ease;
  box-shadow: none;

  &:focus {
    border-color: $border-color-focus;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  &.error {
    background-color: $bg-color-error;
    border-color: $border-color-error;
    color: $text-color-error;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>
