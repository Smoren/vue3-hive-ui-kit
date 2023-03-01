import {
  computed,
  type ComputedRef,
  onMounted,
  type Ref,
  ref,
  watch,
} from "vue";
import useDataContainer, {
  type DataContainer,
  type DataContainerNode,
} from "@hive/common/hooks/base/use-data-container";
import scrollIntoView from "@hive/components/hive-selectable-list/hooks/helpers";
import type { ValueType } from "../../common/types";

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;

interface SelectableListConfig {
  currentValue: Ref<ValueType>;
  modelValueEventName: string;
  options: OptionsType;
  valueField?: string;
  titleField?: string;
  itemsInViewCount?: number;
  handleEvent: (event: Event, data?: any) => void;
}

interface SelectableListExport {
  currentValue: Ref<ValueType>;
  currentOptions: Ref<OptionsType>;
  formattedOptions: ComputedRef<DataContainer<OptionType>>;
  listRef: Ref<Record<string, any>>;
  onAppear: (option: DataContainerNode<OptionType>) => void;
  onDisappear: (option: DataContainerNode<OptionType>) => void;
  listHeight: ComputedRef<number>;
  updateCurrentValue: (value: ValueType, event?: Event) => void;
}

export type { SelectableListConfig, OptionsType };

export default function useHiveSelectableList({
  currentValue,
  modelValueEventName,
  options,
  valueField,
  titleField,
  itemsInViewCount,
  handleEvent,
}: SelectableListConfig): SelectableListExport {
  let currentOptions: Ref<OptionType[] | Record<string, OptionType>>;
  if (Array.isArray(options)) {
    currentOptions = ref(Array.from(new Set(options)));
  } else {
    currentOptions = ref(options);
  }
  const formattedOptions = useDataContainer({
    valueField,
    titleField,
    data: currentOptions,
  });
  const listRef: Ref<Record<string, any>> = ref(
    null as unknown as Record<string, any>
  );

  const onAppear = (option: DataContainerNode<OptionType>) => {
    option.visible = true;
  };
  const onDisappear = (option: DataContainerNode<OptionType>) => {
    option.visible = false;
  };

  const listHeight = computed(() => {
    if (
      !listRef.value ||
      !(listRef.value as unknown as HTMLElement).querySelector(".item")
    ) {
      return 0;
    }

    const itemsCount = (
      listRef.value as unknown as HTMLElement
    ).querySelectorAll(".item")?.length;

    return (
      (listRef.value as unknown as HTMLElement).querySelector(".item")!
        .clientHeight * (itemsInViewCount ?? itemsCount)
    );
  });

  const updateCurrentValue = (value: ValueType) => {
    if (!value || !formattedOptions.value[String(value)]) {
      return;
    }

    let isAllowed = true;
    const prevent = () => {
      isAllowed = false;
    };

    handleEvent(new Event("onBeforeChange"), {
      prevent,
      isAllowed,
      value,
    });

    if (isAllowed && currentValue.value !== value) {
      currentValue.value = value;
      handleEvent(new Event(modelValueEventName));
    }
  };

  watch(
    () => currentValue.value,
    (newValue) => {
      const currentOption = formattedOptions.value[newValue as string];

      setTimeout(() => {
        if (!currentOption.visible) {
          scrollIntoView(listRef, newValue);
        }
      }, 0);
    }
  );

  onMounted(() => {
    scrollIntoView(listRef, currentValue.value);
  });

  return {
    currentValue,
    currentOptions,
    formattedOptions,
    listRef,
    onAppear,
    onDisappear,
    listHeight,
    updateCurrentValue,
  };
}
