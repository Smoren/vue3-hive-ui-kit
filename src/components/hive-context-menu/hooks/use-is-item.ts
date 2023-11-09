import { ContextMenuSeparator, ContextMenuItem } from '../types';

export const useIsItem = (item: ContextMenuSeparator | ContextMenuItem): item is ContextMenuItem => {
  return (item as ContextMenuItem).label !== undefined;
};
