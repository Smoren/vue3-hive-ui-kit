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
}
const props = withDefaults(defineProps<Props>(), {
  timeout: 250,
});

type Emit = Mount & Unmount & Update<string> & Focusin & Focusout & Keydown & Input<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const searchValue = ref(props.modelValue);

const handleBtnClick = () => {
  if (props.modelValue.length) {
    searchValue.value = '';
    onUpdateModelValue(emit, searchValue.value);
  }
};

const debounceUpdate = useDebounce(() => onUpdateModelValue(emit, searchValue.value), props.timeout);

const handleInput = () => {
  onInput(emit, searchValue.value);
  debounceUpdate();
};
</script>

<template>
  <div class="search">
    <button
      class="btn search__btn"
      :style="{ backgroundColor: btnBackgroundColor }"
      @click="handleBtnClick"
      :class="{ opened: isOpened }"
    >
      <img class="img search__btn-img" src="./icons/search.svg" alt="Search button image" v-show="!modelValue.length" />
      <img class="img search__btn-img" src="./icons/close.svg" alt="Search button image" v-show="modelValue.length" />
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
    />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';
@import '@/assets/mixins.scss';

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
    border-radius: 50%;
    box-shadow: $box-shadow-general;
    transform: translateY(-50%);
    border: none;
    background-color: #9a9a9a;

    &.opened {
      box-shadow: none;
    }

    &-img {
      max-width: 25px;
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
