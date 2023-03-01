import { ref, type Ref } from 'vue';
import type { ValueType, VueComponent } from '@hive/common/types';

interface Refs {
  component: Ref<VueComponent | null>;
  currentValue: Ref<ValueType | ValueType[] | null>;
}

export type { Refs };

export default function useComponent(props?: Record<string, unknown>): Refs {
  const component = ref(null);
  const currentValue = ref(props ? (props.modelValue as ValueType) : null);

  return {
    component,
    currentValue,
  };
}
