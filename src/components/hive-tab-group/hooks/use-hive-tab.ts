import {
  inject,
  onBeforeMount,
  onBeforeUnmount,
  type Ref,
  ref,
  watch,
} from "vue";
import type {
  AddTabType,
  DeleteTabType,
  TabsProvider,
  UpdateTabType,
} from "@hive/components/hive-tab-group/types";

interface TabConfig {
  name: string;
  isDisabled: boolean;
  id: string;
  attrs: Record<string, unknown>;
  classes: string[] | Record<string, boolean>;
  style: Record<string, unknown>;
}

interface TabExport {
  isActive: Ref<boolean>;
}

export type { TabConfig };

export default function useHiveTab(props: TabConfig): TabExport {
  const isActive = ref(false);
  const tabsProvider = inject("tabsProvider");
  const addTab = inject("addTab") as AddTabType;
  const updateTab = inject("updateTab") as UpdateTabType;
  const deleteTab = inject("deleteTab") as DeleteTabType;

  watch(
    () => (tabsProvider as TabsProvider).activeTabId,
    () => {
      isActive.value = props.id === (tabsProvider as TabsProvider).activeTabId;
    }
  );

  watch(
    () => ({ ...props }),
    () =>
      updateTab(props.id, {
        name: props.name,
        isActive: isActive.value,
        isDisabled: props.isDisabled,
        index: (tabsProvider as TabsProvider).tabs.length,
        id: props.id,
      })
  );

  onBeforeMount(() =>
    addTab({
      name: props.name,
      isActive: isActive.value,
      isDisabled: props.isDisabled,
      index: (tabsProvider as TabsProvider).tabs.length,
      id: props.id,
    })
  );

  onBeforeUnmount(() => {
    deleteTab(props.id);
  });

  return { isActive };
}
