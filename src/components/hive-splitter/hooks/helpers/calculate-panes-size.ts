import type { CursorPosition, Pane, TouchSplitter } from '@/components/hive-splitter/types';
import type { ComputedRef, Ref } from 'vue';

interface CalculatePanesSizeConfig {
  panes: Ref<Pane[]>;
  panesCount: ComputedRef<number>;
  touch: Ref<TouchSplitter>;
  cursorPosition: CursorPosition;
  horizontal: boolean;
  splitterRef: Ref<HTMLElement | null>;
}

interface Sums {
  prevPanesSize: number;
  nextPanesSize: number;
  prevReachedMinPanes: number;
  nextReachedMinPanes: number;
}

interface doPushOtherPanesConfig {
  panes: Ref<Pane[]>;
  panesCount: ComputedRef<number>;
  sums: Sums;
  dragPercentage: number;
  touch: Ref<TouchSplitter>;
}

const sumPrevPanesSize = (panes: Ref<Pane[]>, splitterIndex: number) =>
  panes.value.reduce((total, pane, i) => total + (i < splitterIndex ? Number(pane.size) : 0), 0);

const sumNextPanesSize = (panes: Ref<Pane[]>, splitterIndex: number) =>
  panes.value.reduce((total, pane, i) => total + (i > splitterIndex + 1 ? Number(pane.size) : 0), 0);

const getCurrentDragPercentage = (
  horizontal: boolean,
  splitterRef: Ref<HTMLElement | null>,
  cursorPosition: CursorPosition,
) => {
  const oneDimensionalPosition = cursorPosition[horizontal ? 'y' : 'x'];
  const containerSize = (splitterRef.value as HTMLElement)[horizontal ? 'clientHeight' : 'clientWidth'];
  return (oneDimensionalPosition * 100) / containerSize;
};

const findPrevExpandedPane = (panes: Ref<Pane[]>, splitterIndex: number) => {
  // @ts-ignore
  const pane = [...panes.value].reverse().find((p) => p.index < splitterIndex && p.size && p.size > p.min);
  return pane || ({} as Pane);
};

const findNextExpandedPane = (panes: Ref<Pane[]>, splitterIndex: number) => {
  // @ts-ignore
  const pane = panes.value.find((p) => p.index > splitterIndex + 1 && p.size && p.size > p.min);
  return pane || ({} as Pane);
};

const doPushOtherPanes = ({ sums, panesCount, dragPercentage, panes, touch }: doPushOtherPanesConfig) => {
  const splitterIndex = touch.value.activeSplitterIndex as number;
  const panesToResize = [splitterIndex, splitterIndex + 1];

  // @ts-ignore
  if (dragPercentage < sums.prevPanesSize + panes.value[panesToResize[0]].min) {
    panesToResize[0] = findPrevExpandedPane(panes, splitterIndex).index;
    sums.prevReachedMinPanes = 0;
    // @ts-ignore
    if (panesToResize[0] < splitterIndex) {
      panes.value.forEach((pane, i) => {
        // @ts-ignore
        if (i > panesToResize[0] && i <= splitterIndex) {
          pane.size = pane.min;
          sums.prevReachedMinPanes += pane.min;
        }
      });
    }
    // @ts-ignore
    sums.prevPanesSize = sumPrevPanesSize(panes, panesToResize[0]);

    if (panesToResize[0] === undefined) {
      sums.prevReachedMinPanes = 0;
      // @ts-ignore
      panes.value[0].size = panes.value[0].min;
      panes.value.forEach((pane, i) => {
        if (i > 0 && i <= splitterIndex) {
          pane.size = pane.min;
          sums.prevReachedMinPanes += pane.min;
        }
      });
      // @ts-ignore
      panes.value[panesToResize[1]].size =
        // @ts-ignore
        100 - sums.prevReachedMinPanes - panes.value[0].min - sums.prevPanesSize - sums.nextPanesSize;
      return null;
    }
  }
  // @ts-ignore
  if (dragPercentage > 100 - sums.nextPanesSize - panes.value[panesToResize[1]].min) {
    panesToResize[1] = findNextExpandedPane(panes, splitterIndex).index;
    sums.nextReachedMinPanes = 0;
    // @ts-ignore
    if (panesToResize[1] > splitterIndex + 1) {
      panes.value.forEach((pane, i) => {
        // @ts-ignore
        if (i > splitterIndex && i < panesToResize[1]) {
          pane.size = pane.min;
          sums.nextReachedMinPanes += pane.min;
        }
      });
    }
    // @ts-ignore
    sums.nextPanesSize = sumNextPanesSize(panes, panesToResize[1] - 1);

    if (panesToResize[1] === undefined) {
      sums.nextReachedMinPanes = 0;
      // @ts-ignore
      panes.value[panesCount.value - 1].size = panes.value[panesCount.value - 1].min;
      panes.value.forEach((pane, i) => {
        if (i < panesCount.value - 1 && i >= splitterIndex + 1) {
          pane.size = pane.min;
          sums.nextReachedMinPanes += pane.min;
        }
      });
      // @ts-ignore
      panes.value[panesToResize[0]].size =
        100 -
        sums.prevPanesSize -
        sums.nextReachedMinPanes -
        // @ts-ignore
        panes.value[panesCount.value - 1].min -
        sums.nextPanesSize;
      return null;
    }
  }
  return { sums, panesToResize };
};

