import type { Size } from '@/components/hive-splitter/types';

export default function getFormattedSize(size: Size) {
  if (size === null || size === 0) {
    return 0;
  }

  if (`${size}`.match(/%$/)) {
    return parseFloat(size as string);
  }

  return `${size}px`;
}
