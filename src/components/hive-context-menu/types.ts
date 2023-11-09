export interface ContextMenuSeparator {
  separator: true;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  items?: ContextMenuItems;
  function?: (...args: unknown[]) => void;
  closeOnClick?: boolean;
}

export type ContextMenuItems = (ContextMenuItem | ContextMenuSeparator)[];
