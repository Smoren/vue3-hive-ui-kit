<script lang="ts" setup>
import { ref, watch } from 'vue';
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
} from '@/common/mixin/emits';
import { useExpandListMethods } from '@/common/hooks/use-expand-list-methods';
import { useList, ListConfig } from './hooks/use-list';
import { useListMethods } from './hooks/use-list-methods';
import { Options } from '@/common/types/option';

interface Props extends CommonProps {
  options: Options;
  modelValue?: string;
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
});

type Emit = Mount & Unmount & Update<string> & Focusin & Focusout & Keydown & Input<string> & Search<string>;

const emit = defineEmits<Emit>();

useOnMount(emit);

const menuRef = ref(null);

const { currentValue, activeValue, currentOption, currentOptions, filteredOptions, searchQuery } =
  useList(props as ListConfig);

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
</script>

<template>
  <div class="hive-drop-down" :class="{ 'active visible': isExpanded }" @focusin="expand()" @focusout="collapse()">
    <i class="hive-drop-down__icon" :class="{expand: isExpanded }" @mousedown="toggle" />
    <hive-input
      v-model="searchQuery"
      ref="searchRef"
      class="hive-drop-down__search"
      placeholder=""
      tabindex="0"
      :disabled="disabled"
      @focusin="expand(), onFocusin(emit)"
      @focusout="collapse(), onFocusout(emit)"
      @keydown="onKeydown(emit, $event)"
      @keydown.enter="updateCurrentValue(activeValue)"
      @keydown.up.prevent="setPrevActiveValue"
      @keydown.down.prevent="setNextActiveValue"
      @keydown.esc="collapse"
      @input="onInput(emit, $event as string)"
    />
    <div class="hive-drop-down__text" :class="{ filtered: searchQuery.length > 0 }">
      <div v-if="imgsArray" class="hive-drop-down__text-img">
        <!-- TODO -->
        <!-- <img :src="imgsArray[currentOption?.title]" alt="" /> -->
        <div>
          {{ currentOption?.title }}
        </div>
      </div>
      <span v-else>
        {{ currentOption?.title }}
      </span>
    </div>
    <div
      ref="menuRef"
      class="hive-drop-down__menu"
      :class="{ visible: isExpanded, hidden: isExpanded }"
      :style="{
        height: menuHeight,
      }"
    >
      <hive-observable
        v-for="option in filteredOptions"
        :key="option.key"
        :root="(menuRef as unknown as Record<string, any>)"
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
$drop-down-z-active: 10;
$drop-down-z_menu: 11;
$drop-down-max-height: 250px;
$drop-down-selected_background: rgba(0, 0, 0, 0.03);
$drop-down-selected_color: rgba(0, 0, 0, 0.95);
$drop-down-border-top: #fafafa;
$drop-down-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
$drop-down-border-color-hover: rgba(34, 36, 38, 0.35);

.hive-drop-down {
  position: relative;
  cursor: pointer;
  word-wrap: break-word;
  line-height: 1em;
  white-space: normal;
  text-align: left;
  outline: 0;
  transform: rotateZ(0deg);
  background-color: var(--bg-input, $bg-input);
  display: inline-block;
  color: var(--text, $text);
  box-shadow: none;
  border: 1px solid var(--border, $border);
  padding: $p-input;
  border-radius: var(--border-radius, $border-radius);
  transition: box-shadow 0.1s ease, width 0.1s ease;

  &__search {
    position: absolute;
    top: 0;
    z-index: $drop-down-z_search;
    background: none transparent;
    border: none;
    box-shadow: none;
    width: 100%;
    height: 100%;
    outline: none;
    line-height: 2rem;
    padding: $p-input;
    cursor: default;
    font: inherit;

    &:focus {
      cursor: text;
      border: none;
    }
  }

  &__text {
    cursor: text;
    position: relative;
    z-index: auto;
    display: inline-block;
    transition: none;

    &-img {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }

  &__icon {
    cursor: auto;
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    right: 1rem;
    opacity: 0.7;
    background: none;
    
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
    cursor: auto;
    position: absolute;
    left: 0;
    z-index: $drop-down-z_menu;
    display: none;
    outline: none;
    top: 95%;
    margin: 0;
    padding: 0 0;
    background-color: var(--bg-input, $bg-input);
    text-shadow: none;
    text-align: left;
    transition: opacity 0.1s ease;
    will-change: transform, opacity;
    overflow-x: hidden;
    overflow-y: auto;
    backface-visibility: hidden;
    border-top-width: 0 !important;
    width: auto;
    outline: none;
    margin: 0 -1px;
    min-width: 100%;
    width: 100%;
    transition: opacity 0.1s ease;
    max-height: $drop-down-max-height;

    &:after {
      display: none;
    }

    &:before {
      display: none;
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

  &:hover {
    border-color: $drop-down-border-color-hover;
    box-shadow: none;
  }

  &:focus {
    border-color: $border-focus;
    box-shadow: none;

    .menu {
      border-color: $border-focus;
      box-shadow: $drop-down-box-shadow;
    }
  }

  &.active {
    z-index: $drop-down-z-active;
    border-color: $border-focus;
    box-shadow: $drop-down-box-shadow;

    .text {
      color: $text;

      &.filtered {
        color: transparent;
      }
    }

    .menu {
      border-color: $border-focus;
      box-shadow: $drop-down-box-shadow;
    }
  }
}

.active .visible {
  display: block;
  border: 1px solid $border-focus;
  padding-top: 1rem;
}
</style>
