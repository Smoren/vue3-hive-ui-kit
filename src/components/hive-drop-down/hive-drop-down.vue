<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { CommonProps } from '@/common/types/props';
import HiveInput from '@/components/hive-input/hive-input.vue';
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
  onUpdateModelValue,
  Search,
  onSearch,
  Event,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { useListMethods } from '@/common/hooks/use-list-methods';
import type { Options } from '@/common/types/option';
import { Value } from '@/common/types/select';

export interface Props extends CommonProps {
  options: Options | undefined;
  modelValue: Value;
  disabled?: boolean;
  withUndefined?: boolean;
  withNull?: boolean;
  nullTitle?: string;
  titleField?: string;
  valueField?: string;
  mask?: RegExp;
  menuHeight?: string;
  focusOnMount?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValueEventName: 'onAfterChange',
  disabled: false,
  nullTitle: 'Не выбрано',
  titleField: 'title',
  valueField: 'value',
  menuHeight: '10rem',
  focusOnMount: false,
});

type Emit = Event & Mount & Unmount & Update<Value> & Focusin & Focusout & Keydown & Search<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const configOptions = reactive({
  options: props.options,
  modelValue: props.modelValue,
  withUndefined: props.withUndefined,
  withNull: props.withNull,
  nullTitle: props.nullTitle,
  fieldTitle: props.titleField,
  fieldValue: props.valueField,
});

const {
  isExpanded,
  activeValue,
  current,
  updateCurrentValue,
  updateActiveValue,
  searchQuery,
  searchRef,
  expand,
  collapse,
  toggle,
  filteredOptions,
  currentOptions,
  setPrevActiveValue,
  setNextActiveValue,
  menuRef,
} = useListMethods(configOptions);

watch(
  () => props.options,
  () => {
    configOptions.options = props.options;
    currentOptions.value = useListMethods(configOptions).currentOptions.value;
    filteredOptions.value = useListMethods(configOptions).filteredOptions.value;
    current.value = useListMethods(configOptions).current.value;
  },
);

watch(
  () => props.modelValue,
  () => {
    if (!Array.isArray(props.modelValue)) {
      updateCurrentValue(props.modelValue);
    }
  },
);

const focusSearch = () => {
  searchRef.value?.forceFocus();
};

onMounted(() => {
  if (props.focusOnMount) focusSearch();
});

defineExpose({ current });
</script>

<template>
  <div v-if="options" class="hive-drop-down__wrap">
    <div class="hive-drop-down" :class="{ expand: isExpanded, disable: disabled }" @click="focusSearch">
      <div class="hive-drop-down__content" :class="{ 'no-padding': isExpanded }">
        <div class="hive-drop-down__title" v-if="!isExpanded">
          {{ current ? String(current[titleField] ?? nullTitle) : '' }}
        </div>
        <hive-input
          v-model="searchQuery"
          ref="searchRef"
          :disabled="disabled"
          :placeholder="placeholder"
          class="hive-drop-down__search"
          :class="{
            'value-null': (modelValue === null && withNull) || modelValue === undefined,
            'no-width': !isExpanded,
            'no-padding': !isExpanded,
          }"
          @focusin="expand(), onFocusin(emit)"
          @focusout="collapse(), onFocusout(emit)"
          @keydown="onKeydown(emit, $event)"
          @keydown.enter="updateCurrentValue(activeValue), onUpdateModelValue<Value>(emit, activeValue)"
          @keydown.esc="collapse()"
          @keydown.up.prevent="setPrevActiveValue"
          @keydown.down.prevent="setNextActiveValue"
          @input="onSearch<string>(emit, $event as string)"
        />
        <i class="hive-drop-down__icon" :class="{ expand: isExpanded }" @mousedown="toggle" />
      </div>
      <transition name="fade" appear>
        <div
          ref="menuRef"
          v-if="isExpanded"
          class="hive-drop-down__menu"
          :style="{
            maxHeight: menuHeight,
          }"
        >
          <div
            v-for="(item, i) in filteredOptions"
            :key="i"
            class="hive-drop-down__menu-item"
            :class="{
              selected: item[1][valueField] === activeValue || (item[1][valueField] === null && activeValue === 'null'),
            }"
            @click.stop="updateCurrentValue(item[1][valueField]), onUpdateModelValue<Value>(emit, item[1][valueField])"
            @mouseover="updateActiveValue(item[1][valueField])"
            @mousedown.prevent
            :data-value="item[1][valueField]"
          >
            {{ item[1][titleField] ?? nullTitle }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$drop-down-z_menu: 1;
$border-width: 1px;
$drop-down-border: $border-width solid var(--border, $border);
$drop-down-selected_background: var(--bg-selected, $bg-selected);
$drop-down-selected_color: rgba(0, 0, 0, 0.95);
$drop-down-border-top: #fafafa;
$drop-down-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
$drop-down-padding: 0.5em 1em 0.5em 1em;
$height: var(--height, calc($common-widget-height));

.hive-drop-down {
  width: 100%;
  position: relative;
  cursor: pointer;
  text-align: left;
  text-shadow: none;
  outline: 0;
  display: inline-block;
  color: var(--text, $text);
  border: $drop-down-border;
  border-radius: var(--border-radius, $border-radius);
  transition: opacity 0.1s ease;
  background-color: var(--bg-input, $bg-input);
  will-change: transform, opacity;
  animation-iteration-count: 1;
  animation-duration: 300ms;
  animation-timing-function: ease;
  animation-fill-mode: both;
  min-width: fit-content;

  .no-width {
    width: 0;
  }

  .no-padding {
    padding: 0;
  }

  &.expand {
    z-index: $drop-down-z_menu + 1;
    border-color: var(--border-focus, $border-focus);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &.disable {
    border-color: var(--border-disabled, $border-disabled);
    opacity: 0.6;
    pointer-events: none;
    cursor: pointer;
  }

  &__wrap {
    position: relative;
    width: 100%;
    display: flex;
    background-color: none;
    cursor: default;
  }

  &__content {
    display: flex;
  }

  &__search {
    border: none;
    padding: $drop-down-padding;
    width: calc(100% - 2rem);
    cursor: default;
    font-size: inherit;
    height: $height;

    &:focus {
      cursor: text;

      &::placeholder {
        opacity: 0.5;
      }
    }

    &.value-null {
      opacity: 0.8;
    }
  }

  &__title {
    padding: $drop-down-padding;
    width: calc(100% - 2rem);
    height: $height;
    box-sizing: border-box;
    line-height: 18px;
    min-width: fit-content;
  }

  &__icon {
    cursor: auto;
    line-height: 1.2rem;
    opacity: 0.7;
    background: none !important;
    font-style: normal;
    margin: auto 0;
    margin-right: 1rem;

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
    box-sizing: content-box;
    position: absolute;
    left: -$border-width;
    top: 100%;
    width: 100%;
    overflow-y: auto;
    background-color: var(--bg-input, $bg-input);
    z-index: $drop-down-z_menu;
    border: $drop-down-border;
    border-color: var(--border-focus, $border-focus);
    border-radius: var(--border-radius, $border-radius);
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    &-item {
      border-top: 1px solid var(--drop-down-border-top, $drop-down-border-top);
      padding: $p-input !important;
      white-space: normal;
      word-wrap: normal;

      &.selected {
        background: $drop-down-selected_background;
      }
    }
  }
}
</style>
