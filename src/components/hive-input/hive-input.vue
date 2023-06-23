<script lang="ts" setup>
import {
  Focusout,
  Keydown,
  Focusin,
  onFocusin,
  onFocusout,
  onKeydown,
  Mount,
  Unmount,
  Update,
  Input,
  onInput,
} from '@/common/mixin/emits';
import { useModelValue } from '@/common/hooks/use-model-value';
import { useOnMount } from '@/common/hooks/use-mount';
import { CommonProps } from '@/common/mixin/props';
import { Ref, reactive, ref } from 'vue';
import { MaskValue, Mask } from '@/common/types/mask';

interface Props extends CommonProps {
  modelValue: string | number;
  modelValueEventName?: string;
  placeholder?: string;
  invalid?: boolean;
  type?: 'number' | 'text';
  integer?: boolean;
  mask?: MaskValue;
  minValue?: number;
  maxValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValueEventName: 'input',
  type: 'text',
  placeholder: 'input',
  invalid: false,
  integer: false,
});

type currentType = typeof props.modelValue;

type emitType = Mount & Unmount & Update<currentType> & Focusin & Focusout & Keydown & Input<currentType>;

const emit = defineEmits<emitType>();

useOnMount(emit);

const currentValue = ref(props.modelValue);

useModelValue<currentType>(currentValue, emit);

const input: Ref<HTMLInputElement | null> = ref(null);

const forceFocus = () => {
  if (input.value !== null) {
    input.value.focus();
  }
};

const generatedMask: Mask = reactive({
  mask: props.mask ?? '',
  lazy: true,
});

const handleInput = (value: currentType) => {
  emit('update:modelValue', value);
  onInput(emit, value);
};

export interface InputExpose {
  input: HTMLInputElement | null;
  forceFocus: () => void;
}

defineExpose({ input, forceFocus });
</script>

<template>
  <input
    ref="input"
    :value="modelValue"
    @input="handleInput(($event.target as HTMLInputElement)?.value)"
    v-mask="mask ? generatedMask : ''"
    :style="style"
    class="hive-input"
    :class="{ error: invalid }"
    :type="type"
    :placeholder="placeholder"
    :step="integer ? '1' : '0.01'"
    :min="minValue"
    :max="maxValue"
    @focusin="onFocusin(emit)"
    @focusout="onFocusout(emit)"
    @keydown="onKeydown(emit, $event)"
  />
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
  box-sizing: border-box;

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
