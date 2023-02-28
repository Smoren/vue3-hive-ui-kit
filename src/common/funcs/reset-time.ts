export default function resetTime(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  return date.getTime();
}
