export const useIsOutOfBorders = (element: HTMLElement) => {
  return element.offsetLeft + element.offsetWidth > window.innerWidth;
};
