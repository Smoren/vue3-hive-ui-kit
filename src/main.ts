import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.scss';

// createApp(App).mount('#app');
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
