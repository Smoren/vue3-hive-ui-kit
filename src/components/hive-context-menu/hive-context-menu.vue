<script lang="ts" setup>
import { CommonProps } from '@/common/types/props';
import { ContextMenuItem, ContextMenuItems } from './types';
import HiveContextMenuItem from './hive-context-menu-item.vue';
import { getCurrentInstance, ref, onMounted, reactive, onUnmounted, watch } from 'vue';
import { Ref, RendererNode, nextTick } from 'vue';
import { useOnMount } from '@/common/hooks/use-mount';
import {
  Mount,
  Unmount,
  Click,
  CloseContextMenu,
  ContextItemClick,
  onClick,
  onCloseContextMenu,
} from '@/common/mixin/emits';
import { onContextItemClick } from '../../common/mixin/emits';
import { useIsOutOfBordersWidth, useIsOutOfBordersHeight } from './hooks/use-is-out-of-borders';

export interface Props extends CommonProps {
  items: ContextMenuItems | undefined;
  appendTo?: string | HTMLElement;
  left?: number;
  top?: number;
  showOnMount?: boolean;
  onLeftSide?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  appendTo: 'body ',
  left: 0,
  top: 0,
  showOnMount: false,
  onLeftSide: false,
});

type Emit = Mount & Unmount & Click & CloseContextMenu & ContextItemClick;
const emit = defineEmits<Emit>();
useOnMount(emit);

const instance = getCurrentInstance();

const parentNode: Ref<RendererNode | null | undefined> = ref(null);

const contextMenu = ref<HTMLElement | null>(null);

const show = ref(false);
const position = reactive({
  left: props.left,
  top: props.top,
});

const showContextMenu = async (e: PointerEvent) => {
  e.preventDefault();
  show.value = true;
  position.left = e.pageX;
  position.top = e.pageY;
  await nextTick();
  if (contextMenu.value && show.value) {
    useIsOutOfBordersHeight(contextMenu.value);
    if (useIsOutOfBordersWidth(contextMenu.value)) {
      outOfBorders.value = true;
      position.left = position.left - contextMenu.value.offsetWidth;
    }
    if (useIsOutOfBordersHeight(contextMenu.value)) {
      position.top = position.top - contextMenu.value.offsetHeight;
      outOfBorders.value = true;
    } else {
      outOfBorders.value = false;
    }
  }
};

const hideContextMenu = () => {
  show.value = false;
  onCloseContextMenu(emit);
};

const outOfBorders = ref(props.onLeftSide);

onMounted(() => {
  parentNode.value = instance?.parent?.vnode.el;
  if (props.showOnMount) {
    show.value = true;
  } else {
    parentNode.value?.addEventListener('contextmenu', showContextMenu);
  }
  window.addEventListener('click', hideContextMenu);
});

onUnmounted(() => {
  parentNode.value?.removeEventListener('contextmenu', showContextMenu);
  window.removeEventListener('click', hideContextMenu);
});

const handleClick = (event: MouseEvent) => {
  onClick(emit, event);
};

const handleContextItemClick = (item: ContextMenuItem) => {
  onContextItemClick(emit, item);
};

//TODO: fix children outOfBorder (maybe delete outOfBorder flag and change useOfBorders signutre)
</script>

<template>
  <div
    v-if="show"
    ref="contextMenu"
    @click.stop
    :class="{ 'sub-menu': showOnMount, 'context-menu': !showOnMount }"
    :style="{ left: position.left + 'px', top: position.top + 'px' }"
  >
    <hive-context-menu-item
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      @click="handleClick"
      @close-context-menu="hideContextMenu"
      @context-item-click="handleContextItemClick"
      :out-of-borders="outOfBorders"
    />
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  position: absolute;
  z-index: 1001;
  padding: 0.25rem 0;
  background: #ffffff;
  color: #4b5563;
  border: 0 none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  width: 12.5rem;
}

.sub-menu {
  position: absolute;
  z-index: 1;
  padding: 0.25rem 0;
  background: #ffffff;
  color: #4b5563;
  border: 0 none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  width: 12.5rem;
}
</style>
