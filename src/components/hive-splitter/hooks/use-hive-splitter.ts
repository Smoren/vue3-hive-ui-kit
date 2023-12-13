import { computed, nextTick, type Ref, ref, watch, ComponentInternalInstance } from 'vue';
import getPaneIndex from '@/components/hive-splitter/helpers/get-pane-index';
import useSplitterTouch from '@/components/hive-splitter/hooks/use-splitter-touch';
import getFormattedSize from '@/components/hive-splitter/helpers/get-formatted-size';
import type { Pane, onPaneUpdate, UpdateConfig, Size } from '@/components/hive-splitter/types';

interface ChangedPane {
  addedPane?: Pane;
}

function addPane(panes: Ref<Pane[]>, pane: Pane) {
  panes.value.splice(pane.index, 0, pane);
}

function updateIndexes(panes: Ref<Pane[]>) {
  panes.value.forEach((p: Pane, i: number) => {
    p.index = i;
  });
}

export default function useHiveSplitter(horizontal: boolean) {
  const splitterRef = ref<HTMLElement | null>(null);
  const panes: Ref<Pane[]> = ref([]);
  const isReady = ref(false);
  const panesCount = computed(() => panes.value.length);
  const indexedPanes = computed(() =>
    panes.value.reduce((obj: Record<string, Pane>, pane) => {
      obj[pane.id] = pane;
      return pane && obj;
    }, {}),
  );

  const { addOnMouseDown, addOnTouchStart, addOnClick, touch } = useSplitterTouch(
    splitterRef,
    panes,
    panesCount,
    horizontal,
  );

  const formatSize = (size: number | string): number => {
    if (size !== null && `${size}`.match(/px$/)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      const divider = horizontal ? splitterRef.value?.offsetHeight! : splitterRef.value?.offsetWidth!;
      size = parseFloat(size as string);
      size = ((size as number) / divider) * 100;
    } else {
      size = parseFloat(size as string);
    }

    return size;
  };

  const updatePaneStyle = function (pane: Pane): void {
    const size: number | string | null = indexedPanes.value[pane.id]?.size ?? null;
    if (pane.updateStyle) {
      pane.updateStyle({
        [horizontal ? 'height' : 'width']: `${size !== null ? formatSize(size) : size}%`,
      });
    }
  };

  const readjustSizes = async (spaceToAllocate: number, ungrowablePanes: string[], unshrinkablePanes: string[]) => {
    let equalSpaceToAllocate: number;
    if (spaceToAllocate > 0) {
      equalSpaceToAllocate = spaceToAllocate / (panesCount.value - ungrowablePanes.length);
    } else {
      equalSpaceToAllocate = spaceToAllocate / (panesCount.value - unshrinkablePanes.length);
    }

    panes.value.forEach((pane, i) => {
      if (spaceToAllocate > 0 && !ungrowablePanes.includes(pane.id)) {
        const newPaneSize = Math.max(Math.min(Number(pane.size) + equalSpaceToAllocate, pane.max), pane.min);
        const allocated = newPaneSize - Number(pane.size);
        spaceToAllocate -= allocated;
        pane.size = formatSize(newPaneSize);
      } else if (!unshrinkablePanes.includes(pane.id)) {
        const newPaneSize = Math.max(Math.min(Number(pane.size) + equalSpaceToAllocate, pane.max), pane.min);
        const allocated = newPaneSize - Number(pane.size);
        spaceToAllocate -= allocated;
        pane.size = formatSize(newPaneSize);
      }

      updatePaneStyle(pane);
    });
    if (Math.abs(spaceToAllocate) > 0.1) {
      await nextTick(() => {
        if (isReady.value) {
          console.warn('Splitter: Could not resize panes correctly due to their constraints.');
        }
      });
    }
  };

  const initPanesSizing = () => {
    let spaceToAllocate = 100;
    let panesWithDefinedSizesCount = 0;
    const ungrowablePanes: string[] = [];
    const unshrinkablePanes: string[] = [];

    panes.value.forEach((pane) => {
      if (pane.size !== null) {
        panesWithDefinedSizesCount += 1;
        spaceToAllocate -= formatSize(pane.size);
        if (Number(pane.size) >= Number(pane.max)) {
          ungrowablePanes.push(pane.id);
        }
        if (Number(pane.size) <= Number(pane.min)) {
          unshrinkablePanes.push(pane.id);
        }
      }
    });

    if (spaceToAllocate > 0.1) {
      let spaceToAllocate2 = 100;
      panes.value.forEach((pane) => {
        if (pane.size === null) {
          pane.size = formatSize(
            Math.max(Math.min(spaceToAllocate / (panesCount.value - panesWithDefinedSizesCount), pane.max), pane.min),
          );
        }
        spaceToAllocate2 -= formatSize(pane.size);
      });
      if (spaceToAllocate2 > 0.1) {
        readjustSizes(spaceToAllocate, ungrowablePanes, unshrinkablePanes);
      }
    }
  };

  const equalizeAfterAdd = ({ addedPane }: ChangedPane) => {
    let equalSpace = 100 / panesCount.value;
    let spaceToAllocate = 0;
    const ungrowablePanes: string[] = [];
    const unshrinkablePanes: string[] = [];
    if (addedPane && addedPane.givenSize !== null) {
      equalSpace = (100 - addedPane.givenSize) / (panesCount.value - 1);
    }
    panes.value.forEach((pane) => {
      if (pane.size) {
        spaceToAllocate -= formatSize(pane.size);
        if (Number(pane.size) >= Number(pane.max)) ungrowablePanes.push(pane.id);
        if (Number(pane.size) <= Number(pane.min)) unshrinkablePanes.push(pane.id);
      }
    });

    if (Math.abs(spaceToAllocate) < 0.1) return;
    panes.value.forEach((pane) => {
      if (!addedPane || addedPane.givenSize === null || addedPane.id === pane.id) {
        pane.size = formatSize(Math.max(Math.min(equalSpace, pane.max), pane.min));
      }

      spaceToAllocate -= Number(pane.size);
      if (Number(pane.size) >= pane.max) {
        ungrowablePanes.push(pane.id);
      }
      if (Number(pane.size) <= pane.min) {
        unshrinkablePanes.push(pane.id);
      }
    });
    if (spaceToAllocate > 0.1) {
      readjustSizes(spaceToAllocate, ungrowablePanes, unshrinkablePanes);
    }
  };

  const equalize = () => {
    const equalSpace = 100 / panesCount.value;
    let spaceToAllocate = 0;
    const ungrowablePanes: string[] = [];
    const unshrinkablePanes: string[] = [];

    panes.value.forEach((pane) => {
      pane.size = formatSize(Math.max(Math.min(equalSpace, pane.max), pane.min));
      spaceToAllocate -= pane.size;
      if (pane.size >= pane.max) {
        ungrowablePanes.push(pane.id);
      }
      if (pane.size <= pane.min) {
        unshrinkablePanes.push(pane.id);
      }
    });
    if (spaceToAllocate > 0.1) {
      readjustSizes(spaceToAllocate, ungrowablePanes, unshrinkablePanes);
    }
  };

  const resetPaneSizes = (changedPane: ChangedPane = {}) => {
    if (!changedPane.addedPane) {
      initPanesSizing();
    } else if (panes.value.some((pane) => pane.givenSize !== null || pane.min || pane.max < 100)) {
      equalizeAfterAdd(changedPane);
    } else {
      equalize();
    }
  };

  const addSplitter = (paneIndex: number, nextPaneNode: HTMLElement) => {
    const splitterIndex = paneIndex - 1;
    const el = document.createElement('div');
    el.classList.add('hive-splitter__splitter');
    addOnMouseDown(el, splitterIndex);
    addOnClick(el, splitterIndex);

    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      addOnTouchStart(el, splitterIndex);
    }

    (nextPaneNode.parentNode as HTMLElement).insertBefore(el, nextPaneNode);
  };

  const removeSplitter = (splitter: HTMLElement) => {
    splitter.onmousedown = null;
    splitter.onclick = null;
    splitter.ondblclick = null;
    splitter.remove();
  };

  const redoSplitters = () => {
    const children = Array.from((splitterRef.value as HTMLElement).children) as HTMLElement[];
    children.forEach((child) => {
      if (child.className.includes('hive-splitter__splitter')) {
        removeSplitter(child);
      }
    });

    let paneIndex = 0;
    children.forEach((child) => {
      if (child.className.includes('hive-splitter__pane')) {
        if (paneIndex) {
          addSplitter(paneIndex, child);
        }
        paneIndex += 1;
      }
    });
  };

  const onPaneAdd = async (pane: ComponentInternalInstance) => {
    const index = getPaneIndex(pane);
    const min = formatSize(getFormattedSize(pane.props.minSize as Size));
    const max = formatSize(getFormattedSize(pane.props.maxSize as Size));
    const newPane = {
      id: pane.props.id as string,
      index,
      min: Number.isNaN(min) || min === undefined ? 0 : min,
      max: Number.isNaN(max) || max === undefined ? 100 : max,
      size: pane.props.size === null ? null : getFormattedSize(pane.props.size as Size),
      givenSize: pane.props.size as number,
      //@ts-ignore
      updateStyle: pane.updateStyle,
    };

    addPane(panes, newPane);
    updateIndexes(panes);

    if (isReady.value) {
      await nextTick(() => {
        redoSplitters();
        resetPaneSizes({ addedPane: panes.value[index] });
      });
    }
  };

  const onPaneUpdate: onPaneUpdate = ({ paneComponent, ...args }) => {
    //@ts-ignore
    const pane = indexedPanes.value[paneComponent._.uid];
    Object.entries(args).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pane[key as keyof Omit<UpdateConfig, 'paneComponent'>] = value;
    });
  };

  const updatePaneComponents = () => {
    panes.value.forEach((pane) => {
      updatePaneStyle(pane);
    });
  };

  const checkSplitterNodes = () => {
    const children = Array.from((splitterRef.value as HTMLElement).children);

    children.forEach((child) => {
      const isPane = child.classList.contains('hive-splitter__pane');
      const isSplitter = child.classList.contains('hive-splitter__splitter');

      if (!isPane && !isSplitter) {
        child.remove();
        console.warn(
          'Splitter: Only <pane> elements are allowed at the root of <splitter>. One of DOM nodes was removed.',
        );
      }
    });
  };

  watch(
    () => panes.value,
    () => {
      updatePaneComponents();
    },
    { deep: true, immediate: false },
  );

  watch(
    () => horizontal,
    () => {
      updatePaneComponents();
    },
  );

  return {
    isReady,
    splitterRef,
    resetPaneSizes,
    redoSplitters,
    checkSplitterNodes,
    onPaneAdd,
    onPaneUpdate,
    touch,
  };
}
