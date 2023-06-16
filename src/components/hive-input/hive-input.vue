<script lang="ts" setup>
import { focusout } from '@/common/emits/emits';
import { keydown } from '@/common/emits/emits';
import { focusin } from '@/common/emits/emits';
import { emitFocusin, emitFocusout, emitKeydown, mount, unmount } from '@/common/emits/emits';
import { update, useModelValue } from '@/common/hooks/use-model-value';
import { useOnMount } from '@/common/hooks/use-mount';
import { CommonProps } from '@/common/mixin/props';
import { Ref, ref } from 'vue';

type IMaskValue = string | number | Date | RegExp | ((value: string) => boolean);

interface IMask {
  mask: IMaskValue | IMaskValue[];
  lazy?: boolean;
  min?: number;
  max?: number;
}

interface Props extends CommonProps {
  modelValue: string;
  modelValueEventName?: string;
  placeholder: string;
  isInvalid: boolean;
  type: 'number' | 'text';
  isInteger: boolean;
  mask?: IMaskValue;
  minValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValueEventName: 'input',
  type: 'text',
  placeholder: 'input',
  isInvalid: false,
  isInteger: false,
});

type emitType = mount & unmount & update<string> & focusin & focusout & keydown;

const emit = defineEmits<emitType>();

useOnMount(emit);

const currentValue = ref(props.modelValue);

useModelValue(currentValue, emit);

const input: Ref<HTMLInputElement | null> = ref(null);

const forceFocus = () => {
  if (input.value !== null) {
    input.value.focus();
  }
};

let generatedMask: IMask | undefined;

if (props.mask) {
  generatedMask = {
    mask: props.mask,
    lazy: true,
  };
}
</script>

<template>
  <div v-bind="attrs" :style="style" class="ui input">
    <input
      ref="input"
      v-model="currentValue"
      v-mask="generatedMask"
      class="hive-input"
      :class="{ error: isInvalid, ...classes }"
      :type="type"
      :placeholder="placeholder"
      :step="isInteger ? '1' : '0.01'"
      :min="minValue"
      @focusin="emitFocusin(emit)"
      @focusout="emitFocusout(emit)"
      @keydown="emitKeydown(emit)"
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
