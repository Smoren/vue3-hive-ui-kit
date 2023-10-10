import { Plugin, App } from 'vue';
import Notification from './hive-notification.vue';
import notify from './function';

// Mount the component method
const install = (app: App): App => {
  //@ts-ignore
  app.config.globalProperties.$notify = notify;
  app.component(Notification.name, Notification);
  return app;
};

export default install as Plugin;
