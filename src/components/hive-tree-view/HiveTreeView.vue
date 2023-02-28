<template>
  <ul class="tree" v-bind="attrs">
    <HiveTreeViewNode
      @event="emitHelper"
      v-for="(node, index) in nodes"
      :node="node"
      :children="options[index]"
      :choosen="choosen"
    />
  </ul>
</template>

<script lang="ts">
import { defineComponent, type PropType, reactive, ref } from "vue";
import type { TreeView } from "./hive-tree-view-type";
import HiveTreeViewNode from "./HiveTreeViewNode.vue";
import useOnMount from "@/common/hooks/base/use-on-mount";
import useComponent from "@/common/hooks/base/use-component";
import useEventHandler, {
  EventData,
} from "@/common/hooks/base/use-event-handler";
import commonProps from "@/common/mixins/common-props";

export default defineComponent({
  name: "HiveTreeView",
  components: { HiveTreeViewNode },
  props: {
    nodes: Object as PropType<TreeView[]>,
    show: {
      type: Boolean,
      default: true,
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
    },
    choosen: {},
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const isShown = ref(props.show);

    const toggleIsShown = () => {
      isShown.value = !isShown.value;
    };

    const options: TreeView[] = reactive([]);

    const choosen = reactive({
      node: null,
    });

    const handleEvent = useEventHandler({
      props,
      context,
      component,
      modelValueEventName: props.modelValueEventName,
    });

    const toReactive = (node?: TreeView[], child?: TreeView[]) => {
      const nodes = child ?? props.nodes;
      const nd = node ?? options;
      for (let item in nodes) {
        if (
          nodes[Number(item)].children &&
          nodes[Number(item)].children.length > 0
        ) {
          nd.push({
            checked: false,
            ...nodes[Number(item)],
            choosen: false,
            children: [],
          });
          toReactive(nd[nd.length - 1].children, nodes[Number(item)].children);
        } else {
          nd.push({
            checked: false,
            ...nodes[Number(item)],
            choosen: false,
            children: [],
          });
        }
      }
    };

    toReactive();

    const emitHelper = (event: EventData) => {
      switch (event.type) {
        case "onCheck":
          handleEvent(new Event(event.type), {
            name: (event?.data as any).name,
            checked: (event?.data as any).checked,
          });
          break;
        case "onChoose":
          handleEvent(new Event(event.type), {
            name: (event?.data as any).name,
          });
          break;
      }
    };

    return {
      isShown,
      toggleIsShown,
      options,
      choosen,
      handleEvent,
      component,
      emitHelper,
    };
  },
});
</script>

<style lang="scss" scoped>
.tree {
  user-select: none;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  outline: 0;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
