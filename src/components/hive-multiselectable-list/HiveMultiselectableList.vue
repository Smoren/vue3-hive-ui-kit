<template>
  <div
    ref="listRef"
    :class="classes"
    :style="{ ...style }"
    class="selectable-list"
    @keydown.up.prevent="setPrevActiveValue"
    @keydown.down.prevent="setNextActiveValue"
    @keydown.enter="updateCurrentValue(activeValue)"
    tabindex="1"
    v-bind="attrs"
  >
    <hive-observable
      v-for="option in formattedOptions"
      :key="option.key"
      :root="(listRef as unknown as Record<string, any>)"
      :threshold="0.1"
      @appear="onAppear(option)"
      @disappear="onDisappear(option)"
    >
      <div
        :class="{
          selected: inCurrentValue(option.value),
          active: option.value === activeValue,
        }"
        :data-value="option.value"
        class="item"
        @click="updateCurrentValue(option.value)"
      >
        {{ option.title }}
      </div>
    </hive-observable>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import HiveObservable from "@hive/components/hive-observable/HiveObservable.vue";
import useHiveMultiselectableList, {
  type OptionsType,
  type MultiselectableListConfig,
} from "@hive/components/hive-multiselectable-list/hooks/use-hive-multiselectable-list";

export default defineComponent({
  name: "HiveMultiselectableList",
  components: { HiveObservable },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
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
    },
    itemsInViewCount: {
      type: Number,
      default: 3,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component, currentValue } = useComponent(props);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    const {
      activeValue,
      formattedOptions,
      currentOptions,
      listRef,
      onAppear,
      onDisappear,
      listHeight,
      updateCurrentValue,
      inCurrentValue,
      setPrevActiveValue,
      setNextActiveValue,
    } = useHiveMultiselectableList({
      ...props,
      currentValue,
      handleEvent,
    } as MultiselectableListConfig);

    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        handleEvent(new Event("onDataBound"));
      }
    );

    return {
      component,
      currentValue,
      activeValue,
      listRef,
      handleEvent,
      formattedOptions,
      currentOptions,
      onAppear,
      onDisappear,
      listHeight,
      updateCurrentValue,
      inCurrentValue,
      setPrevActiveValue,
      setNextActiveValue,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";
@import "@hive/assets/scss/abstracts/_variables";

.selectable-list {
  display: grid;
  grid-auto-rows: 1fr;
  align-items: center;
  width: fit-content;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus {
    outline: none;
  }

  .item {
    height: fit-content;
    padding: 10px !important;
    cursor: pointer;
    user-select: none;
    border-radius: $border-radius;
    transition: background-color $transition;

    &:hover,
    &.active {
      background-color: #eeeeee59;
    }

    &.selected,
    &.selected:hover {
      background-color: #85b7d938;
    }
  }
}
</style>
