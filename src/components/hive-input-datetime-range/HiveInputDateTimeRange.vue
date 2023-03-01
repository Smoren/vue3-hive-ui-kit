<template>
  <hive-picker
    v-model="formattedDateTimeRange"
    icon-class="calendar outline"
    popup-type="big"
    type="range"
    ref="hivePickerRef"
  >
    <div class="datetime-range__popups">
      <div class="datetime-range__popup">
        <hive-input-date-calendar
          v-model="(currentValue as number[][])[0][0]"
          :min-date="minDateTime"
          :max-date="maxDateTime"
          :is-clearable="false"
          class="datetime-picker__popup-item"
        />
        <hive-input-time-filters
          v-model="(currentValue as number[][])[0][1]"
          :hour-cycle="hourCycle"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :second-step="secondStep"
          :min-time="minDateTime"
          :max-time="maxDateTime"
          :items-in-view-count="itemsInViewCount"
          class="datetime-picker__popup-item"
        />
      </div>
      <div :key="endKey" class="datetime-range__popup">
        <hive-input-date-calendar
          v-model="(currentValue as number[][])[1][0]"
          :min-date="(currentValue as number[][])[0][0]"
          :max-date="maxDateTime"
          :is-clearable="false"
          class="datetime-picker__popup-item"
        />
        <hive-input-time-filters
          v-model="(currentValue as number[][])[1][1]"
          :with-seconds="withSeconds"
          :hour-cycle="hourCycle"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :second-step="secondStep"
          :min-time="getEndMinTime()"
          :max-time="maxDateTime"
          :items-in-view-count="itemsInViewCount"
          class="datetime-picker__popup-item"
        />
      </div>
    </div>
  </hive-picker>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import HiveInputTimeFilters from "@hive/components/hive-popup-contents/hive-input-time-filters/HiveInputTimeFilters.vue";
import HiveInputDateCalendar from "@hive/components/hive-popup-contents/hive-input-date-calendar/HiveInputDateCalendar.vue";
import HivePicker from "@hive/components/hive-picker/HivePicker.vue";
import useHiveInputDateTimeRange, {
  type ModelValueType,
} from "@hive/components/hive-input-datetime-range/hooks/use-hive-input-datetime-range";
import usePickerEventTriggering, {
  type PickerEventTriggeringConfig,
} from "@hive/common/hooks/base/use-picker-event-triggering";

export default defineComponent({
  name: "HiveInputDateTimeRange",
  components: { HiveInputTimeFilters, HiveInputDateCalendar, HivePicker },
  props: {
    modelValue: {
      type: [String, Array],
    },
    modelValueEventName: {
      type: String,
      default: "select",
    },
    withSeconds: {
      type: Boolean,
      default: false,
    },
    eventOnPopupClosing: {
      type: Boolean,
      default: true,
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
    minDateTime: {
      type: [String, Number],
    },
    maxDateTime: {
      type: [String, Number],
    },
    itemsInViewCount: {
      type: Number,
      default: 6,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);
    const hivePickerRef = ref(null);

    const { currentValue, formattedDateTimeRange, getEndMinTime, endKey } =
      useHiveInputDateTimeRange(
        props.modelValue as ModelValueType,
        props.withSeconds
      );

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    usePickerEventTriggering({
      pickerRef: hivePickerRef,
      eventOnPopupClosing: props.eventOnPopupClosing,
      currentValue,
      modelValueEventName: props.modelValueEventName,
      handleEvent,
    } as PickerEventTriggeringConfig);

    return {
      component,
      hivePickerRef,
      currentValue,
      handleEvent,
      formattedDateTimeRange,
      getEndMinTime,
      endKey,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";

.datetime-range__popups {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .datetime-range__popup {
    display: flex;
    gap: 10px;
  }
}
</style>
