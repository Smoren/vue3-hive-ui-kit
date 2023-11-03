import { ComponentInternalInstance } from 'vue';

type Size = null | number | string;
type OnPaneAdd = (pane: ComponentInternalInstance) => void;

interface UpdateConfig {
  paneComponent: ComponentInternalInstance;
  size?: Size;
  min?: Size;
  max?: Size;
}
type onPaneUpdate = (config: UpdateConfig) => void;

interface Pane {
  id: string;
  index: number;
  min: number;
  max: number;
  size: number | null | string;
  givenSize: number | null;
  updateStyle: (style: Record<string, string>) => void;
}

interface CursorPosition {
  x: number;
  y: number;
}

interface TouchSplitter {
  mouseDown: boolean;
  isDragging: boolean;
  activeSplitterIndex: null | number;
}

export type { OnPaneAdd, Size, UpdateConfig, onPaneUpdate, Pane, CursorPosition, TouchSplitter };
