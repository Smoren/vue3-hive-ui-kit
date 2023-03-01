<template>
  <div
    ref="listRef"
    v-bind="attrs"
    :class="classes"
    :style="{ ...style, height: `${listHeight}px`}"
    class="selectable-list"
    tabindex="1"
    @keydown.up.prevent="
      updateCurrentValue(formattedOptions[currentValue as string].prev?.value)
    "
    @keydown.down.prevent="
      updateCurrentValue(formattedOptions[currentValue as string].next?.value)
    "
  >
    <hive-observable
      v-for="option in formattedOptions"
      :key="option.key"
      :root="listRef"
      :threshold="0.1"
      @appear="onAppear(option)"
      @disappear="onDisappear(option)"
    >
      <div
        :class="{
          selected: option.value === currentValue,
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
import { defineComponent, watch } from 'vue';
import commonProps from '@hive/common/mixins/common-props';
import useOnMount from '@hive/common/hooks/base/use-on-mount';
import useComponent from '@hive/common/hooks/base/use-component';
import useEventHandler, {
  type EventConfig,
} from '@hive/common/hooks/base/use-event-handler';
import HiveObservable from '@hive/components/hive-observable/HiveObservable.vue';
// import '@hive/components/assets/scss/semantic.scss';
import useHiveSelectableList, {
  type OptionsType,
  type SelectableListConfig,
} from '@hive/components/hive-selectable-list/hooks/use-hive-selectable-list';

export default defineComponent({
  name: 'HiveSelectableList',
  components: { HiveObservable },
  props: {
    modelValue: {
      type: [String, Number],
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
    },
    itemsInViewCount: {
      type: Number,
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
      formattedOptions,
      currentOptions,
      listRef,
      onAppear,
      onDisappear,
      listHeight,
      updateCurrentValue,
    } = useHiveSelectableList({
      ...props,
      currentValue,
      handleEvent,
    } as SelectableListConfig);

    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        handleEvent(new Event('onDataBound'));
      }
    );

    return {
      component,
      currentValue,
      listRef,
      handleEvent,
      formattedOptions,
      currentOptions,
      onAppear,
      onDisappear,
      listHeight,
      updateCurrentValue,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';
@import '@hive/assets/scss/abstracts/_variables';

.selectable-list {
  display: grid;
  grid-auto-rows: 1fr;
  align-items: center;
  width: fit-content;
  overflow-y: scroll;
  scrollbar-width: none;
  gap: 5px;

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

    &:hover {
      background-color: #eeeeee59;
    }

    &.selected,
    &.selected:hover {
      background-color: #85b7d938;
    }
  }
}
</style>
