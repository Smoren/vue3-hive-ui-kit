export default function getFormattedSize(size: string | number | null) {
  if (size === null || size === 0) {
    return 0;
  }

  if (`${size}`.match(/%$/)) {
    return parseFloat(size as string);
  }

  return `${size}px`;
}
