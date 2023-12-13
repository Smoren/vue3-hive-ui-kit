<script setup lang="ts">
import { onMounted, provide } from 'vue';
import useHiveSplitter from '@/components/hive-splitter/hooks/use-hive-splitter';
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

interface Props extends CommonProps {
  horizontal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: false,
});

type Emit = Mount & Unmount;
const emit = defineEmits<Emit>();
useOnMount(emit);

const { isReady, onPaneAdd, onPaneUpdate, splitterRef, resetPaneSizes, redoSplitters, checkSplitterNodes, touch } =
  useHiveSplitter(props.horizontal);

onMounted(() => {
  checkSplitterNodes();
  redoSplitters();
  resetPaneSizes();
  isReady.value = true;
});

provide('onPaneAdd', onPaneAdd);
provide('onPaneUpdate', onPaneUpdate);
</script>

<template>
  <div
    ref="splitterRef"
    class="hive-splitter default-theme"
    :class="[
      { 'hive-splitter--dragging': touch.isDragging },
      `hive-splitter--${horizontal ? 'horizontal' : 'vertical'}`,
    ]"
    :style="style"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.hive-splitter {
  display: flex;
  width: 100%;
  height: 100%;

  &--vertical {
    flex-direction: row;
  }

  &--horizontal {
    flex-direction: column;
  }

  &--dragging * {
    user-select: none;
  }

  &__pane {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .hive-splitter--vertical & {
      //transition: width 0.2s ease-out;
    }

    .hive-splitter--horizontal & {
      //transition: height 0.2s ease-out;
    }

    .hive-splitter--dragging & {
      transition: none;
    }
  }

  &__splitter {
    touch-action: none;
  }

  &--vertical > .hive-splitter__splitter {
    min-width: 1px;
    cursor: col-resize;
  }

  &--horizontal > .hive-splitter__splitter {
    min-height: 1px;
    cursor: row-resize;
  }
}

.hive-splitter.default-theme {
  .hive-splitter__pane {
    background-color: #f2f2f2;
  }

  .hive-splitter__splitter {
    background-color: #fff;
    position: relative;
    flex-shrink: 0;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: rgba(0, 0, 0, 0.15);
      transition: background-color 0.3s;
    }

    &:hover:before,
    &:hover:after {
      background-color: rgba(0, 0, 0, 0.25);
    }

    &:first-child {
      cursor: auto;
    }
  }
}
.default-theme {
  &.hive-splitter .hive-splitter .hive-splitter__splitter {
    z-index: 1;
  }

  &.hive-splitter--vertical > .hive-splitter__splitter,
  .hive-splitter--vertical > .hive-splitter__splitter {
    width: 7px;
    border-left: 1px solid #eee;
    margin-left: -1px;

    &:before,
    &:after {
      transform: translateY(-50%);
      width: 1px;
      height: 30px;
    }

    &:before {
      margin-left: -2px;
    }

    &:after {
      margin-left: 1px;
    }
  }

  &.hive-splitter--horizontal > .hive-splitter__splitter,
  .hive-splitter--horizontal > .hive-splitter__splitter {
    height: 7px;
    border-top: 1px solid #eee;
    margin-top: -1px;

    &:before,
    &:after {
      transform: translateX(-50%);
      width: 30px;
      height: 1px;
    }

    &:before {
      margin-top: -2px;
    }

    &:after {
      margin-top: 1px;
    }
  }
}
</style>
