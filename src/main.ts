import { createApp } from 'vue';
import App from './App.vue';
import { IMaskDirective } from 'vue-imask';

const app = createApp(App);

app.directive('mask', IMaskDirective);

app.mount('#app');
