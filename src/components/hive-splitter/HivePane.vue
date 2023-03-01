<template>
  <div class="hive-splitter__pane" :style="{ ...style, ...updatedStyle }">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useHivePane from "@hive/components/hive-splitter/hooks/use-hive-pane";

export default defineComponent({
  name: "HivePane",
  props: {
    size: {
      type: [Number, String],
      default: null,
    },
    minSize: {
      type: [Number, String],
      default: "0%",
    },
    maxSize: {
      type: [Number, String],
      default: "100%",
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);

    if (this.onPaneAdd) {
      this.onPaneAdd(this);
    }
  },
  watch: {
    formattedSize(size) {
      if (this.onPaneUpdate) {
        this.onPaneUpdate({ paneComponent: this, size });
      }
    },
    formattedMinSize(min) {
      if (this.onPaneUpdate) {
        this.onPaneUpdate({ paneComponent: this, min });
      }
    },
    formattedMaxSize(max) {
      if (this.onPaneUpdate) {
        this.onPaneUpdate({ paneComponent: this, max });
      }
    },
  },
  setup(props, context) {
    const { component } = useComponent(props);
    const handleEvent = useEventHandler({
      props,
      context,
      component,
    } as EventConfig);
    const {
      onPaneUpdate,
      onPaneAdd,
      updateStyle,
      updatedStyle,
      formattedSize,
      formattedMinSize,
      formattedMaxSize,
    } = useHivePane({
      size: props.size,
      minSize: props.minSize,
      maxSize: props.maxSize,
    });

    return {
      component,
      handleEvent,
      onPaneUpdate,
      onPaneAdd,
      updateStyle,
      updatedStyle,
      formattedSize,
      formattedMinSize,
      formattedMaxSize,
    };
  },
});
</script>
