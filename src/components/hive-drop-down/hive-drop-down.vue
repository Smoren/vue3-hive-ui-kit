<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import HiveInput from '@/components/hive-input/hive-input.vue';
import HiveObservable from '@/components/hive-observable/hive-observable.vue';
import { CommonProps } from '@/common/mixin/props';
import { useOnMount } from '@/common/hooks/use-mount';
import {
  Focusin,
  Focusout,
  Keydown,
  Mount,
  Unmount,
  Update,
  Search,
  Input,
  onInput,
  onFocusout,
  onFocusin,
  onKeydown,
  onSearch,
  onUpdateModelValue,
} from '@/common/mixin/emits';
import { useExpandListMethods } from '@/common/hooks/use-expand-list-methods';
import { useList, ListConfig } from './hooks/use-list';
import { useListMethods } from './hooks/use-list-methods';
import { Options } from '@/common/types/option';

interface Props extends CommonProps {
  options: Options;
  modelValue: string;
  modelValueEventName?: string;
  disabled?: boolean;
  nullTitle?: string;
  mask?: RegExp;
  invalid?: boolean;
  menuHeight?: string;
  titleField?: string;
  valueField?: string;
  imgsArray?: string[] | Record<string, string>;
  empty?: boolean;
  withNull?: boolean;
  focusOnMount?: boolean;
  minQueryLength?: number;
  mcw?: string;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  modelValueEventName: 'input',
  disabled: false,
  nullTitle: 'Не выбрано',
  invalid: false,
  integer: false,
  titleField: 'title',
  valueField: 'value',
  mcw: '0px',
});

type Emit = Mount & Unmount & Update<string> & Focusin & Focusout & Keydown & Input<string> & Search<string>;

const emit = defineEmits<Emit>();

useOnMount(emit);

const menuRef = ref(null);

const { currentValue, activeValue, currentOption, currentOptions, filteredOptions, searchQuery } = useList(
  props as ListConfig,
);

const {
  isExpanded,
  searchRef,
  expand,
  collapse,
  toggle,
  updateActiveValue,
  setPrevActiveValue,
  setNextActiveValue,
  onAppear,
  onDisappear,
} = useExpandListMethods({
  searchQuery,
  currentValue,
  activeValue,
  filteredOptions,
});

const { updateCurrentValue } = useListMethods({
  activeValue,
  currentValue,
  filteredOptions,
  collapse,
});

onMounted(() => {
  onUpdateModelValue(emit, currentValue.value as string);
});

watch(currentValue, () => {
  onUpdateModelValue(emit, currentValue.value as string);
});

watch(
  () => props.modelValue,
  () => {
    updateCurrentValue(props.modelValue);
  },
);

watch(
  () => props.options as Options,
  (newValue) => {
    if (Array.isArray(newValue)) {
      if (props.withNull) {
        newValue.unshift({
          [props.titleField]: props.nullTitle,
          [props.valueField ?? 'value']: null,
        });
      }
      currentOptions.value = newValue;
    } else {
      currentOptions.value = newValue;
    }
  },
);

watch(
  () => activeValue.value,
  (newValue) => {
    const activeOption = filteredOptions.value[newValue as string];
    if (!activeOption) {
      return;
    }

    if (!activeOption.visible && isExpanded.value) {
      const el = (menuRef.value as unknown as HTMLElement)?.querySelector(`[data-value='${newValue}']`);
      (el as unknown as HTMLElement)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  },
  { flush: 'post' },
);

watch(
  () => searchQuery.value,
  (newValue) => {
    onSearch(emit, newValue);
  },
);

const forceFocus = () => {
  if (searchRef.value) {
    searchRef.value.forceFocus();
  }
};

export interface InputExpose {
  input: HTMLInputElement | null;
  forceFocus: () => void;
}

defineExpose({ searchRef, forceFocus });
</script>

<template>
  <div class="hive-drop-down" :class="{ selection: isExpanded }" :style="style" @focusin="expand" @focusout="collapse">
    <hive-input
      v-model="searchQuery"
      ref="searchRef"
      class="hive-drop-down__search"
      :placeholder="currentOption?.title"
      tabindex="0"
      :disabled="disabled"
      @focusin="expand, onFocusin(emit)"
      @focusout="collapse, onFocusout(emit)"
      @keydown="onKeydown(emit, $event)"
      @keydown.enter="updateCurrentValue(activeValue)"
      @keydown.up.prevent="setPrevActiveValue"
      @keydown.down.prevent="setNextActiveValue"
      @keydown.esc="collapse"
      @input="onInput(emit, $event as string)"
    />
    <i class="hive-drop-down__icon" :class="{ expand: isExpanded }" @mousedown="toggle" />
    <div
      ref="menuRef"
      class="hive-drop-down__menu"
      :class="{ visible: isExpanded }"
      :style="{
        height: menuHeight,
      }"
    >
      <hive-observable
        v-for="option in filteredOptions"
        :key="option.key"
        :root="menuRef as unknown as Record<string, any>"
        :threshold="0.2"
        @appear="onAppear(option)"
        @disappear="onDisappear(option)"
      >
        <div
          class="hive-drop-down__menu-item"
          :class="{
            selected: option.value === activeValue,
          }"
          :data-value="option.value"
          @click="updateCurrentValue(option.value)"
          @mouseover="updateActiveValue(option.value)"
          @mousedown.prevent
        >
          <div v-if="imgsArray" class="hive-drop-down__text-img">
            <!-- TODO -->
            <!-- <img :src="imgsArray[index]" alt="" /> -->
            <div>
              {{ option?.title }}
            </div>
          </div>
          <span v-else>
            {{ option?.title }}
          </span>
        </div>
      </hive-observable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

