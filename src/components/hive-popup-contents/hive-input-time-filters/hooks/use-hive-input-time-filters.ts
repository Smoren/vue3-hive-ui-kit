import { computed, type ComputedRef, ref, type Ref, watch } from "vue";
import getTimeValues from "@hive/components/hive-input-time/hooks/helpers";
import toTimestamp from "@hive/common/funcs/to-timestamp";

interface InputTimeFiltersConfig {
  modelValue: string | number;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  hourCycle?: number;
  minTime?: string | number;
  maxTime?: string | number;
}

interface InputTimeFiltersExport {
  currentValue: Ref<number>;
  hours: Record<string, string>;
  minutes: Record<string, string>;
  seconds: Record<string, string>;
  currentHour: Ref<string>;
  currentMinute: Ref<string>;
  currentSecond: Ref<string>;
  currentTime: ComputedRef<string>;
  fullMinutes: Record<string, string>;
  minHour: number;
}

export type { InputTimeFiltersConfig };

export default function useHiveInputTimeFilters({
  modelValue,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  hourCycle = 24,
  minTime = "00:00:00",
  maxTime = `${hourCycle - 1}:59:59`,
}: InputTimeFiltersConfig): InputTimeFiltersExport {
  const currentValue = ref(toTimestamp(modelValue));
  const minHour = new Date(toTimestamp(minTime)).getHours();
  const minMinute = new Date(toTimestamp(minTime)).getMinutes();
  const minSecond = new Date(toTimestamp(minTime)).getSeconds();
  const maxHour = new Date(toTimestamp(maxTime)).getHours();
  const maxMinute = new Date(toTimestamp(maxTime)).getMinutes();
  const maxSecond = new Date(toTimestamp(maxTime)).getSeconds();
  const [currentHour, currentMinute, currentSecond] =
    getTimeValues(currentValue);

  const getTimeUnitValues = (min: number, max: number, step: number) => {
    const unitValues: Record<string, string> = {};

    for (let i = min; i <= max; i += step) {
      const unitValue = String(i).padStart(2, "0");
      unitValues[i] = unitValue;
    }
    unitValues[max] = String(max).padStart(2, "0");

    return unitValues;
  };

  const hours = getTimeUnitValues(minHour, maxHour, hourStep);
  const fullMinutes = getTimeUnitValues(0, maxMinute, minuteStep);
  const minutes = getTimeUnitValues(minMinute, maxMinute, minuteStep);
  const seconds = getTimeUnitValues(minSecond, maxSecond, secondStep);
  const currentTime = computed(
    () =>
      `${
        !hours[currentHour.value] ? currentHour.value : hours[currentHour.value]
      }:${
        !minutes[currentMinute.value]
          ? currentMinute.value
          : minutes[currentMinute.value]
      }:${
        !seconds[currentSecond.value]
          ? currentSecond.value
          : seconds[currentSecond.value]
      }`
  );

  watch(
    () => currentTime.value,
    (newValue) => {
      currentValue.value = toTimestamp(newValue);
    }
  );

  return {
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
  };
}
