<template>
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <div
      v-show="visible"
      ref="root"
      class="notification"
      :style="styleObj"
      @mouseenter="clearTimer"
      @mouseleave="createTimer"
    >
      <span class="content">{{ content }}</span>
      <a class="btn" @click="handleClose">{{ btn }}</a>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, computed, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'Notification',
  props: {
    content: { type: String, required: true },
    duration: {
      type: Number,
      default: 3000,
    },
    btn: {
      type: String,
      default: 'off',
    },
    verticalOffset: {
      type: Number,
      default: 0,
    },
    // eslint-disable-next-line vue/require-default-prop
    onClosed: Function,
  },
  setup(props) {
    const root = ref(null!);
    const state = reactive({
      height: 0,
      visible: false,
    });
    const styleObj = computed(() => ({
      position: 'fixed',
      right: '20px',
      bottom: `${props.verticalOffset}px`,
    }));
    const timer = ref(0);

    const handleClose = (e: MouseEvent): void => {
      e.preventDefault();
      state.visible = false;
    };

    const afterLeave = () => {
      (props as any).onClosed(state.height);
    };

    const afterEnter = () => {
      state.height = (root as any).value.offsetHeight;
    };

    const createTimer = () => {
      if (props.duration) {
        timer.value = setTimeout(() => {
          state.visible = false;
        }, props.duration) as unknown as number;
      }
    };
    const clearTimer = () => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = 0;
      }
    };
    onMounted(() => {
      state.visible = true;
      createTimer();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    // toRefs changes data created by Reactive to reactive
    return { ...toRefs(state), root, styleObj, handleClose, afterLeave, afterEnter, clearTimer, createTimer };
  },
});
</script>

<style scoped>
.notification {
  display: inline-flex;
  background-color: #303030;
  color: rgba(255.255.255.1);
  align-items: center;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0px 3px 5px -1px rgba(0.2), 0px 6px 10px 0px rgba(0.14), 0px 1px 18px 0px rgba(0.12);
  flex-wrap: wrap;
  transition: all 0.3 s;
}
.content {
  padding: 0;
}
.btn {
  color: #ff4081;
  padding-left: 24px;
  margin-left: auto;
  cursor: pointer;
}
.fade-enter-active .fade-leave-active {
  transition: opacity 0.5 s;
}
.fade-enter .fade-leave-to {
  opacity: 0;
}
</style>
