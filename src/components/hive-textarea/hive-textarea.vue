<script lang="ts" setup>
import { ref } from 'vue';
import { CommonProps } from '@/common/mixin/props';

interface Props extends CommonProps {
  modelValue: string;
  modelValueEventName?: string;
  label?: string;
  rowsCount?: number;
  placeholder?: string;
  resizable?: boolean;
  resizeDirection?: 'both' | 'vertical' | 'horizontal';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  modelValueEventName: 'input',
  label: '',
  resizable: true,
  placeholder: 'placeholder',
});

const emit = defineEmits(['update:modelValue']);

const currentValue = ref(props.modelValue);

const handleEvent = (event: Event) => {
  currentValue.value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', currentValue.value);
};
</script>

<template>
  <div v-bind="attrs" :class="classes" :style="style" class="ui form">
    <div class="field">
      <label :for="id">{{ label }}</label>
      <textarea
        :value="modelValue"
        :id="id"
        :placeholder="Введите текст..."
        :rows="rowsCount"
        :class="[{ resizable: resizable }, resizeDirection ?? '']"
        @input="handleEvent"
      />
      <!-- <textarea
        :id="id"
        :value="currentValue"
        @keydown="onKeyDown"
        @input="
          currentValue = ($event.target as HTMLInputElement).value;
          handleEvent($event);
        "
        :rows="rowsCount"
        :placeholder="placeholder"
        @change="handleEvent"
        @focus="handleEvent"
        @focusout="handleEvent"
        :style="textAreaStyle"
      /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg-color: #ffffff;
$bg-hover: #d3eafff5;
$text-color: rgba(0, 0, 0, 0.87);
$border-color: rgba(34, 36, 38, 0.15);
$border-radius: 5px;
$border-color-focus: #85b7d9;
$box-shadow-focus: 0 0 0 0 rgba(34, 36, 38, 0.35) inset;

.field {
  height: 100%;
  width: 100%;
}

textarea {
  -webkit-appearance: none;
  -webkit-tap-highlight-color: $border-color;
  -webkit-box-shadow: 0 0 0 0 transparent inset;
  -webkit-transition: color 0.1s ease, border-color 0.1s ease;
  padding: 0.5rem 1rem;
  margin: 0;
  outline: none;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  box-shadow: 0 0 0 0 transparent inset;
  font-size: 1rem;
  line-height: 1.2rem;
  background: $bg-color;
  color: $text-color;
  resize: none;
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  transition: color 0.1s ease, border-color 0.1s ease;

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

  &:focus {
    border-color: $border-color-focus;
    -webkit-box-shadow: $box-shadow-focus;
    box-shadow: $box-shadow-focus;
  }
}
</style>