export default function calculatePanesSize({
  panes,
  panesCount,
  touch,
  cursorPosition,
  horizontal,
  splitterRef,
}: CalculatePanesSizeConfig) {
  const splitterIndex = touch.value.activeSplitterIndex as number;
  const minDrag = 0;
  const maxDrag = 100;
  const dragPercentage = Math.max(
    Math.min(getCurrentDragPercentage(horizontal, splitterRef, cursorPosition), maxDrag),
    minDrag,
  );
  let sums = {
    prevPanesSize: sumPrevPanesSize(panes, splitterIndex),
    nextPanesSize: sumNextPanesSize(panes, splitterIndex),
    prevReachedMinPanes: 0,
    nextReachedMinPanes: 0,
  };
  let panesToResize = [splitterIndex, splitterIndex + 1];
  // @ts-ignore
  let paneBefore = panes.value[panesToResize[0]] || null;
  // @ts-ignore
  let paneAfter = panes.value[panesToResize[1]] || null;
  const paneBeforeMaxReached = paneBefore.max < 100 && dragPercentage >= paneBefore.max + sums.prevPanesSize;
  const paneAfterMaxReached =
    paneAfter.max < 100 && dragPercentage <= 100 - (paneAfter.max + sumNextPanesSize(panes, splitterIndex + 1));

  if (paneBeforeMaxReached || paneAfterMaxReached) {
    if (paneBeforeMaxReached) {
      paneBefore.size = paneBefore.max;
      paneAfter.size = Math.max(100 - paneBefore.max - sums.prevPanesSize - sums.nextPanesSize, 0);
    } else {
      paneBefore.size = Math.max(
        100 - paneAfter.max - sums.prevPanesSize - sumNextPanesSize(panes, splitterIndex + 1),
        0,
      );
      paneAfter.size = paneAfter.max;
    }
    return;
  }

  const vars = doPushOtherPanes({
    sums,
    dragPercentage,
    panes,
    panesCount,
    touch,
  });

  if (!vars) {
    return;
  }
  ({ sums, panesToResize } = vars);
  // @ts-ignore
  paneBefore = panes.value[panesToResize[0]] || null;
  // @ts-ignore
  paneAfter = panes.value[panesToResize[1]] || null;
  if (paneBefore !== null) {
    paneBefore.size = Math.min(
      Math.max(dragPercentage - sums.prevPanesSize - sums.prevReachedMinPanes, paneBefore.min),
      paneBefore.max,
    );
  }
  if (paneAfter !== null) {
    paneAfter.size = Math.min(
      Math.max(100 - dragPercentage - sums.nextPanesSize - sums.nextReachedMinPanes, paneAfter.min),
      paneAfter.max,
    );
  }
}
