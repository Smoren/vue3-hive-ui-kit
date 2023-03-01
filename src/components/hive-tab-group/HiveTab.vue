<template>
  <section
    v-show="isActive"
    :id="id"
    ref="tab"
    v-bind="attrs"
    :aria-hidden="!isActive"
    :class="classes"
    :style="style"
    role="tabpanel"
    class="w"
  >
    <slot />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import commonProps from '@hive/common/mixins/common-props';
import useOnMount from '@hive/common/hooks/base/use-on-mount';
import useComponent from '@hive/common/hooks/base/use-component';
import useEventHandler, {
  type EventConfig,
} from '@hive/common/hooks/base/use-event-handler';
import useHiveTab, {
  type TabConfig,
} from '@hive/components/hive-tab-group/hooks/use-hive-tab';

export default defineComponent({
  name: 'HiveTab',
  props: {
    name: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const { isActive } = useHiveTab(props as TabConfig);

    const handleEvent = useEventHandler({
      props,
      context,
      component,
    } as EventConfig);

    return {
      isActive,
      component,
      handleEvent,
    };
  },
});
</script>

<style scoped lang="scss">
@import '@hive/assets/css/semantic.css';
</style>