$drop-down-z_search: 2;
$drop-down-z_menu: 11;
$drop-down-border: 1px solid var(--border, $border);
$drop-down-selected_background: rgba(0, 0, 0, 0.03);
$drop-down-selected_color: rgba(0, 0, 0, 0.95);
$drop-down-border-top: #fafafa;
$drop-down-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
$drop-down-padding: 0.8em 1em 0.8em 1em;

.hive-drop-down {
  position: relative;
  cursor: pointer;
  word-wrap: break-word;
  line-height: 1.2rem;
  white-space: normal;
  text-align: left;
  outline: 0;
  transform: rotateZ(0deg);
  -webkit-transform: rotateZ(0deg);
  background-color: none;
  display: inline-block;
  color: var(--text, $text);
  box-shadow: none;
  border: $drop-down-border;
  border-radius: var(--border-radius, $border-radius);
  padding: $drop-down-padding;
  display: flex;
  align-items: center;
  justify-content: right;
  transition:
    box-shadow 0.1s ease,
    width 0.1s ease;

  &.selection {
    box-shadow: $drop-down-box-shadow;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  &__search {
    position: absolute;
    left: 1px;
    top: 0;
    z-index: $drop-down-z_search;
    height: 100%;
    width: 100%;
    line-height: 1.2rem;
    padding: $drop-down-padding;
    cursor: default !important;
    background: none transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

    &::placeholder {
      opacity: 1;
    }

    &:focus {
      cursor: text;

      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  &__icon {
    cursor: auto;
    line-height: 1.2rem;
    opacity: 0.7;
    background: none !important;
    font-style: normal;

    &:before {
      content: '▼';
    }

    &.expand {
      &:before {
        content: '▲';
      }
    }
  }

  &__menu {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    cursor: auto;
    margin: 0 -1px;
    padding: 0 0;
    overflow-y: auto;
    backface-visibility: hidden;
    -webkit-overflow-scrolling: auto;
    outline: none;
    max-height: 16rem;
    min-width: calc(100% + v-bind(mcw)) !important;
    width: calc(100% + v-bind(mcw)) !important;
    border-top-width: 0 !important;
    border-radius: 0 0 $border-radius $border-radius;
    box-shadow: $drop-down-box-shadow;
    transition: opacity 0.1s ease;
    background-color: var(--bg-input, $bg-input);
    text-shadow: none;
    text-align: left;
    border: $drop-down-border;
    z-index: $drop-down-z_menu;
    will-change: transform, opacity;
    animation-iteration-count: 1;
    animation-duration: 300ms;
    animation-timing-function: ease;
    animation-fill-mode: both;
    visibility: hidden;

    &.visible {
      box-shadow: $drop-down-box-shadow;
      border-top-width: 0 !important;
      display: block !important;
      visibility: visible !important;
    }

    &-item {
      border-top: 1px solid $drop-down-border-top;
      padding: $p-input !important;
      white-space: normal;
      word-wrap: normal;

      &.selected {
        background: $drop-down-selected_background;
        color: $drop-down-selected_color;
      }
    }
  }

  &__text {
    cursor: text;
    position: relative;
    z-index: auto;
    display: inline-block;
    transition: none;
    padding-left: 1rem;

    &-img {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}
</style>
