<template>
  <hive-picker
    v-model="formattedTime"
    icon-class="time"
    ref="hivePickerRef"
    :popup-type="withSeconds ? 'big' : 'small'"
  >
    <div class="time-range__filters-container">
      <hive-input-time-filters
        v-model="startTime"
        :with-seconds="withSeconds"
        :hour-cycle="hourCycle"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        :min-time="minTime"
        :max-time="maxTime"
        :items-in-view-count="itemsInViewCount"
      />
      <hive-input-time-filters
        :key="startTime"
        v-model="endTime"
        :with-seconds="withSeconds"
        :hour-cycle="hourCycle"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        :min-time="startTime"
        :max-time="maxTime"
        :items-in-view-count="itemsInViewCount"
      />
    </div>
  </hive-picker>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import commonProps from '@hive/common/mixins/common-props';
import useOnMount from '@hive/common/hooks/base/use-on-mount';
import useComponent from '@hive/common/hooks/base/use-component';
import useEventHandler, {
  type EventConfig,
} from '@hive/common/hooks/base/use-event-handler';
import HiveInputTimeFilters from '@hive/components/hive-popup-contents/hive-input-time-filters/HiveInputTimeFilters.vue';
import HivePicker from '@hive/components/hive-picker/HivePicker.vue';
import useHiveInputTimeRange, {
  type ModelValueType,
} from '@hive/components/hive-input-time-range/hooks/use-input-time-range';
import usePickerEventTriggering from '@hive/common/hooks/base/use-picker-event-triggering';

export default defineComponent({
  name: 'HiveInputTimeRange',
  components: { HiveInputTimeFilters, HivePicker },
  props: {
    modelValue: {
      type: [String, Array],
      default: () => [new Date().getTime(), new Date().getTime()],
    },
    modelValueEventName: {
      type: String,
      default: 'select',
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
    minTime: {
      type: [String, Number],
    },
    maxTime: {
      type: [String, Number],
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
    const { component } = useComponent(props);
    const hivePickerRef = ref(null);

    const { startTime, endTime, currentValue, formattedTime } =
      useHiveInputTimeRange(
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
    });

    return {
      hivePickerRef,
      startTime,
      endTime,
      component,
      currentValue,
      formattedTime,
      handleEvent,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';

.time-range__filters-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}
</style>
