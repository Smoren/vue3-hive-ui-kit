import { ContextMenuSeparator, ContextMenuItem } from '../types';

export const useIsSeparator = (item: ContextMenuSeparator | ContextMenuItem): item is ContextMenuSeparator => {
  return (item as ContextMenuSeparator).separator === true;
};
