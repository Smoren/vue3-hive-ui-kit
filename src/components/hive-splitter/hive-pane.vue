<script setup lang="ts">
import { CommonProps } from '@/common/mixin/props';
import { onMounted, watch, ref, getCurrentInstance } from 'vue';
import useHivePane from '@/components/hive-splitter/hooks/use-hive-pane';
import { v4 as uuidv4 } from 'uuid';

export interface Props extends CommonProps {
  size: number | string | null;
  minSize: number | string;
  maxSize: number | string;
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: null,
  minSize: '0%',
  maxSize: '0%',
  id: uuidv4(),
});

const { onPaneUpdate, onPaneAdd, updateStyle, updatedStyle, formattedSize, formattedMinSize, formattedMaxSize } =
  useHivePane({
    size: props.size,
    minSize: props.minSize,
    maxSize: props.maxSize,
  });

console.log(updateStyle);

const pane = getCurrentInstance();

onMounted(() => {
  if (onPaneAdd && pane) {
    onPaneAdd(pane);
  }
});

watch(formattedSize, () => {
  if (onPaneUpdate && pane) {
    onPaneUpdate({ paneComponent: pane, size: formattedSize.value });
  }
});

watch(formattedMinSize, () => {
  if (onPaneUpdate && pane) {
    onPaneUpdate({ paneComponent: pane, min: formattedMinSize.value });
  }
});

watch(formattedMaxSize, () => {
  if (onPaneUpdate && pane) {
    onPaneUpdate({ paneComponent: pane, max: formattedMaxSize.value });
  }
});

defineExpose({ updateStyle });
</script>

<script lang="ts">
import { defineComponent } from 'vue';

defineComponent({
  mounted() {
    console.log(this);
  },
});
</script>

<template>
  <div class="hive-splitter__pane" :style="{ ...style, ...updatedStyle }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.hive-splitter__pane {
  overflow-y: auto;
  overflow-x: auto;
}
</style>
