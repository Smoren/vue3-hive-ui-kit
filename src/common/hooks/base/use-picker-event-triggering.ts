/* eslint-disable */
import { onMounted, type Ref, watch } from "vue";
import type {
  ValueType,
  VueComponent,
} from "@hive/common/types";

interface PickerEventTriggeringConfig {
  pickerRef?: Ref<null | HTMLElement>;
  popupVisibilityProp?: Ref<boolean>;
  eventOnPopupClosing: boolean;
  currentValue: Ref<ValueType | ValueType[] | Array<ValueType[]>>;
  modelValueEventName: string;
  handleEvent: (event: Event) => void;
}

export type { PickerEventTriggeringConfig };

export default function usePickerEventTriggering({
  pickerRef,
  popupVisibilityProp,
  eventOnPopupClosing,
  currentValue,
  modelValueEventName,
  handleEvent,
}: PickerEventTriggeringConfig): void {
  onMounted(() => {
    let isCurrentValueChanged = false;

    const watchSource =
      typeof currentValue.value === "object" && currentValue.value !== null
        ? () => [
            (pickerRef?.value as VueComponent)?.isPopupVisible ??
              popupVisibilityProp?.value,
            ...(currentValue.value as Array<ValueType | ValueType[]>).flat(),
          ]
        : () => [
            (pickerRef?.value as VueComponent).isPopupVisible ??
              popupVisibilityProp?.value,
            currentValue.value,
          ];

    watch(
      watchSource,
      (
        [newIsPopupVisible, ...newCurrentValue],
        [prevIsPopupVisible, ...prevCurrentValue]
      ) => {
        const newValue = newCurrentValue.reduce(
          (prev, current) => prev + current,
          0
        );
        const prevValue = prevCurrentValue.reduce(
          (prev, current) => prev + current,
          0
        );
        if (eventOnPopupClosing) {
          if (newValue !== prevValue) {
            isCurrentValueChanged = true;
            return;
          }
          if (
            !newIsPopupVisible &&
            newIsPopupVisible !== prevIsPopupVisible &&
            isCurrentValueChanged
          ) {
            handleEvent(new Event(modelValueEventName));
            isCurrentValueChanged = false;
          }

          return;
        }

        if (newValue !== prevValue) {
          handleEvent(new Event(modelValueEventName));
        }
      }
    );
  });
}
