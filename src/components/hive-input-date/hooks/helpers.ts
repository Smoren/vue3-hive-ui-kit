import type { Ref } from 'vue';

type DateType = Ref<Date>;

function getMonthLastDay(date: DateType): number {
  return new Date(
    date.value.getFullYear(),
    date.value.getMonth() + 1,
    0
  ).getDate();
}

function getPrevMonthLastDay(date: DateType): number {
  return new Date(date.value.getFullYear(), date.value.getMonth(), 0).getDate();
}

function getLastDayIndex(date: DateType): number {
  const lastDayIndex =
    new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0).getDay() -
    1;

  return lastDayIndex === -1 ? 6 : lastDayIndex;
}

function getPrevDays(date: DateType): number[] {
  const prevMonthLastDay = getPrevMonthLastDay(date as Ref<Date>);
  const firstDayIndex = date.value.getDay() === 0 ? 6 : date.value.getDay() - 1;
  const prevDays = [];

  for (let i = firstDayIndex; i > 0; i -= 1) {
    prevDays.push(prevMonthLastDay - i + 1);
  }

  return prevDays;
}

function getDays(date: DateType): number[] {
  const monthLastDay = getMonthLastDay(date as Ref<Date>);
  const days = [];

  for (let i = 1; i <= monthLastDay; i += 1) {
    days.push(i);
  }

  return days;
}

function getNextDays(date: DateType): number[] {
  const lastDayIndex = getLastDayIndex(date as Ref<Date>);
  const nextDaysCount = 7 - lastDayIndex - 1;
  const nextDays = [];

  for (let i = 1; i <= nextDaysCount; i += 1) {
    nextDays.push(i);
  }

  return nextDays;
}

function getDay(timestamp: number): number {
  const date = new Date(timestamp);
  return date.getDate();
}

function getYears(minYear: number, maxYear: number): number[] {
  const years = [];

  for (let i = minYear; i <= maxYear; i += 1) {
    years.push(i);
  }

  return years;
}

function getMinDateTimestamp(yearsRange = 50): number {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.ceil(yearsRange / 2));
  date.setDate(1);
  date.setMonth(0);

  return date.getTime();
}

function getMaxDateTimestamp(yearsRange = 50): number {
  const date = new Date();
  date.setFullYear(date.getFullYear() + Math.floor(yearsRange / 2));
  date.setMonth(11);
  date.setDate(31);

  return date.getTime();
}

export {
  type DateType,
  getMonthLastDay,
  getPrevMonthLastDay,
  getLastDayIndex,
  getPrevDays,
  getDays,
  getNextDays,
  getDay,
  getYears,
  getMinDateTimestamp,
  getMaxDateTimestamp,
};
