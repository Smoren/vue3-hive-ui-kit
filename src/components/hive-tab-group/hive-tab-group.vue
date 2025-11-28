<script setup lang="ts">
import { watch } from 'vue';
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount, Update, Event } from '@/common/mixin/emits';
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

type Emit = Event & Mount & Unmount & Update<string>;
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
@use '@/assets/variables.scss' as *;

.tab-group {
  width: 100%;
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
    border-bottom: 1px solid var(--border, $border);
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
      border-bottom: 3px solid var(--tab-active, $tab-active);
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
    border: 1px solid var(--border, $border);
    height: 100%;
    position: relative;
    background: var(--bg-input, $bg-input);
    overflow-x: auto;
    box-sizing: border-box;
  }
}

.tab {
  width: 100%;
  background-color: transparent;
}
</style>
