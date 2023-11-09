<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';
import { ContextMenuSeparator, ContextMenuItem } from './types';
import { computed, ref, onMounted, getCurrentInstance, reactive, watch } from 'vue';
import { useIsSeparator } from './hooks/use-is-separator';
import { useIsItem } from './hooks/use-is-item';
import hiveContextMenu from './hive-context-menu.vue';
import { Click, Mount, Unmount } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import {
  CloseContextMenu,
  onCloseContextMenu,
  onContextItemClick,
  ContextItemClick,
  onClick,
} from '../../common/mixin/emits';

export interface Props extends CommonProps {
  item: ContextMenuSeparator | ContextMenuItem;
  outOfBorders?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  outOfBorders: false,
});

type Emit = Mount & Unmount & Click & CloseContextMenu & ContextItemClick;
const emit = defineEmits<Emit>();
useOnMount(emit);

const isSeparator = computed(() => useIsSeparator(props.item));
const isItem = computed(() => useIsItem(props.item));

const showChildren = ref(false);

const instance = getCurrentInstance();

const position = reactive({
  left: 0,
  top: 0,
});

const setPosition = () => {
  const element = instance?.vnode?.el;
  if (props.outOfBorders) {
    position.left = -instance?.vnode?.el?.clientWidth;
  } else {
    position.left = element?.clientWidth;
  }
  position.top = 0;
};

onMounted(() => {
  setPosition();
});

watch(
  () => props.outOfBorders,
  () => {
    setPosition();
  },
);

const handleClick = (event: MouseEvent) => {
  if (isItem.value) {
    if ((props.item as ContextMenuItem).function) {
      (props.item as ContextMenuItem).function!();
    }
    if ((props.item as ContextMenuItem).closeOnClick) {
      onCloseContextMenu(emit);
    }
    onContextItemClick(emit, props.item as ContextMenuItem);
    onClick(emit, event);
  }
};
</script>

<template>
  <div v-if="isSeparator" class="separator"></div>
  <div
    v-else-if="isItem"
    class="item"
    @mouseover="showChildren = true"
    @mouseleave="showChildren = true"
    @click="handleClick"
    :class="{'has-children': (item as ContextMenuItem).items !== undefined}"
  >
    <div>
      {{ (item as ContextMenuItem).label }}
    </div>
    <hive-context-menu
      v-if="(item as ContextMenuItem).items !== undefined && showChildren"
      :items="(item as ContextMenuItem).items"
      :left="position.left"
      :top="position.top"
      @click="onClick(emit, $event)"
      @close-context-menu="onCloseContextMenu(emit)"
      @context-item-click="onContextItemClick(emit, $event)"
      :on-left-side="outOfBorders"
      show-on-mount
    />
  </div>
</template>

<style lang="scss" scoped>
.separator {
  border-top: 1px solid #e5e7eb;
  margin: 0.25rem 0;
}

.item {
  padding: 0.5rem 1rem;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;

  &:hover {
    background-color: #f3f4f6;
  }
}

.has-children {
  overflow: inherit;
}
</style>
