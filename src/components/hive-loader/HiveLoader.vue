<template>
  <div class="loader-wrapper">
    <div class="loader" :is-visible="isVisible">
      <span class="size"></span>
      <span class="size"></span>
      <span class="size"></span>
      <span class="size"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import commonProps from "@hive/common/mixins/common-props";

export default defineComponent({
  name: "HiveLoader",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    ...commonProps,
  },
});
</script>

<style scoped lang="scss">
$span-size: 15px;

.loader-wrapper{
  height: $span-size*5.5;
  width: $span-size*5.5;
}

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
    background-color: #b0ddffe5;
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
    background-color: #b3cfe5;
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
    background-color: #b3cfe5;
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
