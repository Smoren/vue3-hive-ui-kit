<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';
import { Update } from '@/common/mixin/emits';

export interface HiveDialogProps extends CommonProps {
  modelValue: boolean;
  top?: string;
  left?: string;
  maskBackground?: string;
}

withDefaults(defineProps<HiveDialogProps>(), {
  modelValue: false,
  maskBackground: '#262d34ad',
});

const emit = defineEmits<Update<boolean>>();

const handleHide = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <teleport to="body">
    <transition name="backdrop">
      <div v-if="modelValue" class="hive-dialog__fade">
        <div class="hive-dialog__mask" @click="handleHide" :style="{ background: maskBackground }" />

        <div v-if="modelValue" ref="content" class="hive-dialog" :style="{ top: top, left: left }">
          <button class="hive-dialog__btn-close" @click="handleHide">
            <img class="hive-dialog__btn-close-img" src="./icons/remove.svg" alt="Dialog close button" />
          </button>
          <slot name="header" />
          <slot />
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

$dialog-bg: #ffffff;
$dialog-trait: lightgrey;
$dialog-transition: 0.25s linear;
$dialog-padding-content: 15px;
$dialog-height-min: 50px;
$dialog-width-min: 100px;


.hive-dialog {
  position: fixed;
  padding: $dialog-padding-content;
  background-color: $dialog-bg;
  border-radius: $border-radius;
  min-width: $dialog-width-min;
  min-height: $dialog-height-min;
  max-width: fit-content;
  max-height: fit-content;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  top: calc(-50vh + 50%);
  bottom: calc(-50vh + 50%);
  margin: auto;

  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  &__btn-close {
    box-sizing: inherit;
    font: inherit;
    color: inherit;
    margin: 0;
    overflow: visible;
    text-transform: none;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    padding: 3px;
    border-radius: $border-radius;
    transition: background-color $dialog-transition;

    &-img {
      max-width: 25px;
      border: 0;
      border-style: none;
      box-sizing: inherit;
    }
  }
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.backdrop-enter-to,
.backdrop-leave-from {
  opacity: 1;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease-in;
}
.backdrop-enter-active .hive-dialog {
  animation: modal-door-enter 400ms both cubic-bezier(0.4, 0, 0, 1.5);
  transition-delay: 0.25s;
}
.backdrop-leave-active .hive-dialog {
  animation: modal-door-leave 400ms both ease-out;
}

@keyframes modal-door-enter {
  from {
    transform: scale3d(0, 1, 1);
  }
}

@keyframes modal-door-leave {
  60% {
    transform: scale3d(0.01, 1, 1);
  }
  to {
    transform: scale3d(0, 1, 0.1);
  }
}
</style>
