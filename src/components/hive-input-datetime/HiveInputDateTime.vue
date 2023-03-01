<template>
  <hive-picker
    v-model="dateTime"
    icon-class="calendar outline"
    popup-type="big"
    ref="hivePickerRef"
  >
    <div class="datetime-picker__popup">
      <hive-input-date-calendar
        v-model="date"
        :min-date="minDateTime"
        :max-date="maxDateTime"
        :is-clearable="false"
        class="datetime-picker__popup-item"
      />
      <hive-input-time-filters
        v-model="time"
        :with-seconds="withSeconds"
        :hour-cycle="hourCycle"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        :min-date="minDateTime"
        :max-date="maxDateTime"
        :items-in-view-count="itemsInViewCount"
        class="datetime-picker__popup-item"
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
import useHiveInputDateTime, {
  type ModelValueType,
} from '@hive/components/hive-input-datetime/hooks/use-hive-input-datetime';
import HiveInputTimeFilters from '@hive/components/hive-popup-contents/hive-input-time-filters/HiveInputTimeFilters.vue';
import HiveInputDateCalendar from '@hive/components/hive-popup-contents/hive-input-date-calendar/HiveInputDateCalendar.vue';
import HivePicker from '@hive/components/hive-picker/HivePicker.vue';
import usePickerEventTriggering from '@hive/common/hooks/base/use-picker-event-triggering';

export default defineComponent({
  name: 'HiveInputDateTime',
  components: { HiveInputTimeFilters, HiveInputDateCalendar, HivePicker },
  props: {
    modelValue: {
      type: [String, Number],
    },
    modelValueEventName: {
      type: String,
      default: 'onSelect',
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

    const { currentValue, date, time, dateTime } = useHiveInputDateTime(
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
      component,
      hivePickerRef,
      currentValue,
      handleEvent,
      date,
      time,
      dateTime,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';

.datetime-picker__popup {
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
}
</style>
