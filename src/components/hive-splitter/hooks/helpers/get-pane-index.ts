import { ComponentInternalInstance } from 'vue';

export default function getPaneIndex(pane: ComponentInternalInstance): number {
  let index = -1;
  Array.from(pane.vnode.el?.parentNode.children).some((el) => {
    if ((el as HTMLElement).className.includes('splitter__pane')) {
      index += 1;
    }
    //@ts-ignore
    return el === pane.$el;
  });

  return index;
}
