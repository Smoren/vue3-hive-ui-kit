<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';
import { Update, onUpdateModelValue } from '@/common/mixin/emits';

export interface Props extends CommonProps {
  modelValue: boolean;
  maskBackground?: string;
  zIndex?: number;
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  maskBackground: '#262d34ad',
  zIndex: 10000,
});

type Emit = Update<boolean>;

const emit = defineEmits<Emit>();

const handleHide = () => {
  onUpdateModelValue(emit, false);
};
</script>

<template>
  <teleport to="body">
    <transition name="backdrop">
      <div v-if="modelValue" class="hive-dialog">
        <div
          class="hive-dialog__mask"
          :style="{ backgroundColor: maskBackground, zIndex: zIndex }"
          @click="handleHide"
        />

        <div class="hive-dialog__content" :style="{ zIndex: zIndex }">
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
  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  &__content {
    position: fixed;
    padding: $dialog-padding-content;
    background-color: $dialog-bg;
    border-radius: $border-radius;
    min-width: $dialog-width-min;
    min-height: $dialog-height-min;
    width: fit-content;
    height: fit-content;
    max-width: 90vw;
    max-height: 80vh;
    left: calc(-50vw + 50%);
    right: calc(-50vw + 50%);
    top: calc(-50vh + 50%);
    bottom: calc(-50vh + 50%);
    margin: auto;
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
.backdrop-enter-active .hive-dialog__content {
  animation: modal-door-enter 400ms both cubic-bezier(0.4, 0, 0, 1.5);
  transition-delay: 0.25s;
}
.backdrop-leave-active .hive-dialog__content {
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
