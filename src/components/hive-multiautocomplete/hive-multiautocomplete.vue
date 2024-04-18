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
import { Value } from '@/common/types/select';
import { useListMethods } from '@/common/hooks/use-list-methods';
import DeleteIcon from '@/components/hive-multiselect/assets/delete-icon.svg';
import HiveMultiautocompleteItem from './hive-multiautocomplete-item.vue';
import { computed } from 'vue';

export interface Props extends CommonProps {
  options: string[] | undefined;
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
  distinct?: boolean;
  placeholder?: string;
  isPlaceholderSeenWithValues?: boolean;
  keysToEnterValue?: string[];
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
  distinct: true,
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
  withNull: props.withNull,
  nullTitle: props.nullTitle,
  fieldTitle: props.titleField,
  fieldValue: props.valueField,
  distinct: props.distinct,
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
  menuRef,
  setFirstActiveValue,
} = useListMethods(configOptions);

const changeValue = (value: Value) => {
  if (!currentValue.value || !value || !Array.isArray(currentValue.value)) return;

  const includes = props.distinct ? currentValue.value?.includes(value) : false;

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

const deleteValue = (index: number) => {
  if (!currentValue.value && !Array.isArray(currentValue.value)) return;
  if (Array.isArray(currentValue.value)) {
    currentValue.value.splice(index, 1);
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
    configOptions.options = props.options;
    currentOptions.value = useListMethods(configOptions).currentOptions.value;
    filteredOptions.value = useListMethods(configOptions).filteredOptions.value;
    current.value = useListMethods(configOptions).current.value;
  },
  { deep: true },
);

watch(
  currentValue,
  () => {
    filteredOptions.value = useListMethods(configOptions).filteredOptions.value;
  },
  { deep: true },
);

const onInputSearch = () => {
  onSearch(emit, searchQuery.value);
  updateActiveValue(null);
};

watch(searchQuery, () => {
  onSearch(emit, searchQuery.value);
  updateActiveValue(null);
});

const forceFocusInput = () => {
  searchRef.value?.forceFocus();
};

onMounted(() => {
  if (props.focusOnMount) forceFocusInput();
});

const editCurrentValue = (value: Value, index: number) => {
  if (Array.isArray(currentValue.value)) {
    currentValue.value[index] = value;
  }
};

const iconClick = () => {
  if (isExpanded.value) {
    if (Array.isArray(currentValue.value) && currentValue.value.length) {
      currentValue.value.length = 0;
    } else {
      toggle();
    }
  } else {
    toggle();
  }
};

const computedPlaceholder = computed(() =>
  current.value ? String(current.value[props.titleField]) : props.isPlaceholderSeenWithValues ? props.placeholder : '',
);

const handleKeydown = (event: KeyboardEvent) => {
  onKeydown(emit, event);
  if (props.keysToEnterValue && props.keysToEnterValue.includes(event.code)) {
    changeValue(activeValue.value ?? searchQuery.value);
  }
};

const onEnter = () => {
  changeValue(activeValue.value ?? searchQuery.value);
};
</script>

<template>
  <div class="hive-multiselect__wrap" :class="{ expand: isExpanded, disable: disabled }">
    <div class="hive-multiselect__selected" @click="forceFocusInput()">
      <template v-if="currentValue && Array.isArray(currentValue) && currentValue.length">
        <hive-multiautocomplete-item
          v-for="(value, i) in currentValue"
          :key="Array.isArray(value) ? value[0] : value"
          :value="value"
          :index="i"
          @delete="deleteValue(i)"
          @edit="editCurrentValue"
        />
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
        @focusin="expand(), onFocusin(emit)"
        @focusout="collapse(), onFocusout(emit)"
        @keydown="handleKeydown"
        @keydown.enter.exact="onEnter()"
        @keydown.esc="collapse()"
        @keydown.up.prevent="setPrevActiveValue"
        @keydown.down.prevent="setNextActiveValue"
        @keydown.delete="!searchQuery ? deleteValue((currentValue as Value[]).length - 1) : null"
      />
    </div>
    <i
      class="hive-multiselect__icon"
      :class="{ expand: isExpanded, deleteIcon: Array.isArray(currentValue) && currentValue.length }"
      @mousedown="iconClick"
    />
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
          :data-value="item[1][valueField]"
        >
          {{ item[1][titleField] }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';
$drop-down-z_menu: 100;
$border-width: 1px;
$drop-down-border: $border-width solid var(--border, $border);
$drop-down-selected_background: var(--bg-selected, $bg-selected);
$drop-down-selected_color: rgba(0, 0, 0, 0.95);
$drop-down-border-top: #fafafa;
$drop-down-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
$drop-down-padding: 0.5em 1em 0.5em 1em;
$height: var(--height, calc($common-widget-height - 10px));

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
  height: 100%;
  align-items: center;

  &__selected {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 5px;
    box-sizing: border-box;
    flex-wrap: wrap;
    width: 100%;
  }

  &__wrap {
    border: 1px solid var(--border, $border);
    border-radius: var(--border-radius, $border-radius);
    position: relative;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    cursor: default;
    background-color: var(--bg-input, $bg-input);

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
    // margin: auto 0;
    align-self: center;
    margin-right: 13px;
    color: var(--text, $text);

    &:before {
      content: '▼';
    }

    &.expand {
      &:before {
        content: '▲';
      }

      &.deleteIcon {
        &:before {
          content: 'x';
          font-size: larger;
        }
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
    height: $height;

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
      text-align: left;

      &.selected {
        background: $drop-down-selected_background;
      }
    }
  }
}
</style>
