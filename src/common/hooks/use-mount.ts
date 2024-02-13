import { onMounted, onUnmounted } from 'vue';
import { Mount, Unmount, onMount, onUnmount, Event } from '../mixin/emits';

export const useOnMount = (emit: Mount & Unmount & Event) => {
  onMounted(() => {
    onMount(emit);
  });
  onUnmounted(() => {
    onUnmount(emit);
  });
};
