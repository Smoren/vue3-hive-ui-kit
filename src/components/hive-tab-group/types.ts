interface Tab {
  name: string;
  isActive: boolean;
  isDisabled: boolean;
  index: number;
  id: string;
}

interface TabsProvider {
  activeTabId: string;
  tabs: Tab[];
}

type AddTabType = (tab: Tab) => void;
type DeleteTabType = (id: string) => void;
type UpdateTabType = (id: string, tabData: Tab) => void;

export type { Tab, TabsProvider, AddTabType, DeleteTabType, UpdateTabType };
