<script setup lang="ts">
import { Ref, ref, onMounted, watch } from 'vue';
import { CommonProps } from '@/common/types/props';
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
  onUpdateModelValue,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { vMaska } from 'maska';

export interface Props extends CommonProps {
  modelValue: string | number;
  modelValueEventName?: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'search';
  placeholder?: string;
  mask?: string;
  invalid?: boolean;
  integer?: boolean;
  min?: number;
  max?: number;
  step?: number;
  focusOnMount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValueEventName: 'input',
  type: 'text',
  invalid: false,
  integer: false,
  step: 0.01,
});

type CurrentType = typeof props.modelValue;

type Emit = Mount & Unmount & Update<CurrentType> & Focusin & Focusout & Keydown & Input<CurrentType>;
const emit = defineEmits<Emit>();
useOnMount(emit);

onMounted(() => {
  if (props.focusOnMount) {
    forceFocus();
  }
});

const inputRef: Ref<HTMLInputElement | null> = ref(null);

const forceFocus = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const isInRange = (value: number) => (props.max && value > props.max) || (props.min && value < props.min);

const handleInput = (event: InputEvent) => {
  const value = (event.target as HTMLInputElement).value;
  if (!(props.type === 'number' && isInRange(Number(value))) || value === '') {
    onUpdateModelValue(emit, value);
    onInput(emit, value);
  } else {
    (event.target as HTMLInputElement).value = String(props.modelValue);
  }
};

watch(
  () => props.modelValue,
  () => {
    if (props.type === 'number' && isInRange(Number(props.modelValue)) && props.modelValue !== '') {
      if (props.max && Number(props.modelValue) > props.max) {
        onUpdateModelValue(emit, props.max);
      } else if (props.min) {
        onUpdateModelValue(emit, props.min);
      }
    }
  },
);

const handleKeydown = (event: KeyboardEvent) => {
  onKeydown(emit, event);

  if (event.key === 'Backspace' || event.key == 'Delete') return;

  if (props.integer && !/^\d+$/.test(event.key)) {
    event.preventDefault();
  }
};

export interface InputExpose {
  input: HTMLInputElement | null;
  forceFocus: () => void;
}

defineExpose({ input: inputRef, forceFocus });

// @ts-ignore
const isDateTime = props.type === 'date' || props.type === 'time';
</script>

<template>
  <input
    ref="inputRef"
    class="hive-input"
    :class="{ error: invalid, datetime: isDateTime && !modelValue }"
    :style="style"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :step="integer ? '1' : step"
    :min="min"
    :max="max"
    @input="handleInput($event as InputEvent)"
    @focusin="onFocusin(emit)"
    @focusout="onFocusout(emit)"
    @keydown="handleKeydown($event)"
    v-maska
    :data-maska="props.mask"
  />
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

.hive-input {
  border: 1px solid transparent;
  border-radius: var(--border-radius, $border-radius);
  padding: $p-input;
  transition: background 0.2s;
  border-color: var(--border, $border);
  background-color: var(--bg-input, $bg-input);
  color: var(--text, $text);
  resize: none;
  transition: color 0.1s ease, border-color 0.1s ease;
  font-size: 1rem;
  box-sizing: border-box;
  max-width: 100%;

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

  &.datetime {
    color: #3f3f3f80;
  }

  &.error {
    border-color: var(--border-error, $border-error);
  }
}
</style>
