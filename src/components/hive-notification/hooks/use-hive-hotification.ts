import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import HiveNotificationWrapper from '@/components/hive-notification/hive-notification-wrapper.vue';
import { createVNode, render, h } from 'vue';

export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose: boolean;
  duration: number;
}

export type CreateNotification = {
  (options: {
    type?: NotificationType;
    title?: string;
    message?: string;
    autoClose?: boolean;
    duration?: number;
  }): void;
};

const defaultNotificationOptions = {
  type: 'info',
  title: 'Информация',
  message: 'No messages available',
  autoClose: true,
  duration: 5,
};

export default function useNotifications() {
  const notifications = ref<Notification[]>([]);

  const createNotification: CreateNotification = (options) => {
    console.log('here');
    const _options = Object.assign({ ...defaultNotificationOptions }, options);

    notifications.value.push(
      ...[
        {
          id: uuidv4(),
          ..._options,
        },
      ],
    );
    console.log('here', notifications.value);
  };

  const removeNotifications = (id: string) => {
    const index = notifications.value.findIndex((item) => item.id === id);
    if (index !== -1) notifications.value.splice(index, 1);
  };

  const container = document.createElement('div');

  let vnode = createVNode(HiveNotificationWrapper, {
    notifications,
    createNotification,
    removeNotifications,
  });

  // const vm = h(HiveNotificationWrapper, {
  //   notifications,
  //   createNotification,
  //   removeNotifications,
  // });

  render(vnode, container);

  console.log(vnode);

  return {
    notifications,
    createNotification,
    removeNotifications,
  };
}
