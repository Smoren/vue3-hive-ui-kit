<template>
  <hive-picker
    v-model="formattedDates"
    icon-class="calendar alternate"
    type="range"
    ref="hivePickerRef"
  >
    <div class="date-range__calendars-container">
      <hive-input-date-calendar
        v-model="currentValue[0]"
        :max-date="maxDate"
        :min-date="minDate"
        :is-clearable="false"
      />
      <hive-input-date-calendar
        :key="currentValue[0]"
        v-model="currentValue[1]"
        :max-date="maxDate"
        :min-date="currentValue[0]"
        :is-clearable="false"
      />
    </div>
  </hive-picker>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import HiveInputDateCalendar from "@hive/components/hive-popup-contents/hive-input-date-calendar/HiveInputDateCalendar.vue";
import HivePicker from "@hive/components/hive-picker/HivePicker.vue";
import useHiveInputDateRange, {
  type ModelValueType,
} from "@hive/components/hive-input-date-range/hooks/use-hive-input-date-range";
import usePickerEventTriggering from "@hive/common/hooks/base/use-picker-event-triggering";

export default defineComponent({
  name: "HiveInputDateRange",
  components: { HiveInputDateCalendar, HivePicker },
  props: {
    modelValue: {
      type: [String, Array],
    },
    modelValueEventName: {
      type: String,
      default: "onSelect",
    },
    eventOnPopupClosing: {
      type: Boolean,
      default: true,
    },
    minDate: {
      type: [String, Number],
    },
    maxDate: {
      type: [String, Number],
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);
    const hivePickerRef = ref(null);

    const { currentValue, formattedDates } = useHiveInputDateRange(
      props.modelValue as ModelValueType
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
      formattedDates,
      handleEvent,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";

.date-range__calendars-container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
