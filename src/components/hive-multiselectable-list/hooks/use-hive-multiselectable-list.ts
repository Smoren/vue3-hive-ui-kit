import { computed, type ComputedRef, onMounted, type Ref, ref, watch } from "vue";
import useDataContainer, {
  type DataContainer,
  type DataContainerNode,
} from "@hive/common/hooks/base/use-data-container";
import scrollIntoView from "@hive/components/hive-selectable-list/hooks/helpers";
import type { ValueType } from "../../common/types";
import sortArray from "./helpers";

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;

interface MultiselectableListConfig {
  currentValue: Ref<ValueType[]>;
  modelValueEventName: string;
  options: OptionsType;
  valueField?: string;
  titleField?: string;
  itemsInViewCount?: number;
  handleEvent: (event: Event, data?: any) => void;
}

interface MultiselectableListExport {
  activeValue: Ref<ValueType | null>;
  currentOptions: Ref<OptionsType>;
  formattedOptions: ComputedRef<DataContainer<OptionType>>;
  listRef: Ref<null>;
  onAppear: (option: DataContainerNode<OptionType>) => void;
  onDisappear: (option: DataContainerNode<OptionType>) => void;
  listHeight: ComputedRef<number>;
  updateCurrentValue: (value: ValueType, event?: Event) => void;
  inCurrentValue: (value: ValueType) => boolean;
  setPrevActiveValue: () => void;
  setNextActiveValue: () => void;
}

export type { MultiselectableListConfig, OptionsType };

export default function useHiveMultiselectableList({
  currentValue,
  modelValueEventName,
  options,
  valueField,
  titleField,
  itemsInViewCount,
  handleEvent,
}: MultiselectableListConfig): MultiselectableListExport {
  const currentValueSorted = ref(sortArray(currentValue.value));
  const activeValue = ref<ValueType | null>(currentValueSorted.value[0]);
  const currentOptions = ref(options);
  const formattedOptions = useDataContainer({
    valueField,
    titleField,
    data: currentOptions,
  });
  const listRef = ref(null);

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
    const itemsCount = Object.keys(formattedOptions.value).length;

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
    const valueIndexInCurrentValue = currentValue.value.findIndex(
      (item) => item === value
    );

    handleEvent(new Event("onBeforeChange"), {
      value,
      prevent,
    });

    if (isAllowed) {
      if (valueIndexInCurrentValue === -1) {
        currentValue.value.push(value);
      } else {
        currentValue.value.splice(valueIndexInCurrentValue, 1);
      }
      handleEvent(new Event(modelValueEventName));
    }

    activeValue.value = value;
  };

  const inCurrentValue = (value: ValueType) =>
    currentValue.value.findIndex((item) => item === value) !== -1;

  const updateActiveValue = (value: ValueType) => {
    activeValue.value = value;
  };

  const setActiveValueToFirst = () => {
    const opts = Object.values(formattedOptions.value);

    if (!opts.length) {
      activeValue.value = null;
    } else if (!formattedOptions.value[String(activeValue.value)]) {
      activeValue.value = opts[0].value as ValueType;
    }
  };

  const setPrevActiveValue = () => {
    let node = null;
    try {
      node = formattedOptions.value[String(activeValue.value)].prev;
    } catch (e) {
      setActiveValueToFirst();
      return;
    }

    if (node !== null) {
      updateActiveValue(node.value as ValueType);
    }
  };

  const setNextActiveValue = () => {
    let node = null;
    try {
      node = formattedOptions.value[String(activeValue.value)].next;
    } catch (e) {
      setActiveValueToFirst();
      return;
    }

    if (node !== null) {
      updateActiveValue(node.value as ValueType);
    }
  };

  watch(
    () => [...currentValue.value],
    (newValue) => {
      currentValueSorted.value = sortArray(newValue);
    }
  );

  watch(
    () => currentValueSorted.value[0],
    (newValue) => {
      activeValue.value = newValue;
      setTimeout(() => {
        scrollIntoView(listRef, newValue);
      }, 0);
    }
  );

  watch(
    () => activeValue.value,
    (newValue) => {
      if (newValue) {
        scrollIntoView(listRef, newValue);
      }
    }
  );

  onMounted(() => {
    scrollIntoView(listRef, currentValueSorted.value[0]);
  });

  return {
    activeValue,
    currentOptions,
    formattedOptions,
    listRef,
    onAppear,
    onDisappear,
    listHeight,
    updateCurrentValue,
    inCurrentValue,
    setPrevActiveValue,
    setNextActiveValue,
  };
}
