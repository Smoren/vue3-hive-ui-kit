<script setup lang="ts">
import { watch, ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { CommonProps } from '@/common/types/props';
import {
  Mount,
  Unmount,
  Update,
  onUpdateModelValue,
  Focusout,
  onFocusout,
  Focusin,
  onFocusin,
  Change,
  onChange,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

export interface Props extends CommonProps {
  modelValue: string;
  theme?: 'snow' | 'bubble' | '';
  toolbar?: 'essential' | 'minimal' | 'full' | '';
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  resizable: true,
  resizeDirection: 'both',
  theme: 'snow',
  toolbar: '',
  placeholder: '',
  disabled: false,
});

type Emit = Mount & Unmount & Update<string> & Focusout & Focusin & Change<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    currentValue.value = props.modelValue;
  },
);

watch(currentValue, () => {
  onChange(emit, currentValue.value);
});
</script>

<template>
  <QuillEditor
    v-model:content="currentValue"
    @update:content="onUpdateModelValue(emit, currentValue)"
    :theme="theme"
    :toolbar="toolbar"
    :placeholder="placeholder"
    :readOnly="disabled"
    contentType="html"
    @focus="onFocusin(emit)"
    @blur="onFocusout(emit)"
  />
</template>
