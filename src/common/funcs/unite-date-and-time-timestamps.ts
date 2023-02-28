export default function uniteDateAndTimeTimestamps(
  dateTimestamp: number,
  timeTimestamp: number
) {
  const date = new Date(dateTimestamp);
  const hour = new Date(timeTimestamp).getHours();
  const minute = new Date(timeTimestamp).getMinutes();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.getTime();
}
