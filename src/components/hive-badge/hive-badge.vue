<script setup lang="ts">
import { CommonProps } from '@/common/types/props';
import { computed } from 'vue';

type Counter = {
  count: number | string;
  mode: number;
};

export interface Props extends CommonProps {
  counter: Counter | number | string;
  mode?: number;
}
const props = defineProps<Props>();

const value = computed(() => {
  if (typeof props.counter === 'object') {
    return (props.counter as Counter).count;
  }
  return props.counter;
});

const isVisible = computed(() => {
  return !!value.value;
});

const isFlashing = computed(() => {
  const cond1 = typeof props.counter === 'object' && (props.counter as Counter).mode === 1;
  const cond2 = props.mode === 1;
  return cond1 || cond2;
});

</script>

<template>
  <div v-if="isVisible" class="badge" :class="{ pulse: isFlashing }">
    {{ value }}
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables.scss' as *;

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 3px;
  border: none;
  border-radius: 50%;
  color: $secondary;
  background-color: $accent-red;
  font-size: 16px;
  line-height: 1;
  z-index: 3;
  font-weight: 600;
}

.pulse {
  animation: pulse-note 2500ms linear infinite;
}

@keyframes pulse-note {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
