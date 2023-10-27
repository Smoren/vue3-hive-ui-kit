<script setup lang="ts">
import { computed, type Ref, ref, toRef, watch, onMounted } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { TreeView, TreeImg, TreeViewImg } from './hive-tree-view-type';
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
  ChildrenShow,
} from '@/common/mixin/emits';
import HiveCheckbox from '@/components/hive-checkbox/hive-checkbox.vue';
import HiveTreeViewNode from '@/components/hive-tree-view/hive-tree-view-node.vue';
import { onChildrenShow } from '../../common/mixin/emits';

export interface Props extends CommonProps {
  node: TreeView;
  show?: boolean;
  withCheckbox?: boolean;
  children: TreeView;
  choosen?: Record<'node', TreeView | null>;
  checkedAll?: boolean;
  imgArray?: TreeImg[];
  allClosed?: boolean;
  checkedOption?: 'parent-checked' | 'parent-checked-minus' | 'parent-not-checked';
  openedNodes: Set<string | unknown>;
  updateOpened: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  withCheckbox: true,
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
  ChildrenShow;
const emit = defineEmits<Emit>();
useOnMount(emit);

const slots = defineSlots<{
  main(props: {
    choose: () => void;
    img: string | TreeViewImg | undefined;
    defaultImage: string | undefined;
    node: TreeView;
  }): any;
  after(props: { node: TreeView }): any;
}>();

onMounted(() => {
  onNodeMounted<TreeView>(emit, props.node);
  if (!props.allClosed) {
    props.openedNodes.add(props.node.id);
  }
  if (props.openedNodes.has(props.node.id)) {
    isShown.value = true;
  } else {
    isShown.value = false;
  }
});

const isShown = ref(props.show);

if (props.allClosed) {
  isShown.value = false;
}

const newUpdateOpened = ref(false);

watch(
  () => props.updateOpened,
  () => {
    newUpdateOpened.value = !newUpdateOpened.value;
    if (props.openedNodes.has(props.node.id)) {
      isShown.value = true;
    } else {
      isShown.value = false;
    }
  },
);

const toggleIsShown = () => {
  isShown.value = !isShown.value;
  if (isShown.value) {
    props.openedNodes.add(props.node.id);
  } else {
    props.openedNodes.delete(props.node.id);
  }
};

const hasChildren = computed(() => props.node?.children && props.node?.children.length !== 0);

const options = computed(() => props.children);

const check: Ref<boolean | undefined> = toRef(props.children!, 'checked');

const dragStarted = ref(false);

watch(
  () => props.imgArray,
  () => {
    getImage();
  },
);

const image: Ref<string | undefined> = ref('');

const getImage = () => {
  if (props.imgArray && props.imgArray?.length !== 0) {
    for (let i = 0; i < props.imgArray?.length; i++) {
      // @ts-ignore
      if (props.node[props.imgArray[i].key] === props.imgArray[i].value && props.imgArray[i]?.img) {
        image.value = props.imgArray[i]?.img;
      }
    }
  }
};

watch(
  () => props.imgArray?.length,
  () => {
    getImage();
  },
);

const drag = (event: DragEvent) => {
  if (!dragStarted.value) {
    document.addEventListener('dragend', dragEnd);
    onDragStart<TreeView>(emit, props.node);
  }
  dragStarted.value = true;
};

const dragEnd = (event: MouseEvent) => {
  if (dragStarted.value) {
    dragStarted.value = false;
    document.removeEventListener('dragend', dragEnd);
    onDragEnd<TreeView>(emit, props.node);
  }
};

const choose = () => {
  if (options.value) {
    onNodeChoose<TreeView>(emit, options.value);
    options.value.choosen = !options.value.choosen;
  }
  if (props.choosen?.node && props.choosen?.node.name !== options.value?.name) {
    props.choosen.node.choosen = false;
  }
  if (options.value?.choosen) {
    props.choosen!.node = options.value;
  }
};

watch(check, () => {
  onNodeCheck<TreeView>(emit, props.children, check.value ?? false);
  let value = true;
  props.children?.children?.forEach((el) => {
    value = value && el.checked!;
  });
  if (check.value || value) {
    props.children?.children?.forEach((el) => {
      el.checked = check.value;
    });
  }
});

watch(
  () => props.children?.checked,
  () => {
    check.value = props.children?.checked;
  },
);

const minusIcon = ref(false);

watch(
  () => props.children?.children,
  () => {
    if (props.checkedOption === 'parent-checked' || props.checkedOption === 'parent-checked-minus') {
      let value = true;
      let oneChecked = false;
      props.children?.children?.forEach((el) => {
        if (el.checked) {
          oneChecked = true;
        }
        value = value && el.checked!;
      });
      if (props.children?.children?.length && props.children?.children.length > 0) {
        check.value = value;
      }
      if (props.checkedOption === 'parent-checked-minus' && oneChecked && !value) {
        minusIcon.value = true;
      } else if (props.checkedOption === 'parent-checked-minus' && !oneChecked && !value) {
        minusIcon.value = false;
      } else if (value) {
        minusIcon.value = false;
      }
    }
  },
  { deep: true },
);

const nodeCheckPassHelper = (node: TreeView, value: boolean) => {
  onNodeCheck<TreeView>(emit, node, value);
};

const nodeChoosePassHelper = (node: TreeView) => {
  onNodeChoose<TreeView>(emit, node);
};

const nodeMountPassHelper = (node: TreeView) => {
  onNodeMounted<TreeView>(emit, node);
};

const nodeDragEndPassHelper = (node: TreeView) => {
  onDragEnd<TreeView>(emit, node);
};

const nodeDragStartPassHelper = (node: TreeView) => {
  onDragStart<TreeView>(emit, node);
};

const childrenShowPassHelper = (id: string, show: boolean) => {
  onChildrenShow(emit, id, show);
};
</script>

<template>
  <li>
    <div
      class="name-wrapper"
      :class="{
        clickable: hasChildren,
        withOutChildren: !hasChildren,
        choosen: children?.hive_tree_node_id === choosen?.node?.hive_tree_node_id,
      }"
      draggable="true"
      @drag="drag"
    >
      <span v-if="hasChildren" class="collapse-item" @click="toggleIsShown" :class="{ rotated: isShown }">
        <img class="arrow" src="./assets/arrow_right_FILL0_wght400_GRAD0_opsz48.svg" />
      </span>

      <HiveCheckbox
        v-if="withCheckbox"
        :name="node?.name"
        title=""
        v-model="check"
        class="name-checkbox"
        :minus-icon="minusIcon"
      />

      <slot name="main" :choose="choose" :img="node?.img" :defaultImage="image" :node="node">
        <span class="name" @click="choose">
          <img
            v-if="node?.img"
            :src="typeof node?.img === 'string' ? node?.img : node?.img?.src"
            class="img"
            draggable="false"
          />
          <img v-if="image" :src="image" class="img" draggable="false" />

          <span>
            {{ node?.name }}
          </span>
        </span>
      </slot>

      <slot name="after" :node="node" />
    </div>
    <template v-if="hasChildren && options && options?.children">
      <div v-show="isShown">
        <ul>
          <HiveTreeViewNode
            v-for="(n, index) in node?.children"
            :key="n.id"
            :node="n"
            :children="options?.children[index]!"
            :opened-nodes="openedNodes"
            :choosen="choosen"
            :checked-all="checkedAll"
            :with-checkboxe="withCheckbox"
            :img-array="imgArray"
            :allClosed="allClosed"
            :update-opened="newUpdateOpened"
            @node-check="nodeCheckPassHelper"
            @node-choose="nodeChoosePassHelper"
            @node-mounted="nodeMountPassHelper"
            @drag-end="nodeDragEndPassHelper"
            @drag-start="nodeDragStartPassHelper"
            @children-show="childrenShowPassHelper"
          >
            <template #main="{ choose, node, defaultImage }">
              <slot
                name="main"
                :choose="choose"
                :img="node?.img"
                :defaultImage="defaultImage"
                :node="(node as TreeView)"
              />
            </template>
            <template #after="{ node }">
              <slot name="after" :node="(node as TreeView)" />
            </template>
          </HiveTreeViewNode>
        </ul>
      </div>
    </template>
  </li>
</template>

<style lang="scss" scoped>
ul {
  user-select: none;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  outline: 0;
}

li {
  list-style-type: none;
  padding-left: 16px;
}

.collapse-item {
  transition: all 0.2s;
  height: 20px;
  width: 20px;
}

.arrow {
  min-height: 20px;
  min-width: 20px;
}

.clickable {
  margin-left: -20px;
  display: flex;
  align-items: center;
}

.rotated {
  rotate: 90deg;
}

.active {
  rotate: 90deg;
}

.clickable {
  cursor: pointer;
}

.name {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  flex-grow: 100;
  cursor: pointer;
  .img {
    width: 30px;
    height: 30px;
  }
}

.name-wrapper {
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 5px 4px;
  border-radius: 2px;
  gap: 10px;
  width: 100%;
}

.name-checkbox {
  margin-top: 3px;
  max-width: 17px;
}

.choosen {
  background-color: #000f9938;
}

.withOutChildren {
  margin-left: 9px;
  width: calc(100% - 29px);
}
</style>
