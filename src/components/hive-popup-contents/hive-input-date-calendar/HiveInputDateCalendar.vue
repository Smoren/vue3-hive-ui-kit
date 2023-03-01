<template>
  <div class="date-picker__calendar">
    <div class="date-picker__calendar-header">
      <i
        class="chevron left icon"
        @click="changeDate"
        :class="{ disabled: !isChangeDateAvaliable('left') }"
      />
      <div
        :class="{ active: isFiltersShown }"
        class="btn date-picker__calendar-header-month-year-btn"
        @click="toggleFiltersVisibility"
      >
        <span class="date-picker__calendar-month">{{ month }}</span>
        <span class="date-picker__calendar-year">{{ year }}</span>
      </div>
      <i
        class="chevron right icon"
        @click="changeDate"
        :class="{ disabled: !isChangeDateAvaliable('right') }"
      />
      <i class="chevron close icon" v-if="isClearable" @click="clearValue" />
    </div>
    <div class="date-picker__calendar-main">
      <div
        :class="{ shown: isFiltersShown }"
        class="date-picker__calendar-filters"
      >
        <hive-selectable-list
          v-model="month"
          :items-in-view-count="itemsInViewCount"
          :options="months"
        />
        <hive-selectable-list
          v-model="year"
          :items-in-view-count="itemsInViewCount"
          :options="years"
        />
      </div>
      <div class="date-picker__calendar-days-of-week">
        <span v-for="day in daysOfWeek" :key="day">{{ day }}</span>
      </div>
      <div class="date-picker__calendar-days">
        <div
          v-for="day in prevDays"
          :key="day"
          :class="{
            active: currentValue === getDateTimestamp(day, 'prev'),
            disabled: !isInDateRange(getDateTimestamp(day, 'prev')),
          }"
          class="date-picker__calendar-days-item date-picker__calendar-prev-day"
          @click="updateCurrentValue(day, 'prev')"
        >
          {{ day }}
        </div>
        <div
          v-for="day in days"
          :key="day"
          :class="{
            active: currentValue === getDateTimestamp(day, 'current'),
            disabled: !isInDateRange(getDateTimestamp(day, 'current')),
          }"
          class="date-picker__calendar-days-item date-picker__calendar-day"
          @click="updateCurrentDate(day)"
        >
          {{ day }}
        </div>
        <div
          v-for="day in nextDays"
          :key="day"
          :class="{
            active: currentValue === getDateTimestamp(day, 'next'),
            disabled: !isInDateRange(getDateTimestamp(day, 'next')),
          }"
          class="date-picker__calendar-days-item date-picker__calendar-next-day"
          @click="updateCurrentValue(day, 'next')"
        >
          {{ day }}
        </div>
      </div>
    </div>
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
import useHiveInputDateCalendar, {
  type InputDateCalendarConfig,
} from "@hive/components/hive-popup-contents/hive-input-date-calendar/hooks/use-hive-input-date-calendar";
import HiveSelectableList from "@hive/components/hive-selectable-list/HiveSelectableList.vue";

export default defineComponent({
  name: "HiveInputDateCalendar",
  components: { HiveSelectableList },
  props: {
    modelValue: {
      type: [Number, String],
      default: new Date().getTime(),
    },
    modelValueEventName: {
      type: String,
      default: "change",
    },
    minDate: {
      type: [String, Number],
    },
    maxDate: {
      type: [String, Number],
    },
    itemsInViewCount: {
      type: Number,
      default: 5,
    },
    withTimezone: {
      type: Boolean,
      default: false,
    },
    isClearable: {
      type: Boolean,
      default: true,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);
    // const minDate = ref(props.minDate);
    // const maxDate = ref(props.maxDate);
    const {
      currentValue,
      daysOfWeek,
      months,
      years,
      month,
      year,
      prevDays,
      days,
      nextDays,
      isFiltersShown,
      changeDate,
      updateCurrentValue,
      toggleFiltersVisibility,
      getDateTimestamp,
      isInDateRange,
      isChangeDateAvaliable,
    } = useHiveInputDateCalendar({
      modelValue: props.modelValue,
      minDate: props.minDate,
      maxDate: props.maxDate,
      withTimezone: props.withTimezone,
    } as InputDateCalendarConfig);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    const clearValue = () => {
      currentValue.value = -1;
      context.emit("update:modelValue", null);
    };

    const updateCurrentDate = (day?: number) => {
      updateCurrentValue(day, "current");
      handleEvent(new Event("onDateSelect"));
    };

    watch(
      () => currentValue.value,
      (newValue) => {
        if (newValue === -1) {
          context.emit("update:modelValue", null);
        } else {
          context.emit("update:modelValue", newValue);
        }
        handleEvent(new Event("onChange"));
      }
    );

    return {
      component,
      currentValue,
      handleEvent,
      daysOfWeek,
      months,
      years,
      month,
      year,
      prevDays,
      days,
      nextDays,
      isFiltersShown,
      changeDate,
      updateCurrentValue,
      toggleFiltersVisibility,
      getDateTimestamp,
      isInDateRange,
      isChangeDateAvaliable,
      clearValue,
      updateCurrentDate,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";
@import "@hive/assets/scss/abstracts/_variables";

.date-picker__calendar {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;

    .chevron.icon {
      cursor: pointer;

      &.disabled,
      &.disabled:hover,
      &.disabled:focus {
        cursor: not-allowed;
        color: #aaaaaa;
      }
    }
  }

  &-main {
    position: relative;
  }

  &-days-of-week {
    display: flex;
    justify-content: space-between;
  }

  &-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    text-align: center;

    &-item {
      width: 100%;
      height: 100%;
      padding: 5px;
      cursor: pointer;
      border-radius: $border-radius;
      transition: background-color $transition;

      &.disabled,
      &.disabled:hover,
      &.disabled:focus {
        cursor: not-allowed;
        background-color: transparent;
        color: #c9c7c7;
      }

      &:hover,
      &:focus {
        background-color: #eeeeee;
      }

      &.active,
      &.active:hover {
        background-color: #85b7d938;
      }
    }
  }

  &-prev-day,
  &-next-day {
    color: #4646468a;
  }
}

.date-picker__calendar-header-month-year-btn {
  display: flex;
  gap: 8px;
  padding: 0 10px;
  transition: background-color $transition;
  border-radius: $border-radius;
  user-select: none;

  &:hover,
  &:active,
  &.active {
    background-color: #eeeeee;
  }
}

.date-picker__calendar-filters {
  position: absolute;
  width: 100%;
  height: 0;
  display: flex;
  gap: 15%;
  background-color: #ffffff;
  overflow: hidden;
  z-index: 100;
  //transition: height $transition;

  &.shown {
    height: 100%;
    overflow: visible;
  }
}
</style>
