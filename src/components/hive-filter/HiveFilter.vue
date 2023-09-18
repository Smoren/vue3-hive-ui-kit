<script setup lang="ts">
import { ref } from 'vue';
import { CommonProps } from '@/common/mixin/props';

interface Props extends CommonProps {
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

const emit = defineEmits(['update:modelValue']);

const searchInputRef = ref<HTMLElement | null>(null);
const searchValue = ref('');

const handleBtnClick = () => {
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }

  if (props.modelValue.length) {
    searchValue.value = '';
    emit('update:modelValue', searchValue.value);
  }
};

const handleInput = (value: string) => {
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }

  searchValue.value = value;

  let delay;
  if (delay) clearTimeout(delay);
  delay = setTimeout(() => {
    emit('update:modelValue', searchValue.value);
  }, props.timeout);
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
      <img
        class="img search__btn-img"
        src="./icons/search.svg"
        alt="Search button image"
        v-show="!modelValue.length"
      />
      <img
        class="img search__btn-img"
        src="./icons/close.svg"
        alt="Search button image"
        v-show="modelValue.length"
      />
    </button>
    <label v-if="label" for="input" />
    <input
      class="input search__input"
      :class="{ active: modelValue.length, opened: isOpened }"
      ref="searchInputRef"
      type="text"
      id="input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput(($event.target as HTMLInputElement)?.value)"
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
      border-radius: $border-radius;
      box-shadow: $box-shadow-btn;
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
