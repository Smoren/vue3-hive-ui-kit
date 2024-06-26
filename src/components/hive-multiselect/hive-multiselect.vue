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
import type { Options } from '@/common/types/option';
import { Value } from '@/common/types/select';
import { useListMethods } from '@/common/hooks/use-list-methods';
import DeleteIcon from '@/components/hive-multiselect/assets/delete-icon.svg';
import { computed } from 'vue';

export interface Props extends CommonProps {
  options: Options | undefined;
  modelValue: Value[] | null;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  height?: string;
  withUndefined?: boolean;
  withNull?: boolean;
  menuHeight?: string;
  nullTitle?: string;
  disabled?: boolean;
  focusOnMount?: boolean;
  isPlaceholderSeenWithValues: true;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  menuHeight: '10rem',
  height: '2.2rem',
  disabled: false,
  nullTitle: 'Не выбрано',
  focusOnMount: false,
  placeholder: '',
  isPlaceholderSeenWithValues: true,
});

type Emit = Event & Mount & Unmount & Update<Value[]> & Focusin & Focusout & Keydown & Search<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const configOptions = reactive({
  options: props.options,
  modelValue: props.modelValue === null ? [] : props.modelValue,
  withUndefined: props.withUndefined,
  withNull: false,
  nullTitle: props.nullTitle,
  fieldTitle: props.titleField,
  fieldValue: props.valueField,
});

const useListRes = useListMethods(configOptions);

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
  menuRef,
  setFirstActiveValue,
} = useListRes;

let { stopWatchSearch } = useListRes;

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
  setFirstActiveValue();
};

const deleteLast = (value: Value) => {
  if (!searchQuery.value.length) {
    changeValue(value);
  }
};

watch(
  () => props.modelValue,
  () => {
    // stopWatchSearch();
    currentValue.value = props.modelValue;
    configOptions.modelValue = props.modelValue === null ? [] : props.modelValue;
    const res = useListMethods(configOptions);
    current.value = res.current.value;
    currentOptions.value = res.currentOptions.value;
    filteredOptions.value = res.filteredOptions.value;
    searchQuery.value = res.searchQuery.value;
    stopWatchSearch = res.stopWatchSearch;
  },
  { deep: true },
);

watch(
  () => props.options,
  () => {
    configOptions.options = props.options;
    const res = useListMethods(configOptions);
    currentOptions.value = res.currentOptions.value;
    filteredOptions.value = res.filteredOptions.value;
    current.value = res.current.value;
    activeValue.value = res.activeValue.value;
    setFirstActiveValue();
  },
  { deep: true },
);

watch(
  currentValue,
  () => {
    const res = useListMethods(configOptions);
    filteredOptions.value = res.filteredOptions.value;
    res.setNextActiveValue();
  },
  { deep: true },
);

watch(searchQuery, () => {
  setFirstActiveValue();
});

watch(filteredOptions, () => {
  setFirstActiveValue();
});

const computedPlaceholder = computed(() =>
  current.value ? String(current.value[props.titleField]) : props.isPlaceholderSeenWithValues ? props.placeholder : '',
);

onMounted(() => {
  if (props.focusOnMount) searchRef.value?.forceFocus();
});
</script>

<template>
  <div class="hive-multiselect__wrap">
    <div class="hive-multiselect" :class="{ expand: isExpanded, disable: disabled }">
      <div class="hive-multiselect__selected">
        <template v-if="currentValue && Array.isArray(currentValue) && currentValue.length">
          <div
            v-for="value in currentValue"
            :key="Array.isArray(value) ? value[0] : value"
            class="hive-multiselect__selected-item"
            @mousedown.stop.prevent
          >
            {{
              (currentOptions.get(value) && (currentOptions.get(value)[titleField] ?? nullTitle)) ??
              currentOptions.get(value) ??
              value
            }}
            <font-awesome-icon
              class="hive-multiselect__selected-item__img"
              icon="fa-solid fa-xmark"
              size="md"
              @click="changeValue(value)"
            />
          </div>
        </template>
        <hive-input
          v-model="searchQuery"
          ref="searchRef"
          :disabled="disabled"
          :placeholder="computedPlaceholder"
          class="hive-multiselect__search"
          :class="{
            valueNull: (modelValue === null && withNull) || modelValue === undefined,
            'no-padding': Array.isArray(currentValue) && currentValue.length,
          }"
          :style="{ height }"
          @focusin="expand(), onFocusin(emit)"
          @focusout="collapse(), onFocusout(emit)"
          @keydown="onKeydown(emit, $event)"
          @keydown.enter.exact="changeValue(activeValue)"
          @keydown.esc="collapse()"
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
            :data-value="JSON.stringify(item[1][valueField])"
          >
            {{ item[1][titleField] ?? nullTitle }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$multiselect-z_menu: 1;
$border-width: 1px;
$multiselect-border: $border-width solid var(--border, $border);
$multiselect-selected_background: rgba(0, 0, 0, 0.03);
$multiselect-selected_color: rgba(0, 0, 0, 0.95);
$multiselect-border-top: #fafafa;
$multiselect-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
$multiselect-padding: 0.5em 1em 0.5em 1em;

.hive-multiselect {
  width: 100%;
  position: relative;
  cursor: pointer;
  text-align: left;
  text-shadow: none;
  outline: 0;
  display: flex;
  color: var(--text, $text);
  border: $multiselect-border;
  border-radius: var(--border-radius, $border-radius);
  transition: opacity 0.1s ease;
  background-color: var(--bg-input, $bg-input);
  will-change: transform, opacity;
  animation-iteration-count: 1;
  animation-duration: 300ms;
  animation-timing-function: ease;
  animation-fill-mode: both;

  &.expand {
    z-index: $multiselect-z_menu + 1;
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
      padding: 3px 9px;
      margin: 3px 0;
      vertical-align: baseline;
      background-color: #e8e8e8;
      color: var(--multiselect-text, $multiselect-text);
      text-transform: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: break-spaces;
      font-size: 14px;

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

  &__icon {
    cursor: auto;
    line-height: 1.2rem;
    opacity: 0.7;
    background: none !important;
    font-style: normal;
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
    padding: $multiselect-padding;
    cursor: default;
    font-size: inherit;
    border: none;
    flex-grow: 100;

    &::placeholder {
      opacity: 1;
      color: var(--placeholder, $placeholder);
    }

    &:focus {
      cursor: text;

      // &::placeholder {
      //   opacity: 0.5;
      // }
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
    z-index: $multiselect-z_menu;
    border: $multiselect-border;
    border-color: var(--border-focus, $border-focus);
    border-radius: var(--border-radius, $border-radius);
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    &-item {
      border-top: 1px solid $multiselect-border-top;
      padding: $p-input !important;
      white-space: normal;
      word-wrap: normal;

      &.selected {
        background: $multiselect-selected_background;
        color: $multiselect-selected_color;
      }
    }
  }
}
</style>
