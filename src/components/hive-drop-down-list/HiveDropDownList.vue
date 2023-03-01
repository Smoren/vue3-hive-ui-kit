<template>
  <div
    v-bind="attrs"
    :class="currentClasses"
    class="ui search dropdown selection hive-drop-down-list"
    :style="{
      borderColor: isExpanded ? borderColorOnFocus : '',
    }"
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
  >
    <i class="dropdown icon" @mousedown="toggle"></i>
    <input
      ref="searchRef"
      autocomplete="fomantic-search"
      class="search"
      tabindex="0"
      :value="searchQuery"
      @input="
        searchQuery = ($event.target as HTMLInputElement).value;
        onInput();
      "
      @keydown.enter="updateCurrentValue(activeValue)"
      @keydown.up.prevent="setPrevActiveValue"
      @keydown.down.prevent="setNextActiveValue"
      @keydown.esc="collapse"
    />
    <div :class="{ filtered: searchQuery.length > 0 }" class="text">
      {{ currentOption.title }}
    </div>
    <div
      ref="menuRef"
      :class="{ visible: isExpanded, hidden: !isExpanded }"
      :style="{
        height: menuHeight,
        borderColor: isExpanded ? borderColorOnFocus : '',
      }"
      class="menu transition"
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
          :class="{
            selected: option.value === activeValue,
          }"
          :data-value="option.value"
          class="item"
          @click="updateCurrentValue(option.value)"
          @mouseover="updateActiveValue(option.value)"
          @mousedown.prevent
        >
          {{ option.title }}
        </div>
      </hive-observable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import useComponent from '@hive/common/hooks/base/use-component';
import useEventHandler from '@hive/common/hooks/base/use-event-handler';
import useOnMount from '@hive/common/hooks/base/use-on-mount';
import commonProps from '@hive/common/mixins/common-props';
import useHiveDropDownList, {
  type DropDownListConfig,
  type OptionsType,
} from '@hive/components/hive-drop-down-list/hooks/use-hive-drop-down-list';
import useHiveDropDownListMethods from '@hive/components/hive-drop-down-list/hooks/use-hive-drop-down-list-methods';
import useDropDownMethods from '@hive/common/hooks/custom/use-drop-down-methods';
import useClasses, { type ClassesType } from '@hive/common/hooks/base/use-classes';
import HiveObservable from '@hive/components/hive-observable/HiveObservable.vue';

export default defineComponent({
  name: 'HiveDropDownList',
  components: { HiveObservable },
  emits: ['update:modelValue', 'event'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    modelValueEventName: {
      type: String,
      default: 'onAfterChange',
    },
    options: {
      type: [Object, Array],
      default: () => [],
    },
    keyField: {
      type: [String],
    },
    valueField: {
      type: [String],
    },
    titleField: {
      type: [String],
      default: 'title',
    },
    menuHeight: {
      type: String,
    },
    borderColorOnFocus: {
      type: String,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent();
    const menuRef = ref(null);

    const {
      currentValue,
      activeValue,
      currentOption,
      currentOptions,
      filteredOptions,
      searchQuery,
      valueChangedOnInit,
    } = useHiveDropDownList(props as unknown as DropDownListConfig);
    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    });

    const {
      isExpanded,
      searchRef,
      expand,
      collapse,
      toggle,
      updateActiveValue,
      setActiveValueToFirst,
      setPrevActiveValue,
      setNextActiveValue,
      onAppear,
      onDisappear,
    } = useDropDownMethods({
      searchQuery,
      currentValue,
      activeValue,
      filteredOptions,
      handleEvent,
    });
    const currentClasses = useClasses({
      classes: props.classes as ClassesType,
      extraClasses: { 'active visible': isExpanded },
    });
    const { updateCurrentValue } = useHiveDropDownListMethods({
      activeValue,
      currentValue,
      filteredOptions,
      context,
      modelValueEventName: props.modelValueEventName,
      handleEvent,
      collapse,
    });
    watch(
      () => searchQuery.value,
      (newValue: string) => {
        handleEvent(new Event('search'), { query: newValue });
      }
    );
    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        handleEvent(new Event('onDataBound'));
      }
    );
    watch(
      () => activeValue.value,
      (newValue, prevValue) => {
        const activeOption = filteredOptions.value[newValue as string];
        if (!activeOption) {
          return;
        }

        if (!activeOption.visible && isExpanded.value) {
          const el = (menuRef.value as unknown as HTMLElement).querySelector(`[data-value='${newValue}']`);
          (el as unknown as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      },
      { flush: 'post' }
    );

    if (valueChangedOnInit) {
      handleEvent(new Event(props.modelValueEventName));
    }

    const onInput = () => {
      activeValue.value = null;
      handleEvent(new Event('onInput'), searchQuery.value);
    };

    return {
      component,
      menuRef,
      isExpanded,
      currentClasses,
      searchRef,
      currentValue,
      activeValue,
      currentOption,
      filteredOptions,
      searchQuery,
      updateCurrentValue,
      updateActiveValue,
      setPrevActiveValue,
      setNextActiveValue,
      setActiveValueToFirst,
      expand,
      collapse,
      toggle,
      handleEvent,
      onAppear,
      onDisappear,
      onInput,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';

.hive-drop-down-list {
  position: relative;
  input.search {
    cursor: default !important;
    :focus {
      cursor: text !important;
    }
  }
  .dropdown.icon {
    cursor: default !important;
  }
}
</style>
