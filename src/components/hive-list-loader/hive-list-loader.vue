<script setup lang="ts">
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount, Event } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

export interface Props extends CommonProps {
  visible?: boolean;
  colorMain?: string;
  colorSpinner?: string;
}

withDefaults(defineProps<Props>(), {
  visible: false,
  colorMain: '#b0ddff6c',
  colorSpinner: '#6bbfff',
});

type Emit = Event & Mount & Unmount;
const emit = defineEmits<Emit>();
useOnMount(emit);
</script>

<template>
  <div v-if="visible" class="loader-wrapper">
    <span class="loader"></span>
  </div>
</template>

<style scoped lang="scss">
$loader-spinner: v-bind(colorSpinner);
$loader-main: v-bind(colorMain);

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  background: $loader-main;
  box-shadow: -24px 0 $loader-main, 24px 0 $loader-main;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;

  &-wrapper {
    width: 100%;
  }
}

@keyframes shadowPulse {
  33% {
    background: $loader-main;
    box-shadow: -24px 0 $loader-spinner, 24px 0 $loader-main;
  }
  66% {
    background: $loader-spinner;
    box-shadow: -24px 0 $loader-main, 24px 0 $loader-main;
  }
  100% {
    background: $loader-main;
    box-shadow: -24px 0 $loader-main, 24px 0 $loader-spinner;
  }
}
</style>
