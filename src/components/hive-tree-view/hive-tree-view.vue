<script setup lang="ts">
import { computed, type Ref, ref, toRef, watch, onMounted, reactive } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { TreeView, TreeImg, ChoosenNode } from './hive-tree-view-type';
import { Unmount, Mount } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import {
  DragStart,
  DragEnd,
  onDragStart,
  onDragEnd,
  NodeChoose,
  onNodeChoose,
  NodeCheck,
  onNodeCheck,
  NodeMounted,
  onNodeMounted,
} from '@/common/mixin/emits';
import HiveTreeViewNode from '@/components/hive-tree-view/hive-tree-view-node.vue';
import { UpdateCheckedNodes, onUpdateCheckedNodes } from '../../common/mixin/emits';
import { useDebounce } from '../../common/hooks/use-debounce';

export type ICheckedNodes = {
  key: string;
  value: TreeView;
};

export interface Props extends CommonProps {
  nodes: TreeView[];
  show?: boolean;
  withCheckboxes?: boolean;
  checkedAll?: boolean;
  imgArray?: TreeImg[];
  allClosed?: boolean;
  checkedOption?: 'parent-checked' | 'parent-checked-minus' | 'parent-not-checked';
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  withCheckboxes: true,
  checkedAll: false,
  allClosed: false,
  checkedOption: 'parent-checked',
});

type Emit = Mount &
  Unmount &
  DragStart<TreeView> &
  DragEnd<TreeView> &
  NodeChoose<TreeView> &
  NodeCheck<TreeView> &
  NodeMounted<TreeView> &
  UpdateCheckedNodes<Map<number | string, TreeView>>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const options: TreeView[] = reactive([]);

const choosen: Record<'node', TreeView | null> = reactive({
  node: null,
});

const checkedNodes = reactive(new Map<number | string, TreeView>([]));

const openedNodes: Ref<Set<string | unknown>> = ref(new Set());

const updateOpened = ref(false);

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
        choosen.node = node as TreeView;
      }
      nd.push(node as TreeView);
      if (
        nodes[Number(item)] !== undefined &&
        nodes[Number(item)]?.children &&
        nodes[Number(item)]?.children?.length &&
        (nodes[Number(item)]?.children?.length ?? 0) > 0
      ) {
        toReactive(nd[nd.length - 1]?.children, nodes[Number(item)]?.children);
      }
    }
  }
};

watch(
  props.nodes,
  () => {
    options.length = 0;
    console.log(updateOpened.value);
    updateOpened.value = !updateOpened.value;
    console.log(updateOpened.value);
    toReactive();
  },
  { deep: true, immediate: true },
);

toReactive();

const allClosedRef = ref(props.allClosed);

const debouncedCheck = useDebounce(onUpdateCheckedNodes, 300);
const debouncedAllClosedChange = useDebounce(() => (allClosedRef.value = false), 300);

const nodeCheckPassHelper = (node: TreeView, value: boolean) => {
  if (node.checked) {
    checkedNodes.set(node.id ?? '', node);
  } else {
    checkedNodes.delete(node.id ?? '');
  }
  onNodeCheck<TreeView>(emit, node, value);
  debouncedCheck(emit, checkedNodes);
};

const nodeChoosePassHelper = (node: TreeView) => {
  onNodeChoose<TreeView>(emit, node);
};

const nodeMountPassHelper = (node: TreeView) => {
  if (props.checkedAll) {
    checkedNodes.set(node.id ?? '', node);
    debouncedCheck(emit, checkedNodes);
  }
  onNodeMounted<TreeView>(emit, node);
  debouncedAllClosedChange();
};

const nodeDragEndPassHelper = (node: TreeView) => {
  onDragEnd<TreeView>(emit, node);
};

const nodeDragStartPassHelper = (node: TreeView) => {
  onDragStart<TreeView>(emit, node);
};
</script>

<template>
  <ul class="tree" v-bind="attrs">
    <HiveTreeViewNode
      v-for="(node, index) in nodes"
      :node="node"
      :children="options[index]!"
      :choosen="choosen"
      :checked-all="checkedAll"
      :with-checkboxes="withCheckboxes"
      :imgArray="imgArray"
      :allClosed="allClosedRef"
      :checked-option="checkedOption"
      :opened-nodes="openedNodes"
      :update-opened="updateOpened"
      @node-check="nodeCheckPassHelper"
      @node-choose="nodeChoosePassHelper"
      @node-mounted="nodeMountPassHelper"
      @drag-end="nodeDragEndPassHelper"
      @drag-start="nodeDragStartPassHelper"
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
