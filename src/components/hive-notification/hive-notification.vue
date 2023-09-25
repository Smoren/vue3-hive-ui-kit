<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Mount, Unmount, Close, onClose } from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';

export interface Props extends CommonProps {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title?: string | null;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: null,
  message: 'Без текста',
  autoClose: false,
  duration: 5,
});

type Emit = Mount & Unmount & Close;
const emit = defineEmits<Emit>();
useOnMount(emit);

const timer = ref(-1);
const startedAt = ref<number>(0);
const delay = ref<number>(0);

onMounted(() => {
  if (props.autoClose) {
    startedAt.value = Date.now();
    delay.value = props.duration * 1000;
    timer.value = window.setTimeout(() => {
      onClose(emit);
    }, delay.value);
  }
});

const toastIcon = computed(() => {
  switch (props.type) {
    case 'error':
      return 'ri-emotion-unhappy-line';
    case 'warning':
      return 'ri-error-warning-line';
    case 'success':
      return 'ri-emotion-happy-line';
    default:
      return 'ri-information-line';
  }
});

const toastColor = computed(() => {
  switch (props.type) {
    case 'error':
      return '#ff355b';
    case 'warning':
      return '#e8b910';
    case 'success':
      return '#00cc69';
    default:
      return '#0067ff';
  }
});

const toastTitle = computed(() => (props.title && props.title !== null ? props.title : 'Notification'));
</script>

<template>
  <div
    class="toast-notification"
    :style="`--toast-duration: ${duration}s; --toast-color: ${toastColor}`"
    @click.prevent="onClose(emit)"
    :ref="id"
  >
    <div @click="onClose(emit)" class="close-btn" title="Close">
      <i class="ri-icon ri-lg ri-close-fill"></i>
    </div>

    <div class="body">
      <i :class="`ri-icon ri-2x ${toastIcon}`"></i>
      <div class="vl"></div>
      <div class="content">
        <div class="content__title">{{ toastTitle }}</div>

        <p v-if="message && message != ''" class="content__message">{{ message }}</p>
      </div>
    </div>
    <div v-if="autoClose" class="progress" />
  </div>
</template>

<style lang="scss" scoped>
.toast-notification {
  --toast-color: #0067ff;
  cursor: pointer;
  max-width: 450px;
  position: relative;
  background: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.08), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  min-height: 4rem;
  padding-inline: 1.5rem;
  padding-block: 1.2rem;
  transition: all 0.3s ease-in-out;

  .close-btn {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    display: flex;
    place-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    transition: var(--all-transition);
    cursor: pointer;

    &:hover {
      box-shadow: 0px 0px 10px rgb(228, 228, 228);
      border-radius: 50%;
    }
  }

  .body {
    display: flex;
    gap: 1.4rem;
    place-items: center;

    i {
      color: var(--toast-color);
    }

    .vl {
      background: #e4e4e4;
      width: 0.12rem;
      height: 3rem;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;

      &__title {
        font-weight: 600;
      }
    }
  }

  .progress {
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 0.4rem;
    width: 100%;
    background: var(--toast-color);
    animation: progress var(--toast-duration) ease-in-out forwards;
  }

  @keyframes progress {
    to {
      width: 0;
    }
  }

  @keyframes toast-fade-in {
    to {
      opacity: 1;
    }
  }

  @keyframes toast-fade-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
}
</style>
