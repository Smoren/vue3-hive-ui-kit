import { computed, type ComputedRef, onMounted, provide, reactive, type Ref, ref, watch } from 'vue';
import type { Tab, TabsProvider } from '@/ui-kit/src/components/hive-tab-group/types';

type ModelValueType = string;

interface TabGroupExport {
  currentTabId: Ref<string>;
  currentTab: ComputedRef<Tab | undefined>;
  state: TabsProvider;
  selectTab: (tabId: string) => void;
}

export type { ModelValueType };

export default function useHiveTabGroup(modelValue: ModelValueType, withLocalStorage: boolean): TabGroupExport {
  const currentTabId = ref(modelValue);
  const state = reactive<TabsProvider>({
    activeTabId: currentTabId.value,
    tabs: [],
  });

  watch(
    () => currentTabId.value,
    () => {
      state.activeTabId = currentTabId.value ?? '1';
    },
  );
  provide('tabsProvider', state);

  provide('addTab', (tab: Tab) => {
    state.tabs.push(tab);
  });

  provide('updateTab', (id: string, tabData: Tab) => {
    const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
    state.tabs[tabIndex] = tabData;
  });

  provide('deleteTab', (id: string) => {
    const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
    state.tabs.splice(tabIndex, 1);
  });

  const storageKey = `hive-tab-group.cache.${window.location.host}${window.location.pathname}`;

  const findTab = (id: string) => state.tabs.find((tab) => tab.id === id);

  const currentTab = computed(() => findTab(currentTabId.value));

  const selectTab = (tabId: string) => {
    console.log(tabId);
    const selectedTab = findTab(tabId);

    if (!selectedTab) {
      return;
    }

    if (selectedTab.isDisabled || state.activeTabId === selectedTab.id) {
      return;
    }

    state.tabs.forEach((tab) => {
      tab.isActive = tab.id === selectedTab.id;
    });

    state.activeTabId = selectedTab.id;
    currentTabId.value = selectedTab.id;

    localStorage.setItem(storageKey, selectedTab.id);
  };

  selectTab(currentTabId.value);

  onMounted(() => {
    if (!state.tabs.length) {
      return;
    }

    const previousSelectedTabId = localStorage.getItem(storageKey);
    if (!previousSelectedTabId || !withLocalStorage) {
      return;
    }

    if (findTab(previousSelectedTabId)) {
      selectTab(previousSelectedTabId);
      return;
    }

    if (currentTabId.value && findTab(currentTabId.value)) {
      selectTab(currentTabId.value);
      return;
    }

    const temp = state.tabs[0];

    if (temp) selectTab(temp.id);
  });

  return {
    currentTabId,
    currentTab,
    state,
    selectTab,
  };
}
