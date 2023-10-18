import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.scss';
import Notification from '@/components/hive-notification';

const app = createApp(App);
const pinia = createPinia();

app.use(Notification);
app.use(pinia);
app.mount('#app');
