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

watch(
  () => state.tabs.length,
  () => {
    const temp = state.tabs[0];
    if (temp) selectTab(temp.id);
  },
);

// onUpdated(() => {
//   state.tabs.sort((a, b) => Number(a.id) - Number(b.id));
// });
</script>

<template>
  <div class="tab-group">
    <div class="tab-group__header" role="tablist">
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
    <div class="tab-group__content" :class="state.tabClasses">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-group {
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;

  &__header {
    margin: 0;
    width: 100%;
    max-width: calc(100% + 2px);
    box-shadow: none;
    border: none;
    background: none transparent;
    border-bottom: 1px solid #d4d4d5;
    overflow-y: auto;
    display: flex;

    font-weight: 400;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: fit-content;
      padding: 3px;
      cursor: pointer;
    }

    .active {
      border-bottom: 3px solid #2c3e50db;
    }
  }

  &__content {
    margin-left: 0;
    margin-top: 0;
    margin-right: 0;
    width: 100%;
    margin-bottom: 1rem;
    bottom: 0;
    margin-top: 0;
    top: 0;
    max-width: calc(100% + 2px);
    box-shadow: none;
    border: 1px solid #d4d4d5;
    height: 100%;
    position: relative;
    background: #fff;
  }
}

.tab {
  width: 100%;
  background-color: transparent;
}
</style>
