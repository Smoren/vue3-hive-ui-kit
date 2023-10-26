export const useDebounce = <T extends Array<any>, U>(fn: (...args: T) => U, wait: number) => {
  let timer: NodeJS.Timeout;
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      return fn(...args);
    }, wait);
  };
};
