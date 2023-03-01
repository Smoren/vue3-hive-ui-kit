import toTimestamp from '@hive/common/funcs/to-timestamp';

export default function formatDateTimeModelValue(
  modelValue: string | Array<number | string>
): number[] {
  let start = new Date().getTime();
  let end = new Date().getTime() + 1;

  if(modelValue === null || modelValue === ""){
    return [start, end];
  }

  if (typeof modelValue === 'string') {
    const values = modelValue.split(' ');
    start =
      values.length === 2
        ? toTimestamp(values[0])
        : toTimestamp([values[0], values[1]].join(' '));
    end =
      values.length === 2
        ? toTimestamp(values[1])
        : toTimestamp([values[2], values[3]].join(' '));
  } else {
    if(Array.isArray(modelValue)){
      start = toTimestamp(modelValue[0]);
      end = toTimestamp(modelValue[1]);
    } 
  }

  if(Number.isNaN(start) || Number.isNaN(end)){
    throw new Error('Invalid model value');
  }

  if (end < start) {
    end = start;
  }

  return [start, end];
}
