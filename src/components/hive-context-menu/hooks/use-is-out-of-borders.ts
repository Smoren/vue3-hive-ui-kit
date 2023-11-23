export const useIsOutOfBordersWidth = (element: HTMLElement) => {
  return element.offsetLeft + element.offsetWidth > window.innerWidth;
};

export const useIsOutOfBordersHeight = (element: HTMLElement) => {
  return element.offsetHeight + element.offsetTop > window.scrollY + window.innerHeight;
};
