<template>
  <div :class="classes" :style="style" class="tab-group" v-bind="attrs">
    <div class="ui top attached tabular menu tab-group__header" role="tablist">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: tab.id === activeTabId, disabled: tab.isDisabled }"
        class="item"
        role="tab"
        @click="selectTab(tab.id)"
      >
        {{ tab.name }} 
      </div>
    </div>
    <div class="ui bottom attached tab segment active">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch } from 'vue';
import commonProps from '@hive/common/mixins/common-props';
import useOnMount from '@hive/common/hooks/base/use-on-mount';
import useComponent from '@hive/common/hooks/base/use-component';
import useEventHandler, {
  type EventConfig,
} from '@hive/common/hooks/base/use-event-handler';
import useHiveTabGroup, {
  type ModelValueType,
} from '@hive/components/hive-tab-group/hooks/use-hive-tab-group';
// import '@hive/components/assets/scss/semantic.scss';

export default defineComponent({
  name: 'HiveTabGroup',
  emits: ['update:modelValue', 'event'],
  props: {
    modelValue: {
      type: String,
    },
    modelValueEventName: {
      type: String,
      default: 'change',
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const { currentTabId, currentTab, state, selectTab } = useHiveTabGroup(
      props.modelValue as ModelValueType
    );

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentTabId,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    watch(
      () => currentTab.value,
      () => handleEvent(new Event(props.modelValueEventName), currentTab.value)
    );

    return {
      currentTabId,
      ...toRefs(state),
      component,
      handleEvent,
      selectTab,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';

.tab-group__header {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px;
    cursor: pointer;
    width: fit-content;
  }
}
</style>
