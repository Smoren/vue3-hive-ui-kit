import { inject, onBeforeMount, onBeforeUnmount, type Ref, watch, computed } from 'vue';
import type {
  AddTabType,
  DeleteTabType,
  TabsProvider,
  UpdateTabType,
} from '@/ui-kit/src/components/hive-tab-group/types';

interface TabConfig {
  name: string;
  isDisabled: boolean;
  id: string;
}

interface TabExport {
  isActive: Ref<boolean>;
}

export type { TabConfig };

export default function useHiveTab(props: TabConfig): TabExport {
  const tabsProvider = inject('tabsProvider');
  const isActive = computed(() => props.id === (tabsProvider as TabsProvider).activeTabId);
  const addTab = inject('addTab') as AddTabType;
  const updateTab = inject('updateTab') as UpdateTabType;
  const deleteTab = inject('deleteTab') as DeleteTabType;

  watch(
    () => ({ ...props }),
    () => {
      updateTab(props.id, {
        name: props.name,
        isActive: isActive.value,
        isDisabled: props.isDisabled,
        index: (tabsProvider as TabsProvider).tabs.length,
        id: props.id,
      });
    }
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
