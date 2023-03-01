import { computed, type Ref, ref, watch, type WritableComputedRef } from 'vue';
import {
  type DateType,
  getDay,
  getDays,
  getMaxDateTimestamp,
  getMinDateTimestamp,
  getNextDays,
  getPrevDays,
  getYears,
} from '@hive/components/hive-input-date/hooks/helpers';
import toTimestamp from '@hive/common/funcs/to-timestamp';
import resetTime from '@hive/common/funcs/reset-time';

type Days = number[];

interface InputDateCalendarConfig {
  modelValue: string | number;
  minDate?: string | number;
  maxDate?: string | number;
  withTimezone?: boolean;
}

interface InputDateCalendarExport {
  currentValue: Ref<number>;
  daysOfWeek: string[];
  months: string[];
  years: number[];
  month: WritableComputedRef<string>;
  year: WritableComputedRef<number>;
  prevDays: Ref<Days>;
  days: Ref<Days>;
  nextDays: Ref<Days>;
  isFiltersShown: Ref<boolean>;
  changeDate: (event: Event) => void;
  updateCurrentValue: (day?: number, monthType?: string) => void;
  toggleFiltersVisibility: () => void;
  getDateTimestamp: (day: number, monthType?: string) => number;
  isInDateRange: (dateTimestamp: number) => boolean;
  isChangeDateAvaliable: (name: string) => boolean;
  timezone: number;
}

export type { InputDateCalendarConfig };

export default function useHiveInputDateCalendar({
  modelValue,
  minDate = getMinDateTimestamp(),
  maxDate = getMaxDateTimestamp(),
  withTimezone = false,
}: InputDateCalendarConfig): InputDateCalendarExport {
  const timezone = withTimezone ? 0 : new Date().getTimezoneOffset();
  const currentValue = ref(toTimestamp(modelValue));
  const minDateTimestamp = toTimestamp(minDate);
  const maxDateTimestamp = toTimestamp(maxDate);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  const date = ref(currentValue.value === -1 ? new Date() : new Date(currentValue.value));
  date.value.setDate(1);
  const month = computed({
    get: () => months[date.value.getMonth()],
    set: (val: string) => {
      date.value = new Date(
        date.value.setMonth(months.findIndex((item) => item === val))
      );
      // eslint-disable-next-line no-use-before-define
      updateCurrentValue();
    },
  });
  const year = computed({
    get: () => date.value.getFullYear(),
    set: (val: number) => {
      date.value = new Date(date.value.setFullYear(val));
      // eslint-disable-next-line no-use-before-define
      updateCurrentValue();
    },
  });
  const years = getYears(
    new Date(minDateTimestamp).getFullYear(),
    new Date(maxDateTimestamp).getFullYear()
  );
  const prevDays = ref(getPrevDays(date as DateType));
  const days = ref(getDays(date as DateType));
  const nextDays = ref(getNextDays(date as DateType));
  const isFiltersShown = ref(false);

  const isInDateRange = (dateTimestamp: number) => {
    // console.log(minDateTimestamp, maxDateTimestamp, minDate, maxDate);
    return (
      dateTimestamp >= resetTime(minDateTimestamp) &&
      dateTimestamp <= resetTime(maxDateTimestamp)
    );
  };

  const isInMonthRange = (dateTimestamp: number): boolean => {
    const date = new Date(dateTimestamp);
    const startMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return (
      isInDateRange(startMonth.getTime()) || isInDateRange(endMonth.getTime())
    );
  };

  const isInYearRange = (dateTimestamp: number): boolean => {
    const date = new Date(dateTimestamp);
    const startYear = new Date(date.getFullYear(), 1, 1);
    const endYear = new Date(date.getFullYear(), 12, 31);
    return (
      isInDateRange(startYear.getTime()) || isInDateRange(endYear.getTime())
    );
  };

  const changeDate = (event: Event) => {
    let newDate;

    if ((event.target as HTMLElement).classList.contains("left")) {
      newDate = new Date(
        new Date(date.value.getTime()).setMonth(date.value.getMonth() - 1)
      );
    } else {
      newDate = new Date(
        new Date(date.value.getTime()).setMonth(date.value.getMonth() + 1)
      );
    }

    if (isInMonthRange(newDate.getTime())) {
      date.value = newDate;
    }
  };

  const isChangeDateAvaliable  = (name: string): boolean => {
    let newDate;

    if (name === "left") {
      newDate = new Date(
        new Date(date.value.getTime()).setMonth(date.value.getMonth() - 1)
      );
    } else {
      newDate = new Date(
        new Date(date.value.getTime()).setMonth(date.value.getMonth() + 1)
      );
    }

    return isInMonthRange(newDate.getTime())
  };


  const getDateTimestamp = (day: number, monthType = 'current') => {
    let monthIndex;

    switch (monthType) {
      case 'prev':
        monthIndex = -1;
        break;
      case 'next':
        monthIndex = 1;
        break;
      default:
        monthIndex = 0;
    }

    return new Date(
      year.value,
      date.value.getMonth() + monthIndex,
      day,
      new Date(currentValue.value).getHours(),
      new Date(currentValue.value).getMinutes(),
      new Date(currentValue.value).getSeconds(),
      new Date(currentValue.value).getMilliseconds()
    ).getTime();
  };

  const updateCurrentValue = (
    day = getDay(currentValue.value),
    monthType = 'current'
  ) => {
    const newDateTimestamp = getDateTimestamp(day, monthType);

    if (
      newDateTimestamp !== currentValue.value &&
      isInDateRange(newDateTimestamp)
    ) {
      currentValue.value = newDateTimestamp;
    }
  };

  const toggleFiltersVisibility = () => {
    isFiltersShown.value = !isFiltersShown.value;
  };

  watch(
    () => date.value,
    () => {
      prevDays.value = getPrevDays(date as Ref<Date>);
      days.value = getDays(date as Ref<Date>);
      nextDays.value = getNextDays(date as Ref<Date>);
    }
  );

  return {
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
    timezone
  };
}
