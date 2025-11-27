import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './examples/App.vue';
import './style.scss';
import Notification from '@/plugins/hive-notification';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

/* add icons to the library */
library.add(faSearch, faXmark);

const app = createApp(App);
const pinia = createPinia();

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(Notification);
app.use(pinia);
app.mount('#app');
