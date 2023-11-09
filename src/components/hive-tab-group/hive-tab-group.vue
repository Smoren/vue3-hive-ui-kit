<script setup lang="ts">
import { watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Mount, Unmount, Update } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import useHiveTabGroup from './hooks/use-hive-tab-group';
import { onUpdateModelValue } from '../../common/mixin/emits';

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

watch(currentTabId, () => {
  onUpdateModelValue(emit, currentTabId.value);
});
watch(
  () => props.modelValue,
  () => {
    currentTabId.value = props.modelValue;
  },
);
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
    <div class="tab-group__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-group {
  width: 100%;
  display: grid;
  grid-template-rows: 2.5rem 1fr;
  height: 100%;
  overflow: hidden;

  &__header {
    margin: 0;
    width: 100%;
    height: 2.5rem;
    max-width: calc(100% + 2px);
    box-shadow: none;
    border: none;
    background: none transparent;
    border-bottom: 1px solid #d4d4d5;
    overflow-y: auto;
    display: flex;
    gap: 25px;

    font-weight: 400;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: fit-content;
      padding: 3px;
      cursor: pointer;
      border-bottom: 3px solid transparent;
    }

    .active {
      border-bottom: 3px solid #2c3e50db;
    }
  }

  &__content {
    margin: 0;
    width: 100%;
    bottom: 0;
    margin-top: 0;
    top: 0;
    max-width: calc(100% + 2px);
    box-shadow: none;
    border: 1px solid #d4d4d5;
    height: 100%;
    position: relative;
    background: #fff;
    overflow-x: auto;
    box-sizing: border-box;
  }
}

.tab {
  width: 100%;
  background-color: transparent;
}
</style>
