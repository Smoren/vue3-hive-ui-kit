import { type ComputedRef, type Ref, ref } from 'vue';
import type { Pane, TouchSplitter } from '@/components/hive-splitter/types';
import calculatePanesSize from '@/components/hive-splitter/hooks/helpers/calculate-panes-size';

interface Taps {
  splitterIndex: number | null;
  timeoutId: number | null;
}

interface SplitterTouchExport {
  addOnMouseDown: (el: HTMLElement, splitterIndex: number) => void;
  addOnTouchStart: (el: HTMLElement, splitterIndex: number) => void;
  addOnClick: (el: HTMLElement, splitterIndex: number) => void;
  touch: Ref<TouchSplitter>;
}

export default function useSplitterTouch(
  splitterRef: Ref<HTMLElement | null>,
  panes: Ref<Pane[]>,
  panesCount: ComputedRef<number>,
  horizontal: boolean,
): SplitterTouchExport {
  const touch = ref<TouchSplitter>({
    mouseDown: false,
    isDragging: false,
    activeSplitterIndex: null,
  });
  const taps = ref<Taps>({
    splitterIndex: null,
    timeoutId: null,
  });

  const getCursorPosition = (event: TouchEvent | MouseEvent) => {
    const rect = (splitterRef.value as HTMLElement).getBoundingClientRect();
    const { clientX, clientY } =
      'ontouchstart' in window && (event as TouchEvent).touches
        ? (event as TouchEvent).touches[0]
        : (event as MouseEvent);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const onMouseMove = (event: TouchEvent | MouseEvent) => {
    if (touch.value.mouseDown) {
      event.preventDefault();
      touch.value.isDragging = true;
      calculatePanesSize({
        cursorPosition: getCursorPosition(event),
        panes,
        panesCount,
        touch,
        horizontal,
        splitterRef,
      });
      // handleEvent(
      //   new Event('onResize'),
      //   panes.value.map((pane) => ({
      //     min: pane.min,
      //     max: pane.max,
      //     size: pane.size,
      //   })),
      // );
    }
  };

  const onMouseUp = () => {
    // if (touch.value.isDragging) {
    //   handleEvent(
    //     new Event('onResized'),
    //     panes.value.map((pane) => ({
    //       min: pane.min,
    //       max: pane.max,
    //       size: pane.size,
    //     })),
    //   );
    // }
    touch.value.mouseDown = false;
    setTimeout(() => {
      touch.value.isDragging = false;
      unbindEvents();
    }, 100);
  };

  const bindEvents = () => {
    document.addEventListener('mousemove', onMouseMove, {
      passive: false,
    });
    document.addEventListener('mouseup', onMouseUp);
    if ('ontouchstart' in window) {
      document.addEventListener('touchmove', onMouseMove, {
        passive: false,
      });
      document.addEventListener('touchend', onMouseUp);
    }
  };

  const onMouseDown = (event: MouseEvent | TouchEvent, splitterIndex: number) => {
    bindEvents();
    touch.value.mouseDown = true;
    touch.value.activeSplitterIndex = splitterIndex;
  };

  const onSplitterClick = (event: MouseEvent, splitterIndex: number) => {
    if ('ontouchstart' in window) {
      event.preventDefault();
      taps.value.splitterIndex = splitterIndex;
      taps.value.timeoutId = setTimeout(() => {
        taps.value.splitterIndex = null;
      }, 500);
    }
    if (!touch.value.isDragging) {
      handleEvent(new Event('splitter-click'), panes.value[splitterIndex]);
    }
  };

  const addOnMouseDown = (el: HTMLElement, splitterIndex: number) => {
    el.onmousedown = (event) => {
      onMouseDown(event, splitterIndex);
    };
  };

  const addOnTouchStart = (el: HTMLElement, splitterIndex: number) => {
    el.ontouchstart = (event) => onMouseDown(event, splitterIndex);
  };

  const addOnClick = (el: HTMLElement, splitterIndex: number) => {
    el.onclick = (event) => onSplitterClick(event, splitterIndex + 1);
  };

  function unbindEvents() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if ('ontouchstart' in window) {
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    }
  }

  return {
    addOnMouseDown,
    addOnTouchStart,
    addOnClick,
    touch,
  };
}
