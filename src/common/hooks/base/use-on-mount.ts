import type { VueComponent } from '@hive/common/types';

export default function useOnMount(component: VueComponent): void {
  component.component = component;
  component.handleEvent(new Event('mount'));
}
