import type { VueComponent } from '@/common/types';

export default function useOnMount(component: VueComponent): void {
  component.component = component;
  component.handleEvent(new Event('mount'));
}
