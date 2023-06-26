<script lang="ts" setup>
import { Ref, StyleValue, reactive, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
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
import { useOnMount } from '@/common/hooks/use-mount';

export interface Props extends CommonProps {
  modelValue: string | number;
  modelValueEventName?: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'search';
  placeholder?: string;
  mask?: RegExp;
  invalid?: boolean;
  integer?: boolean;
  min?: number | string;
  max?: number | string;
  step?: '1' | '0.1' | '0.01' | '0.001' | 1 | 0.1 | 0.01 | 0.001;
  style?: StyleValue;
}

const props = withDefaults(defineProps<Props>(), {
  modelValueEventName: 'input',
  type: 'text',
  placeholder: 'Введите текст...',
  invalid: false,
  integer: false,
  step: '0.01',
});

type currentType = typeof props.modelValue;

type Emit = Mount & Unmount & Update<currentType> & Focusin & Focusout & Keydown & Input<currentType>;

const emit = defineEmits<Emit>();

useOnMount(emit);

const input: Ref<HTMLInputElement | null> = ref(null);

const forceFocus = () => {
  if (input.value !== null) {
    input.value.focus();
  }
};

const handleInput = (value: currentType) => {
  emit('update:modelValue', value);
  onInput(emit, value);
};

const handleKeydown = (event: KeyboardEvent) => {
  onKeydown(emit, event);

  if (props.mask && !props.mask.test(event.key)) {
    event.preventDefault();
  }
};

export interface InputExpose {
  input: HTMLInputElement | null;
  forceFocus: () => void;
}

defineExpose({ input, forceFocus });

/* Изменение placeholder в зависимости от props.type */
const placeholderView = ref(props.placeholder);

watch(props, () => {
  if (props.type === 'number') {
    placeholderView.value = 'Введите значение...';
  }
});
</script>

<template>
  <input
    ref="input"
    class="hive-input"
    :class="{ error: invalid }"
    :style="style"
    :type="type"
    :value="modelValue"
    :placeholder="placeholderView"
    :step="integer ? '1' : step"
    :min="min"
    :max="max"
    @input="handleInput(($event.target as HTMLInputElement)?.value)"
    @focusin="onFocusin(emit)"
    @focusout="onFocusout(emit)"
    @keydown="handleKeydown($event)"
  />
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
.hive-input {
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

  &:focus,
  focus-visible {
    outline: 1px auto var(--border-focus, $border-focus);
  }
}
</style>
