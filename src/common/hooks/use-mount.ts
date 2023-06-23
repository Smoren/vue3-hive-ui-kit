import { onMounted, onUnmounted } from 'vue';
import { Mount, Unmount } from '../mixin/emits';

export const useOnMount = (emit: Mount & Unmount) => {
  onMounted(() => {
    emit('mount');
  });
  onUnmounted(() => {
    emit('unmount');
  });
};
