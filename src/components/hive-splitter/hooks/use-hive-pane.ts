import { computed, type ComputedRef, inject, type Ref, ref } from 'vue';
import type { OnPaneAdd, Size, onPaneUpdate } from '@/components/hive-splitter/types';
import getFormattedSize from '@/components/hive-splitter/hooks/helpers/get-formatted-size';

interface PaneConfig {
  size: Size;
  minSize: Size;
  maxSize: Size;
}

interface PaneExport {
  onPaneUpdate: onPaneUpdate | undefined;
  onPaneAdd: OnPaneAdd | undefined;
  updatedStyle: Ref<Record<string, string>>;
  updateStyle: (newStyle: Record<string, string>) => void;
  formattedSize: ComputedRef<null | Size>;
  formattedMinSize: ComputedRef<null | Size>;
  formattedMaxSize: ComputedRef<null | Size>;
}

export default function useHivePane({ size, minSize, maxSize }: PaneConfig): PaneExport {
  const onPaneUpdate = inject<onPaneUpdate>('onPaneUpdate');
  const onPaneAdd = inject<OnPaneAdd>('onPaneAdd');

  const formattedSize = computed(() => getFormattedSize(size));
  const formattedMinSize = computed(() => getFormattedSize(minSize));
  const formattedMaxSize = computed(() => getFormattedSize(maxSize));

  const updatedStyle: Ref<Record<string, string>> = ref({});
  const updateStyle = (newStyle: Record<string, string>) => {
    updatedStyle.value = newStyle;
  };

  return {
    onPaneUpdate,
    onPaneAdd,
    updateStyle,
    updatedStyle,
    formattedSize,
    formattedMinSize,
    formattedMaxSize,
  };
}
