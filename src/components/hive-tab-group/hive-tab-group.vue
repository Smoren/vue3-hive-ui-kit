<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Mount, Unmount, Update } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import useHiveTabGroup from './hooks/use-hive-tab-group';

export interface Props extends CommonProps {
  modelValue: string;
  withLocalStorage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  withLocalStorage: true,
});

type Emit = Mount & Unmount & Update<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const { currentTabId, currentTab, state, selectTab } = useHiveTabGroup(props.modelValue, props.withLocalStorage);

// watch(
//   () => state.tabs.length,
//   () => {
//     const temp = state.tabs[0];
//     if (temp) selectTab(temp.id);
//   },
// );

// onUpdated(() => {
//   state.tabs.sort((a, b) => Number(a.id) - Number(b.id));
// });

// return {
//   currentTabId,
//   ...toRefs(state),
//   component,
//   handleEvent,
//   selectTab,
//   currentTab,
//   state,
// };
</script>

<template>
  <div class="tab-group">
    <div class="ui top attached tabular menu tab-group__header" role="tablist">
      <div
        v-for="tab in state.tabs"
        :key="tab.id"
        :class="{ active: tab.id === state.activeTabId, disabled: tab.isDisabled }"
        class="item"
        role="tab"
        @click="selectTab(tab.id)"
      >
        {{ tab.name }}
      </div>
      <div class="item">
        <slot name="afterTabs" />
      </div>
    </div>
    <div class="ui bottom attached tab segment active" :class="state.tabClasses">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-group {
  &__header {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: fit-content;
      padding: 3px;
      cursor: pointer;
    }

    .active {
      border-bottom: 3px solid #2c3e50db !important;
    }
  }
}

.tab {
  width: 100%;
  // height: 100%
  background-color: transparent !important;
}
</style>
