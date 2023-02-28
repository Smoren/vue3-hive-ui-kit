import { ref, type Ref } from "vue";

export default function getTimeValues(
  currentTime: Ref<string | number>
): Array<Ref<string>> {
  if (typeof currentTime.value === "string") {
    const timeValues = currentTime.value.split(":");
    return [
      ref(String(+timeValues[0])),
      ref(String(+timeValues[1])),
      ref(String(+timeValues[1])),
    ];
  }

  const date = new Date(currentTime.value);

  return [
    ref(String(date.getHours())),
    ref(String(date.getMinutes())),
    ref(String(date.getSeconds())),
  ];
}
