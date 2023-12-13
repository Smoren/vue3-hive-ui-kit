import { onMounted, onUnmounted } from 'vue';
import { Mount, Unmount, onMount, onUnmount } from '../mixin/emits';

export const useOnMount = (emit: Mount & Unmount) => {
  onMounted(() => {
    onMount(emit);
  });
  onUnmounted(() => {
    onUnmount(emit);
  });
};
