<script setup lang="ts">
import { CommonProps } from '@/common/types/props';
import { Mount, Unmount, Update, onUpdateModelValue, Event } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { mergeProps, nextTick, ref, watch } from 'vue';

export interface Props extends CommonProps {
  modelValue: boolean;
  maskBackground?: string;
  zIndex?: number;
  title?: string;
  withCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  maskBackground: '#39434ead',
  zIndex: 1000,
  withCloseButton: false,
});

type Emit = Event & Mount & Unmount & Update<boolean>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const handleHide = () => {
  onUpdateModelValue(emit, false);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    onUpdateModelValue(emit, false);
  }
};

const dialogRef = ref();

const focusDialog = () => {
  // dialogRef.value.focus();
};

watch(
  () => props.modelValue,
  () => {
    document.body.classList.toggle('no-overflow', props.modelValue);
    if (props.modelValue) {
      nextTick(() => {
        focusDialog();
      });
    }
  },
);
</script>

<template>
  <teleport to="body">
    <transition name="backdrop">
      <div v-if="modelValue" class="hive-dialog" ref="dialogRef" @keydown.esc="handleKeydown">
        <div
          class="hive-dialog__mask"
          :style="{ backgroundColor: maskBackground, zIndex: zIndex }"
          @click="handleHide"
        />
        <div
          class="hive-dialog__content"
          :style="{ zIndex: zIndex, ...style }"
          v-bind="$attrs"
          @keydown="handleKeydown"
        >
          <slot name="header">
            <div v-if="title !== undefined || withCloseButton" class="hive-dialog__title">
              <div v-if="title !== undefined" class="hive-dialog__title-text">{{ title }}</div>
              <font-awesome-icon
                v-if="withCloseButton"
                class="hive-dialog__title-close"
                icon="fa-solid fa-xmark"
                size="lg"
                @click="handleHide"
              />
            </div>
          </slot>
          <slot />
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$dialog-bg: var(--bg-input, $bg-input);
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
    display: flex;
    flex-direction: column;
    color: var(--text, $text);
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    gap: 5px;

    &-text {
      font-size: 20px;
    }

    &-close {
      cursor: pointer;
      color: var(--text, $text);
      opacity: 0.7;
    }
  }
}

.backdrop-enter-active {
  .hive-dialog {
    &__mask {
      animation: visible 0.4s ease-out;
    }
  }
}

.backdrop-leave-active {
  .hive-dialog {
    &__mask {
      opacity: 0;
    }
  }
}

@keyframes visible {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.backdrop-enter-active {
  transition: opacity 0.25s ease-in;
}
.backdrop-enter-active .hive-dialog__content {
  animation: modal-door-enter 400ms both cubic-bezier(0.4, 0, 0, 1.5);
  transition-delay: 0.25s;
}
// .backdrop-leave-active .hive-dialog__content {
//   animation: modal-door-leave 400ms both ease-out;
// }

@keyframes modal-door-enter {
  from {
    transform: scale3d(0, 1, 1);
  }
}

// @keyframes modal-door-leave {
//   60% {
//     transform: scale3d(0.01, 1, 1);
//   }
//   to {
//     transform: scale3d(0, 1, 0.1);
//   }
// }
</style>
