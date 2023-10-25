<template>
  <ul class="tree" v-bind="attrs">
    <HiveTreeViewNode
      @event="emitHelper"
      v-for="(node, index) in nodes"
      :node="node"
      :children="options[index]"
      :choosen="choosen"
      :checked-all="checkedAll"
      :with-checkboxes="withCheckboxes"
      :imgArray="imgArray"
      :allClosed="allClosed"
    >
      <template #main="{ choose, node, defaultImage }">
        <slot name="main" :choose="choose" :img="node?.img" :defaultImage="defaultImage" :node="node" />
      </template>
      <template #after="{ node }">
        <slot name="after" :node="node" />
      </template>
    </HiveTreeViewNode>
  </ul>
</template>

<script lang="ts">
import { defineComponent, type PropType, reactive, ref, watch } from 'vue';
import type { ChoosenNode, TreeImg, TreeView } from './hive-tree-view-type';
import HiveTreeViewNode from './HiveTreeViewNode.vue';
import useOnMount from '@/ui-kit/src/common/hooks/base/use-on-mount';
import useComponent from '@/ui-kit/src/common/hooks/base/use-component';
import useEventHandler, { EventData } from '@/ui-kit/src/common/hooks/base/use-event-handler';
import commonProps from '@/ui-kit/src/common/mixins/common-props';
import { ICheckedNodes } from '@/types/tree-checked-nodes';
import { isTreeTheSame } from './is-tree-the-same';

export default defineComponent({
  name: 'HiveTreeView',
  components: { HiveTreeViewNode },
  props: {
    nodes: Object as PropType<TreeView[]>,
    show: {
      type: Boolean,
      default: true,
    },
    modelValueEventName: {
      type: String,
      default: 'onAfterChange',
    },
    withCheckboxes: {
      type: Boolean,
      default: true,
    },
    choosen: {},
    checkedAll: {
      type: Boolean,
      default: false,
    },
    allClosed: {
      type: Boolean,
      default: false,
    },
    imgArray: {
      type: Object as PropType<TreeImg[]>,
      required: false,
    },
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

    watch(
      () => props.nodes,
      (newValue, oldValue) => {
        if (newValue && oldValue && !isTreeTheSame(newValue, oldValue)) {
          options.length = 0;
          toReactive();
        }
      }
    );

    const options: TreeView[] = reactive([]);

    const choosen: ChoosenNode = reactive({
      node: null,
    });

    const checkedNodes = reactive(new Map<number | string, ICheckedNodes[]>([]));

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
        if (nodes[Number(item)]?.name) {
          const node = {
            hive_tree_node_id: Symbol(nodes[Number(item)]?.name),
            checked: props.checkedAll,
            ...nodes[Number(item)],
            choosen: choosen.node && nodes[Number(item)]?.id ? nodes[Number(item)]?.id === choosen.node?.id : false,
            children: [],
          };
          if (choosen.node && nodes[Number(item)]?.id === choosen.node?.id) {
            choosen.node = node;
          }
          nd.push(node);
          if (
            nodes[Number(item)] !== undefined &&
            nodes[Number(item)]?.children &&
            nodes[Number(item)]?.children.length > 0
          ) {
            toReactive(nd[nd.length - 1].children, nodes[Number(item)].children);
          }
        }
      }
    };

    toReactive();

    const emitHelper = (event: EventData) => {
      switch (event.type) {
        case 'onCheck':
          handleEvent(new Event(event.type), {
            ...(event.data as object),
          });
          if ((event?.data as any).checked) {
            checkedNodes.set((event?.data as any).id, { ...(event.data as any) });
          } else {
            checkedNodes.delete((event?.data as any).id);
          }
          context.emit('updateCheckedNodes', checkedNodes);
          break;
        case 'onChoose':
          handleEvent(new Event(event.type), {
            name: (event?.data as any).name,
            subdivision_id: (event?.data as any).subdivision_id,
            classifier_id: (event?.data as any).classifier_id,
            id: (event?.data as any).id,
          });
          break;
        case 'onMount':
          if (props.checkedAll) {
            checkedNodes.set((event.data as any)?.id, { ...(event.data as any) });
            context.emit('updateCheckedNodes', checkedNodes);
          }
          break;
        case 'onDragStart':
          handleEvent(new Event(event.type), {
            ...(event.data as any),
          });
        case 'onDragEnd':
          handleEvent(new Event(event.type), {
            ...(event.data as any),
          });
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
      checkedNodes,
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
