import type { VueComponent } from '../../../common/types';

export default function getPaneIndex(pane: VueComponent): number {
  let index = -1;
  Array.from(pane.$el.parentNode.children).some((el) => {
    if ((el as HTMLElement).className.includes('splitter__pane')) {
      index++;
    }

    return el === pane.$el;
  });

  return index;
}
