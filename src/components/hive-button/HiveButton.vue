<template>
  <div class="wrapper" :class="classes" :style="style">
    <button class="button" @click="leftClick" @click.right.prevent="rightClick">
      <slot name="before"></slot>
      <span>{{ text }}</span>
      <slot name="after" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, onUpdated } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";

export default defineComponent({
  name: "HiveButton",
  props: {
    text: {
      type: String,
      default: "Button",
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const handleEvent = useEventHandler({
      props,
      context,
      component,
    } as EventConfig);

    const click = () => {
      handleEvent(new Event("click"));
    };

    onUpdated(() => {
      handleEvent(new Event("updated"));
    });

    onUnmounted(() => {
      handleEvent(new Event("unmounted"));
    });

    const leftClick = () => {
      click();
      handleEvent(new Event("leftClick"));
    };

    const rightClick = () => {
      click();
      handleEvent(new Event("rightClick"));
    };

    return {
      handleEvent,
      component,
      leftClick,
      rightClick,
      classes: props.classes,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
  border-style: solid;
  border-radius: 3px;
  border-width: 1px;
  padding: 4px 12px 5px;
  transition: background 0.2s;
  max-height: 100%;

  .button {
    border: none;
    text-rendering: auto;
    color: initial;
    display: inline-block;
    text-align: start;
    margin: 0em;
    font-size: 16px;
    font-weight: 500;
    background: #fafcff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3px;
    height: 100%;
    background: none;
    width: 100%;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    cursor: pointer;
    background: #e5f3fff5;
  }
}
</style>
