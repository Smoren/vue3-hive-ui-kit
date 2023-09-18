import { type ComputedRef, type Ref, ref } from 'vue';
import useDataContainer, { type DataContainer } from '@/ui-kit/src/common/hooks/base/use-data-container';
import type { ValueType } from '@/ui-kit/src/common/types';
import type { EventHandler } from '@/ui-kit/src/common/hooks/base/use-event-handler';

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;
type CurrentValueType = Ref<ValueType>;

interface CheckboxGroupProps {
  options: OptionsType;
  modelValueEventName: string;
  keyField?: string;
  valueField?: string;
  titleField?: string;
}

interface CheckboxGroupConfig {
  props: CheckboxGroupProps;
  currentValue: Ref<ValueType[]>;
  handleEvent: EventHandler;
}

interface CheckboxGroupExport {
  currentOptions: Ref<OptionsType>;
  formattedOptions: ComputedRef<DataContainer<OptionType>>;
  changeCurrentValue: (value: ValueType) => void;
}

export type { OptionType, OptionsType, CurrentValueType, CheckboxGroupProps, CheckboxGroupConfig, CheckboxGroupExport };

export default function useCheckboxGroup({
  props,
  currentValue,
  handleEvent,
}: CheckboxGroupConfig): CheckboxGroupExport {
  const currentOptions = ref(props.options);
  const formattedOptions: ComputedRef<DataContainer<OptionType>> = useDataContainer({
    valueField: props.valueField,
    titleField: props.titleField,
    data: currentOptions,
  });

  if (currentValue.value === null) {
    currentValue.value = [];
  }

  const changeCurrentValue = (value: ValueType) => {
    const valueIndex = currentValue?.value?.findIndex((item) => item === value);

    if (valueIndex === -1) {
      currentValue.value.push(value);
    } else {
      currentValue.value.splice(valueIndex, 1);
    }

    handleEvent(new Event(props.modelValueEventName));
  };

  for (let i = 0; i < currentValue.value.length; i += 1) {
    // const valueIndex = currentValue?.value?.findIndex((item) => item === currentValue.value[i]);

    const val = formattedOptions.value[currentValue.value[i] as string];

    if (val) {
      // currentValue.value.push(currentValue.value[i]);
    }
  }

  return {
    currentOptions,
    formattedOptions,
    changeCurrentValue,
  };
}
