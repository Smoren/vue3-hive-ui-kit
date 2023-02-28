<template>
  <transition name="modal">
    <div v-show="isShown" class="modal">
      <div
        class="modal__mask"
        @click="$emit('hide')"
        :style="{ background: maskBackground }"
      ></div>
      <transition name="modal__door">
        <div
          v-show="isShown"
          class="modal__content"
          :style="contentStyle"
          ref="modalRef"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HiveModal',
  props: {
    maskBackground: {
      type: String,
      default: '#262d34ad',
    },
    isShown: {
      type: Boolean,
    },
    contentWidth: {
      type: Number,
      default: 20,
    },
    contentHeight: {
      type: Number,
      default: 25,
    },
    measure: {
      type: String,
      default: '%',
    },
  },

  computed: {
    contentStyle() {
      return {
        width: this.contentWidth + this.measure,
        height: this.contentHeight + this.measure,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 1001;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 5px;
  }
}

.modal-enter-active {
  animation: modal-enter 300ms both ease-in;
}

.modal-leave-active {
  animation: modal-leave 300ms both;
}

.modal__door-leave-active {
  animation: modal-door-leave 300ms both ease-out;
}

.modal__door-enter-active {
  animation: modal-door-enter 300ms both cubic-bezier(0.4, 0, 0, 1.5);
}

@keyframes modal-enter {
  from {
    opacity: 0;
  }
}

@keyframes modal-leave {
  to {
    opacity: 0;
  }
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
