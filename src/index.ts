import HiveButton from './components/hive-button/hive-button.vue';
import HiveLoader from './components/hive-loader/hive-loader.vue'
import HiveTextarea from './components/hive-textarea/hive-textarea.vue';

export default {
  install: (app: any) => {
    app.component('HiveButton', HiveButton);
    app.component('HiveLoader', HiveLoader);
    app.component('HiveTextarea', HiveTextarea);
  },
};

