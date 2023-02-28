import type { ValueType } from '../../common/types';

export default function sortArray(array: ValueType[]) {
  return [...array].sort((a, b) => String(a).localeCompare(String(b)));
}
