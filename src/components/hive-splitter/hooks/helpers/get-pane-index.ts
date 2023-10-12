import type { VueComponent } from '@/common/types/value';

export default function getPaneIndex(pane: VueComponent): number {
  let index = -1;
  Array.from(pane.vnode.el.parentNode.children).some((el) => {
    if ((el as HTMLElement).className.includes('splitter__pane')) {
      index += 1;
    }

    return el === pane.$el;
  });

  return index;
}
