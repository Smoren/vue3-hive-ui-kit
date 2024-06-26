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
import { Value } from '@/common/types/select';

export interface Props extends CommonProps {
  options: string[] | undefined;
  modelValue: Value;
  modelValueEventName?: string;
  disabled?: boolean;
  withUndefined?: boolean;
  withNull?: boolean;
  nullTitle?: string;
  titleField?: string;
  valueField?: string;
  mask?: RegExp;
  menuHeight?: string;
  height?: string;
  focusOnMount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValueEventName: 'onAfterChange',
  disabled: false,
  nullTitle: 'Не выбрано',
  titleField: 'title',
  valueField: 'value',
  menuHeight: '10rem',
  height: '2.2rem',
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
  currentValue,
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

const onInputSearch = () => {
  onSearch(emit, searchQuery.value);
  updateActiveValue(null);
};

onMounted(() => {
  if (props.focusOnMount) searchRef.value?.forceFocus();
});

const updateCurrentValueAutocomplteHandler = (value: Value | undefined) => {
  searchQuery.value = (value ?? '') as string;
  updateCurrentValue(value, false);
};
</script>

<template>
  {{ activeValue }}
  <div v-if="options" class="hive-multiselect__wrap">
    <div class="hive-multiselect" :class="{ expand: isExpanded, disable: disabled }">
      <hive-input
        v-model="searchQuery"
        ref="searchRef"
        :disabled="disabled"
        :placeholder="(currentValue as string)"
        class="hive-multiselect__search"
        :class="{ valueNull: (modelValue === null && withNull) || modelValue === undefined }"
        :style="{ height }"
        @focusin="expand(), onFocusin(emit)"
        @focusout="collapse(false), onFocusout(emit)"
        @keydown="onKeydown(emit, $event)"
        @keydown.enter="
          onUpdateModelValue<Value>(emit, activeValue ?? searchQuery);
          updateCurrentValueAutocomplteHandler(activeValue ?? searchQuery);
        "
        @keydown.esc="collapse(false)"
        @keydown.up.prevent="setPrevActiveValue"
        @keydown.down.prevent="setNextActiveValue"
        @input="onInputSearch"
      />
      <i class="hive-multiselect__icon" :class="{ expand: isExpanded }" @mousedown="toggle" />
      <transition name="fade" appear>
        <div
          ref="menuRef"
          v-if="isExpanded"
          class="hive-multiselect__menu"
          :style="{
            maxHeight: menuHeight,
          }"
        >
          <div
            v-for="(item, i) in filteredOptions"
            :key="i"
            class="hive-multiselect__menu-item"
            :class="{
              selected: item[1][valueField] === activeValue || (item[1][valueField] === null && activeValue === 'null'),
            }"
            @click="
              updateCurrentValueAutocomplteHandler(item[1][valueField]),
                onUpdateModelValue<Value>(emit, item[1][valueField])
            "
            @mouseover="updateActiveValue(item[1][valueField])"
            @mousedown.prevent
            :data-value="JSON.stringify(item[1][valueField])"
          >
            {{ item[1][titleField] }}
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
$drop-down-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
$drop-down-padding: 0.5em 1em 0.5em 1em;

.hive-multiselect {
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

  &__search {
    border: none;
    padding: $drop-down-padding;
    width: calc(100% - 2rem);
    cursor: default;
    font-size: inherit;

    &::placeholder {
      opacity: 1;
      color: $text;
    }

    &:focus {
      cursor: text;

      &::placeholder {
        opacity: 0.5;
      }
    }

    &.valueNull {
      opacity: 0.8;
    }
  }

  &__icon {
    cursor: auto;
    line-height: 1.2rem;
    opacity: 0.7;
    background: none !important;
    font-style: normal;
    // font-size: 11px;
    margin: auto 0;

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
