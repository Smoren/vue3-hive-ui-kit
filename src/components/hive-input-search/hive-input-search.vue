<script setup lang="ts">
import { ref, watch } from 'vue';
import HiveInput from '../hive-input/hive-input.vue';
import { CommonProps } from '@/common/types/props';
import {
  Focusin,
  Focusout,
  Input,
  Keydown,
  Mount,
  Unmount,
  Update,
  onInput,
  onUpdateModelValue,
  Event,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { useDebounce } from '@/common/hooks/use-debounce';

export interface Props extends CommonProps {
  modelValue: string;
  btnBackgroundColor?: string;
  isOpened?: boolean;
  placeholder?: string;
  label?: string;
  timeout?: number;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  timeout: 250,
  disabled: false,
});

type Emit = Event & Mount & Unmount & Update<string> & Focusin & Focusout & Keydown & Input<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const searchValue = ref(props.modelValue);

const handleBtnClick = () => {
  if (props.modelValue.length) {
    searchValue.value = '';
    onUpdateModelValue(emit, searchValue.value);
  }
};

watch(
  () => props.modelValue,
  (value: string) => {
    searchValue.value = value;
  },
);

const debounceUpdate = useDebounce(() => onUpdateModelValue(emit, searchValue.value), props.timeout);

const handleInput = () => {
  onInput(emit, searchValue.value);
  debounceUpdate();
};
</script>

<template>
  <div class="search">
    <button class="btn search__btn" @click="handleBtnClick" :class="{ opened: isOpened }">
      <font-awesome-icon class="img search__btn-img" icon="fa-solid fa-search" v-show="!searchValue.length" size="lg" />
      <font-awesome-icon
        class="img search__btn-img close"
        v-show="searchValue.length"
        icon="fa-solid fa-xmark"
        size="lg"
      />
    </button>
    <label v-if="label" for="input" />
    <hive-input
      v-model="searchValue"
      class="input search__input"
      :class="{ active: modelValue.length, opened: isOpened }"
      ref="searchInputRef"
      type="text"
      id="input"
      :placeholder="placeholder"
      @input="handleInput"
      :disabled="disabled"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables.scss' as *;
@use '@/assets/mixins.scss' as *;

.search {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 0 auto;

  &__btn {
    position: absolute;
    top: 50%;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px;
    transform: translateY(-50%);
    border: none;
    background: none;
    box-shadow: none;
    border-radius: 0;

    &.opened {
      box-shadow: none;
    }

    &-img {
      max-width: 25px;
      color: var(--text, $text);

      &.close {
        cursor: pointer;
      }
    }
  }

  &__input {
    width: 0;
    padding: 15px 0;

    @include transition(width);

    &.opened {
      width: 100%;
      padding: 15px;
    }
  }

  &__btn:focus ~ &__input,
  &__input:focus,
  &__input.active {
    width: 100%;
    padding: 15px;
  }
}
</style>
