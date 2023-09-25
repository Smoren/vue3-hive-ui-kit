<script lang="ts" setup>
import { Notification } from '@/components/hive-notification/hooks/use-hive-hotification';
import HiveNotification from '@/components/hive-notification/hive-notification.vue';

export interface Props {
  notifications: Notification[];
  removeNotifications: (id: string) => void;
}

const props = defineProps<Props>();
</script>

<template>
  <teleport to="body">
    <transition-group name="toast-notification" tag="div" class="toast-notifications">
      {{ notifications }}
      <!-- <hive-notification
        v-for="item in notifications"
        :key="item?.id"
        :id="item?.id"
        :type="item?.type"
        :title="item?.title"
        :message="item?.message"
        :auto-close="item?.autoClose"
        :duration="item?.duration"
        @close="removeNotifications(item?.id)"
      /> -->
      <!-- <div v-for="item in notifications">
        {{ item }}
      </div> -->
    </transition-group>
  </teleport>
</template>

<style lang="scss" scoped>
.toast-notifications {
  z-index: 10000;
  position: sticky;
  justify-content: center;
  align-items: center;
  bottom: 0.5rem;
  right: 50%;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.8rem;
}

.toast-notification-enter-active {
  animation: toast-fade-in 0.5s ease-in-out;
}
.toast-notification-leave-active {
  animation: toast-fade-in 0.5s ease-in-out reverse;
}

@keyframes toast-fade-in {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
