<script lang="ts" setup>
import { Ref, reactive, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Mount, Unmount, Update, onUpdateModelValue } from '@/common/mixin/emits';
import { useOptions } from '@/common/hooks/use-options';
import { useOnMount } from '@/common/hooks/use-mount';
import { Options, Value } from '@/common/types/select';

export interface Props extends CommonProps {
  modelValue: Value[];
  options: Options | undefined;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  name?: string;
  disctinct?: boolean;
  withUndefined?: boolean;
  withNull?: boolean;
  nullTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  name: 'radio-group',
  disctinct: false,
});

type Emit = Mount & Unmount & Update<Value[]>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue: Ref<Value[] | null> = ref(null);

setTimeout(() => {
  currentValue.value = props.modelValue;
}, 200);

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
} = useListMethods(configOptions);

const changeValue = (value: Value) => {
  if (currentValue.value === null) return;

  const includes = currentValue.value.includes(value);

  if (!includes) {
    currentValue.value?.push(value);

    onUpdateModelValue<Value[]>(emit, currentValue.value);
  } else {
    const index = currentValue.value.indexOf(value);

    if (index !== -1) currentValue.value.splice(index, 1);
  }
};

watch(
  () => props.modelValue,
  () => {
    currentValue.value = props.modelValue;
  },
);

watch(
  () => props.options,
  () => {
    currentOptions.value = useOptions({
      options: props.options,
      modelValue: props.modelValue,
      fieldTitle: props.titleField,
      fieldValue: props.valueField,
    }).currentOptions.value;
  },
);
</script>

<template>
  <div
    class="ui multiple search dropdown selection hive-drop-down-multiselect"
    @focusin="
      (e) => {
        expand();
        handleEvent(e);
      }
    "
    @focusout="
      (e) => {
        collapse();
        handleEvent(e);
      }
    "
    @mousedown="toggle"
    ref="multiSelectRef"
  >
    <i class="dropdown icon"></i>
    <a v-for="value in currentValue" :key="(value as string)" class="ui label visible" @mousedown.stop.prevent>
      {{ unfilteredOptions[value as string]?.title ? unfilteredOptions[value as string].title : value }}
      <i class="delete icon" @mousedown="removeFromCurrentValue(value)"></i>
    </a>
    <input
      ref="searchRef"
      :placeholder="placeholder"
      :value="searchQuery"
      autocomplete="fomantic-search"
      class="search search-input"
      tabindex="0"
      @keydown="onKeyDown"
      @input="
        searchQuery = ($event.target as HTMLInputElement).value;
        setActiveValueToFirst();
        onInput($event);
      "
      @keydown.up.exact="setPrevActiveValue"
      @keydown.down.exact="setNextActiveValue"
      @keydown.enter.exact="addToCurrentValue(activeValue)"
      @keydown.esc.exact="collapse"
      @keydown.delete.exact="onBackspace"
    />
    <div ref="menuRef" :class="{ visible: isExpanded, hidden: !isExpanded }" class="menu transition">
      <hive-observable
        v-for="option in filteredOptions"
        :key="option.key"
        :root="menuRef"
        :threshold="0.2"
        @appear="onAppear(option)"
        @disappear="onDisappear(option)"
      >
        <div
          :class="{
            'active selected': option.value === activeValue,
          }"
          :data-value="option.value"
          class="item"
          @click.prevent="addToCurrentValue(option.value)"
          @mouseover="updateActiveValue(option.value)"
          @mousedown.prevent
        >
          <slot name="before" :value="option.raw?.raw" />
          {{ String(option.title) }}
          <slot name="after" :value="option.raw?.raw" />
        </div>
      </hive-observable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hive-drop-down-multiselect {
  display: flex !important;
  flex-wrap: wrap;
  position: relative;
  height: auto;

  .dropdown.icon {
    cursor: default !important;
  }
}

.label {
  height: fit-content;
}

.search-input {
  height: fit-content;
  flex-grow: 1000;
}
</style>
