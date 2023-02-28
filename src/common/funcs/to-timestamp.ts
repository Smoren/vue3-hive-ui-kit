export default function toTimestamp(value: string | number): number {
  if (value === "" || value === null) {
    return -1;
  }
  if (typeof value === "string") {
    if (value.includes(" ")) {
      const dateParts = value.split(" ")[0].split("-");
      const timeParts = value.split(" ")[1].split(":");

      return new Date(
        +dateParts[0],
        +dateParts[1] - 1,
        +dateParts[2],
        +timeParts[0],
        +timeParts[1],
        +timeParts[2] || 0
      ).getTime();
    }
    if (value.includes("-")) {
      const dateParts = value.split("-");

      return new Date(
        +dateParts[0],
        +dateParts[1] - 1,
        +dateParts[2]
      ).getTime();
    }

    if (value.includes(":")) {
      const timeParts = value.split(":");
      const date = new Date();

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        +timeParts[0],
        +timeParts[1],
        +timeParts[2] || 0
      ).getTime();
    }
  }

  return value as number;
}
