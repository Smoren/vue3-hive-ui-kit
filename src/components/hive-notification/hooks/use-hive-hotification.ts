import { ref } from "vue";
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  autoClose: boolean;
  duration: number;
}

export type CreateNotification = {
  (options: { type?: string; title?: string; message?: string; autoClose?: boolean; duration?: number }): void;
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
    const _options = Object.assign({ ...defaultNotificationOptions }, options);

    notifications.value.push(
      ...[
        {
          id: uuidv4(),
          ..._options,
        },
      ]
    );
  };

  const removeNotifications = (id: string) => {
    const index = notifications.value.findIndex((item) => item.id === id);
    if (index !== -1) notifications.value.splice(index, 1);
  };

  const stopBodyOverflow = () => {
    document && document.body.classList.add(...['hide-overflow']);
  };

  const allowBodyOverflow = () => {
    document && document.body.classList.remove(...['hide-overflow']);
  };

  return {
    notifications,
    createNotification,
    removeNotifications,
    stopBodyOverflow,
    allowBodyOverflow,
  };
}
