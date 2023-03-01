<template>
  <hive-picker
    v-model="formattedDate"
    icon-class="calendar alternate"
    ref="hivePickerRef"
  >
    <hive-input-date-calendar
      v-model="currentValue"
      :max-date="maxDate"
      :min-date="minDate"
      :with-timezone="withTimezone"
      @event="hidePopupOnDateSelect"
    />
  </hive-picker>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventData,
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useHiveInputDate, {
  type CurrentValueType,
} from "@hive/components/hive-input-date/hooks/use-hive-input-date";
import HiveInputDateCalendar from "@hive/components/hive-popup-contents/hive-input-date-calendar/HiveInputDateCalendar.vue";
import HivePicker from "@hive/components/hive-picker/HivePicker.vue";
import usePickerEventTriggering from "@hive/common/hooks/base/use-picker-event-triggering";
import useTimezone, {
  getTimezone,
} from "@hive/components/hive-popup-contents/hive-input-date-calendar/hooks/use-timezone";

export default defineComponent({
  name: "HiveInputDate",
  components: { HiveInputDateCalendar, HivePicker },
  props: {
    modelValue: {
      type: null,
      default: () => {
        const date = new Date();
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      },
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
    withTimezone: {
      type: Boolean,
      default: false,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);
    const hivePickerRef = ref(null);

    const timezone = getTimezone(props.withTimezone);

    const { currentValue } = useHiveInputDate(
      props.modelValue as CurrentValueType
    );

    const { outerValue, formattedDate } = useTimezone(currentValue, timezone);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: outerValue,
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

    const hidePopupOnDateSelect = (event: EventData) => {
      if (event.type === "onDateSelect" && hivePickerRef.value !== null) {
        (hivePickerRef.value as InstanceType<typeof HivePicker>).hidePopup();
      }
    };

    return {
      component,
      hivePickerRef,
      currentValue,
      formattedDate,
      handleEvent,
      outerValue,
      hidePopupOnDateSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";
</style>
