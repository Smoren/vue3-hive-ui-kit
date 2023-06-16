import { onMounted, onUnmounted } from 'vue';
import { mount, unmount } from '../emits/emits';

export const useOnMount = (emit: mount & unmount) => {
  onMounted(() => {
    emit('mount');
  });
  onUnmounted(() => {
    emit('unmount');
  });
};
