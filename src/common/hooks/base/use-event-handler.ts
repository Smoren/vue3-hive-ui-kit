import { isProxy, type Ref, toRaw, watch } from "vue";
import type {
  ValueType,
  VueComponent,
} from "@hive/common/types";

type EventHandler = (
  event: Event,
  data?: unknown | ValueType | DataPreventable | ValueType[]
) => void;

interface EventConfig {
  props: Record<string, unknown>;
  context: VueComponent;
  component: Ref<VueComponent>;
  modelValue?: Ref<ValueType | ValueType[]> | null;
  modelValueEventName?: string | number | null;
}

interface DataPreventable {
  prevent?: () => void;
  updateValue?: (value: ValueType) => void;
  value?: ValueType;
  pushing?: boolean;
}

interface DataEvent extends DataPreventable {
  event: Event;
}

interface EventData {
  type: string;
  event: Event;
  id: string;
  component: VueComponent;
  value: ValueType | ValueType[] | null;
  data: unknown | ValueType | DataPreventable | ValueType[] | DataEvent;
}

export type {
  EventHandler,
  EventConfig,
  EventData,
  DataPreventable,
  DataEvent,
};

export default function useEventHandler({
  props,
  context,
  component,
  modelValue = null,
  modelValueEventName = null,
}: EventConfig): EventHandler {
  if (props.modelValue !== undefined && modelValue !== null) {
    watch(
      () => props.modelValue,
      (newValue) => {
        modelValue.value = newValue as ValueType;
      }
    );
  }

  return (event: Event, data = null) => {
    const eventData: EventData = {
      type: event.type,
      event,
      id: props.id as string,
      component: component.value,
      value: modelValue?.value ?? null,
      data,
    };

    context.emit("event", eventData);

    if (modelValueEventName === event.type && modelValue !== null) {
      context.emit("update:modelValue", modelValue.value);
      context.emit("event", { ...eventData, type: "valueChange" });
    }
  };
}
