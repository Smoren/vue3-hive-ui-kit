<script setup lang="ts">
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount, Event } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

export interface Props extends CommonProps {
  visible?: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: false,
});

type Emit = Event & Mount & Unmount;
const emit = defineEmits<Emit>();
useOnMount(emit);
</script>

<template>
  <div v-if="visible" class="loader-wrapper">
    <div class="skeleton skeleton-button"></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

.skeleton-button {
  width: 100%;
  height: 36px;
  border-radius: var(--border-radius, $border-radius);
}
</style>
  