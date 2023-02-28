type ReturnType = 'full' | 'date' | 'time';

export default function toDateString(
  value: string | number,
  returnType = 'full' as ReturnType,
  withSeconds = false
): string {
  if (!value) {
    return '';
  }

  let dateOptions;

  switch (returnType) {
    case 'time':
      dateOptions = {
        hour: 'numeric',
        minute: 'numeric',
        ...(withSeconds ? { second: 'numeric' } : {}),
      };
      break;
    case 'date':
      dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      break;
    default:
      dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        ...(withSeconds ? { second: 'numeric' } : {}),
      };
  }

  const formatter = new Intl.DateTimeFormat(
    undefined,
    dateOptions as Intl.DateTimeFormatOptions
  );

  if (typeof value === 'string') {
    if (value.includes(':') && !value.includes(' ')) {
      const timeParts = value.split(':');
      const date = new Date();

      return formatter.format(
        new Date(
          // date.getFullYear(),
          // date.getMonth(),
          // date.getDate(),
          // +timeParts[0],
          // +timeParts[1],
          // +timeParts[2] || 0
        )
      );
    }

    return formatter.format(new Date(value));
  }

  return formatter.format(new Date(value));
}
