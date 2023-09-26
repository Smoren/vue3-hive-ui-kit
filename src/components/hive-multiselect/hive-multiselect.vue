<script lang="ts" setup>
import { Ref, reactive, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
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
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { Options, Value } from '@/common/types/select';
import { useListMethods } from '@/common/hooks/use-list-methods';
import DeleteIcon from '@/components/hive-multiselect/assets/delete-icon.svg';

export interface Props extends CommonProps {
  modelValue: Value[];
  options: Options | undefined;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  name?: string;
  height?: string;
  withUndefined?: boolean;
  withNull?: boolean;
  menuHeight?: string;
  nullTitle?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  name: 'radio-group',
  menuHeight: '10rem',
  height: '2.2rem',
  disabled: false,
  nullTitle: 'Не выбрано',
});

type Emit = Mount & Unmount & Update<Value[]> & Focusin & Focusout & Keydown & Search<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const multiSelectRef = ref(undefined);
const menuRef = ref(undefined);

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
} = useListMethods(configOptions);

const changeValue = (value: Value) => {
  if (!currentValue.value || !value || !Array.isArray(currentValue.value)) return;

  const includes = currentValue.value?.includes(value);

  if (!includes) {
    currentValue.value?.push(value);
  } else {
    const index = currentValue.value.indexOf(value);
    if (index !== -1) currentValue.value.splice(index, 1);
  }
  searchQuery.value = '';
  onUpdateModelValue<Value[]>(emit, currentValue.value);
};

const deleteLast = (value: Value) => {
  if (!searchQuery.value.length) {
    changeValue(value);
  }
};

watch(
  () => props.modelValue,
  () => {
    currentValue.value = props.modelValue;
  },
  { deep: true },
);

watch(
  () => props.options,
  () => {
    filteredOptions.value = useListMethods(configOptions).filteredOptions.value;
  },
);

watch(
  currentValue,
  () => {
    filteredOptions.value = useListMethods(configOptions).filteredOptions.value;
    setNextActiveValue();
  },
  { deep: true },
);
</script>

<template>
  <div class="hive-multiselect__wrap" ref="multiSelectRef" :class="{ expand: isExpanded, disable: disabled }">
    <div class="hive-multiselect__selected">
      <template v-if="currentValue && Array.isArray(currentValue) && currentValue.length">
        <div
          v-for="value in currentValue"
          :key="Array.isArray(value) ? value[0] : value"
          class="hive-multiselect__selected-item"
          @mousedown.stop.prevent
        >
          {{ currentOptions.get(value).title }}
          <img :src="DeleteIcon" class="hive-multiselect__selected-item__img" @click="changeValue(value)" />
        </div>
      </template>
      <hive-input
        v-model="searchQuery"
        ref="searchRef"
        :disabled="disabled"
        :placeholder="current ? String(current[titleField]) : ''"
        class="hive-multiselect__search"
        :class="{
          valueNull: (modelValue === null && withNull) || modelValue === undefined,
          'no-padding': Array.isArray(currentValue) && currentValue.length,
        }"
        :style="{ height }"
        @focusin="expand(), onFocusin(emit)"
        @focusout="collapse(), onFocusout(emit)"
        @keydown="onKeydown(emit, $event)"
        @keydown.enter="changeValue(activeValue)"
        @keydown.esc="collapse"
        @keydown.up.prevent="setPrevActiveValue"
        @keydown.down.prevent="setNextActiveValue"
        @keydown.delete="deleteLast((currentValue as Value[])?.at(-1))"
        @input="onSearch<string>(emit, $event as string)"
      />
    </div>
    <i class="hive-multiselect__icon" :class="{ expand: isExpanded }" @mousedown="toggle" />
    <div
      ref="menuRef"
      v-if="isExpanded"
      class="hive-multiselect__menu"
      :style="{
        maxHeight: menuHeight,
      }"
    >
      <template v-for="(item, i) in filteredOptions" :key="i">
        <div
          class="hive-multiselect__menu-item"
          :class="{
            selected: item[1][valueField] === activeValue || (item[1][valueField] === null && activeValue === 'null'),
          }"
          @click="changeValue(item[1][valueField])"
          @mouseover="updateActiveValue(item[1][valueField])"
          @mousedown.prevent
        >
          {{ item[1][titleField] }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

$drop-down-z_menu: 1;
$border-width: 1px;
$drop-down-border: $border-width solid var(--border, $border);
$drop-down-selected_background: rgba(0, 0, 0, 0.03);
$drop-down-selected_color: rgba(0, 0, 0, 0.95);
$drop-down-border-top: #fafafa;
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

  &__selected {
    display: flex;
    align-items: center;
    gap: 0 5px;
    margin: 0 5px;
    box-sizing: border-box;
    flex-wrap: wrap;
    width: 100%;

    &-item {
      box-sizing: content-box;
      border: 1px solid transparent;
      border-radius: var(--border-radius, $border-radius);
      box-shadow: 0 0 0 1px #22242626 inset;
      padding: 3px 3px;
      margin: 3px 0;
      vertical-align: baseline;
      background-color: #e8e8e8;
      color: #0009;
      text-transform: none;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;

      &__img {
        width: 15px;
        height: 15px;
        margin-top: 2px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  &__wrap {
    border: 1px solid transparent;
    border-radius: var(--border-radius, $border-radius);
    border-color: var(--border, $border);
    position: relative;
    width: 100%;
    display: flex;
    background-color: none;
    cursor: default;

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
  }

  &__icon {
    cursor: auto;
    line-height: 1.2rem;
    opacity: 0.7;
    background: none !important;
    font-style: normal;
    // font-size: 11px;
    margin: auto 0;
    margin-right: 15px;

    &:before {
      content: '▼';
    }

    &.expand {
      &:before {
        content: '▲';
      }
    }
  }

  &__search {
    border: none;
    padding: $drop-down-padding;
    cursor: default;
    font-size: inherit;
    border: none;
    flex-grow: 100;

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

    &.no-padding {
      padding-left: 0;
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
    z-index: 100;

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
}
</style>
