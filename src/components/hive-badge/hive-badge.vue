<script setup lang="ts">
import { CommonProps } from '@/common/types/props';

type Counter = {
  count: number;
  mode: number;
};

export interface Props extends CommonProps {
  counter: Counter | number;
}
const props = defineProps<Props>();

const isNum = typeof props.counter === 'number';
const countObj = props.counter as Counter;
</script>

<template>
  <div v-if="isNum && counter" class="badge">
    {{ counter }}
  </div>
  <div v-else-if="countObj.count" class="badge" :class="{ pulse: countObj.mode === 1 }">
    {{ countObj.count }}
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

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
