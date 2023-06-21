<script lang="ts" setup>
import { StyleValue } from 'vue';
import { CommonProps } from '@/common/mixin/props';

export interface HiveLoaderProps extends CommonProps {
  visible?: boolean;
  style?: StyleValue;
}

withDefaults(defineProps<HiveLoaderProps>(), {
  visible: false,
});
</script>

<template>
  <div v-if="visible" class="loader__window" :style="style">
    <div class="loader__wrapper">
      <div :class="{ loader: visible }">
        <span class="loader__size" />
        <span class="loader__size" />
        <span class="loader__size" />
        <span class="loader__size" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bg-color-spinner: #b0ddffe5;
$bg-color-window: rgba(38, 45, 52, 0.68);
$span-size: 15px;
$z-index: 1001;

.loader {
  &__window {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: $bg-color-window;
    z-index: $z-index;
    animation: view 1.0s infinite ease-in-out;
  }

  &__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: $z-index;
    height: $span-size * 5.5;
    width: $span-size * 5.5;

    .loader {
      margin-top: $span-size * 2.7;
      margin-left: $span-size * 2.7;
      width: $span-size * 3;
      height: $span-size * 5;
      transform: translate(-50%, -50%) rotate(45deg) translate3d(0, 0, 0);
      animation: loader 1.2s infinite ease-in-out;

      span {
        position: absolute;
        display: block;
        background-color: $bg-color-spinner;
        animation: loaderBlock 1.2s infinite ease-in-out both;

        &:nth-child(1) {
          top: 0;
          left: 0;
        }

        &:nth-child(2) {
          top: 0;
          right: 0;
          animation: loaderBlockInverse 1.2s infinite ease-in-out both;
        }

        &:nth-child(3) {
          bottom: 0;
          left: 0;
          animation: loaderBlockInverse 1.2s infinite ease-in-out both;
        }

        &:nth-child(4) {
          bottom: 0;
          right: 0;
        }
      }
    }
  }
}

@keyframes view {

  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }
  100% {
   opacity: 1;
  }
}

@keyframes loader {

  0%,
  10%,
  100% {
    width: $span-size * 2;
    height: $span-size * 2;
  }

  65% {
    width: $span-size * 3.75;
    height: $span-size * 3.75;
  }
}

@keyframes loaderBlock {

  0%,
  30% {
    transform: rotate(0);
  }

  55% {
    background-color: $bg-color-spinner;
  }

  100% {
    transform: rotate(90deg);
  }
}

@keyframes loaderBlockInverse {

  0%,
  20% {
    transform: rotate(0);
  }

  55% {
    background-color: $bg-color-spinner;
  }

  100% {
    transform: rotate(-90deg);
  }
}

.size {
  width: $span-size;
  height: $span-size;
}
</style>
