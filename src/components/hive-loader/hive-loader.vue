<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';

export interface Props extends CommonProps {
  visible?: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: false,
});
</script>

<template>
  <div v-if="visible" class="hive-loader__window" :style="style">
    <div class="hive-loader__wrapper">
      <div :class="{ loader: visible }">
        <span class="hive-loader__size" />
        <span class="hive-loader__size" />
        <span class="hive-loader__size" />
        <span class="hive-loader__size" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$loader-spinner: #b0ddffe5;
$loader-window: rgba(38, 45, 52, 0.68);
$loader-span-size: 15px;
$loader-z: 1001;

.hive-loader {
  &__window {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: var(--loader-window, $loader-window);
    z-index: var(--loader-z, $loader-z);
  }

  &__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: var(--loader-z, $loader-z);
    height: var(--loader-span-size, $loader-span-size * 5.5);
    width: var(--loader-span-size, $loader-span-size * 5.5);

    .loader {
      margin-top: var(--loader-span-size, $loader-span-size * 2.7);
      margin-left: var(--loader-span-size, $loader-span-size * 2.7);
      width: var(--loader-span-size, $loader-span-size * 3);
      height: var(--loader-span-size, $loader-span-size * 5);
      transform: translate(-50%, -50%) rotate(45deg) translate3d(0, 0, 0);
      animation: loader 1.2s infinite ease-in-out;

      span {
        position: absolute;
        display: block;
        background-color: var(--loader-spinner, $loader-spinner);
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

  &__size {
    width: var(--loader-span-size, $loader-span-size);
    height: var(--loader-span-size, $loader-span-size);
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
    width: var(--loader-span-size, $loader-span-size * 2);
    height: var(--loader-span-size, $loader-span-size * 2);
  }

  65% {
    width: var(--loader-span-size, $loader-span-size * 3.75);
    height: var(--loader-span-size, $loader-span-size * 3.75);
  }
}

@keyframes loaderBlock {
  0%,
  30% {
    transform: rotate(0);
  }

  55% {
    background-color: var(--loader-spinner, $loader-spinner);
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
    background-color: var(--loader-spinner, $loader-spinner);
  }

  100% {
    transform: rotate(-90deg);
  }
}
</style>
