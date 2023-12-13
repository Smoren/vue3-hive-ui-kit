<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount, Update } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import useHiveTab from './hooks/use-hive-tab';
import { v4 as uuidv4 } from 'uuid';

export interface Props extends CommonProps {
  name: string;
  isDisabled?: boolean;
  renderOnce?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  id: uuidv4(),
});

type Emit = Mount & Unmount & Update<string>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const { isActive } = useHiveTab(props);

const isRendered = ref(props.renderOnce !== props.name);

watch(isActive, () => {
  if (isActive) {
    isRendered.value = true;
  }
});
</script>

<template>
  <section
    v-show="isActive"
    v-if="isRendered"
    :id="id"
    ref="tab"
    v-bind="attrs"
    :aria-hidden="!isActive"
    :class="{ activeTab: isActive }"
    :style="style"
    role="tabpanel"
    class="tab"
  >
    <slot />
  </section>
</template>

<style scoped lang="scss">
.tab {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
