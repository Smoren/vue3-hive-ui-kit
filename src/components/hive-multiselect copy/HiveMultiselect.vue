<template>
  <div
    v-bind="attrs"
    :class="currentClasses"
    :style="style"
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
    <a
      v-for="value in currentValue"
      :key="value as string"
      class="ui label visible"
      @mousedown.stop.prevent
    >
      {{
        unfilteredOptions[value as string]?.title
            ? unfilteredOptions[value as string].title
            : value
      }}
      <i class="delete icon" @mousedown="removeFromCurrentValue(value)"></i>
    </a>
    <input
      ref="searchRef"
      :placeholder="placeholder"
      :value="searchQuery"
      autocomplete="fomantic-search"
      class="search"
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
    <div
      ref="menuRef"
      :class="{ visible: isExpanded, hidden: !isExpanded }"
      class="menu transition"
    >
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

<script lang="ts">
import { defineComponent, ref, toRaw, watch } from "vue";
import HiveObservable from "@hive/components/hive-observable/HiveObservable.vue";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler from "@hive/common/hooks/base/use-event-handler";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import commonProps from "@hive/common/mixins/common-props";
import useHiveMultiselect, {
  type DropDownListMultipleConfig,
  type OptionsType,
} from "@hive/components/hive-multiselect/hooks/use-hive-multiselect";
import useHiveMultiselectMethods from "@hive/components/hive-multiselect/hooks/use-hive-multiselect-methods";
import useDropDownMethods from "@hive/common/hooks/custom/use-drop-down-methods";
import useClasses, {
  type ClassesType,
} from "@hive/common/hooks/base/use-classes";
import usePickerEventTriggering from "@hive/common/hooks/base/use-picker-event-triggering";

export default defineComponent({
  name: "HiveMultiselect",
  emits: ["update:modelValue", "event"],
  components: {
    HiveObservable,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
    },
    eventOnPopupClosing: {
      type: Boolean,
      default: true,
    },
    options: {
      type: [Object, Array],
      default: () => [],
    },
    keyField: {
      type: String,
    },
    valueField: {
      type: String,
    },
    titleField: {
      type: String,
    },
    placeholder: {
      type: String,
      default: "Default",
    },
    minQueryLength: {
      type: Number,
      default: 0,
    },
    onlyDistinctValues: {
      type: Boolean,
      default: true,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent();
    const menuRef = ref(undefined);
    const multiSelectRef = ref(undefined);

    const {
      currentValue,
      activeValue,
      currentOptions,
      filteredOptions,
      unfilteredOptions,
      searchQuery,
    } = useHiveMultiselect(props as unknown as DropDownListMultipleConfig);

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
      activeValue,
      filteredOptions,
      handleEvent,
    });

    const currentClasses = useClasses({
      classes: props.classes as ClassesType,
      extraClasses: { "active visible": isExpanded },
    });

    const { addToCurrentValue, removeFromCurrentValue, onBackspace } =
      useHiveMultiselectMethods({
        activeValue,
        currentValue,
        filteredOptions,
        collapse,
        searchQuery,
        handleEvent,
      });

    usePickerEventTriggering({
      popupVisibilityProp: isExpanded,
      eventOnPopupClosing: props.eventOnPopupClosing,
      currentValue,
      modelValueEventName: props.modelValueEventName,
      handleEvent,
    });

    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        handleEvent(new Event("onDataBound"));
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
          const el = (menuRef.value as unknown as HTMLElement).querySelector(
            `[data-value='${newValue}']`
          );

          (el as unknown as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      },
      { flush: "post" }
    );

    watch(
      () => props.modelValue.length,
      () => {
        const value = toRaw(props.modelValue);
        currentValue.value = [];
        value.forEach((val) => addToCurrentValue(val, true));
        context.emit("update:modelValue", currentValue.value);
      }
    );

    const onInput = (event: Event) => {
      handleEvent(event, searchQuery.value);
    };

    const onKeyDown = (event: Event) => {
      handleEvent(event, searchQuery.value);
    }

    return {
      component,
      menuRef,
      multiSelectRef,
      isExpanded,
      currentClasses,
      searchRef,
      currentOptions,
      currentValue,
      activeValue,
      filteredOptions,
      unfilteredOptions,
      searchQuery,
      addToCurrentValue,
      removeFromCurrentValue,
      onBackspace,
      updateActiveValue,
      setPrevActiveValue,
      setNextActiveValue,
      setActiveValueToFirst,
      onAppear,
      onDisappear,
      expand,
      collapse,
      toggle,
      handleEvent,
      onInput,
      onKeyDown
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";

.hive-drop-down-multiselect {
  display: flex !important;
  flex-wrap: wrap;
  position: relative;

  .dropdown.icon {
    cursor: default !important;
  }
}

.search{
  flex-grow: 1000;
}
</style>
