type
<template>
  <div class="time-picker__filters">
    <hive-selectable-list
      v-model="currentHour"
      :items-in-view-count="itemsInViewCount"
      :options="hours"
      class="time-picker__filters-item"
    />
    <hive-selectable-list
      v-if="currentHour === String(minHour)"
      v-model="currentMinute"
      :items-in-view-count="itemsInViewCount"
      :options="minutes"
      class="time-picker__filters-item"
    />
    <hive-selectable-list
      v-else
      v-model="currentMinute"
      :items-in-view-count="itemsInViewCount"
      :options="fullMinutes"
      class="time-picker__filters-item"
    />
    <hive-selectable-list
      v-if="withSeconds"
      v-model="currentSecond"
      :items-in-view-count="itemsInViewCount"
      :options="seconds"
      class="time-picker__filters-item"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import HiveSelectableList from "@hive/components/hive-selectable-list/HiveSelectableList.vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useHiveInputTimeFilters, {
  type InputTimeFiltersConfig,
} from "@hive/components/hive-popup-contents/hive-input-time-filters/hooks/use-hive-input-time-filters";

export default defineComponent({
  name: "HiveInputTimeFilters",
  components: { HiveSelectableList },
  props: {
    modelValue: {
      type: [String, Number],
    },
    modelValueEventName: {
      type: String,
      default: "change",
    },
    withSeconds: {
      type: Boolean,
      default: false,
    },
    hourCycle: {
      type: Number,
    },
    hourStep: {
      type: Number,
    },
    minuteStep: {
      type: Number,
    },
    secondStep: {
      type: Number,
    },
    minTime: {
      type: [String, Number],
    },
    maxTime: {
      type: [String, Number],
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
    const { component } = useComponent(props);

    const {
      currentValue,
      hours,
      minutes,
      seconds,
      currentHour,
      currentMinute,
      currentSecond,
      currentTime,
      fullMinutes,
      minHour,
    } = useHiveInputTimeFilters({
      ...props,
    } as InputTimeFiltersConfig);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    watch(
      () => currentValue.value,
      (newValue) => {
        context.emit("update:modelValue", newValue);
      }
    );

    return {
      component,
      currentValue,
      handleEvent,
      hours,
      minutes,
      seconds,
      currentHour,
      currentMinute,
      currentSecond,
      currentTime,
      fullMinutes,
      minHour,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";

.time-picker__filters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;

  &-item {
    text-align: center;
  }
}
</style>
