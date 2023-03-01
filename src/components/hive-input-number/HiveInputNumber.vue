<template>
  <div v-bind="attrs" :class="{ ...classes, error: isInvalid }" :style="style" class="ui input">
    <input
      :value="currentValue"
      @keydown="onKeyDown"
      @input="
        currentValue = Number(($event.target as HTMLInputElement).value);
        handleEvent($event);
      "
      v-bind="attrs"
      :class="classes"
      :placeholder="placeholder"
      :style="style"
      class="hive-input"
      type="number"
      @focusout="handleEvent"
      @change="handleEvent"
      @focus="handleEvent"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import useEventHandler from '@hive/common/hooks/base/use-event-handler';
import useComponent from '@hive/common/hooks/base/use-component';
import type { ValueType } from '@hive/common/types';
import useAllowedRef from '@hive/common/hooks/base/use-allowed-ref';

interface ICommonProps {
  id?: string;
  attrs?: unknown;
  classes?: unknown[];
  style?: unknown[];
}

interface IProps extends ICommonProps {
  modelValue?: number;
  modelValueEventName?: string;
  placeholder?: string;
  isInvalid?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValueEventName: 'onAfterChange',
});

const { component } = useComponent(props);

const isChangeAllowed = ref(true);

const currentValue = useAllowedRef(props.modelValue, isChangeAllowed);

const emit = defineEmits(['update:modelValue', 'event']);

const handleEvent = useEventHandler({
  props,
  context: { emit },
  modelValue: currentValue as Ref<ValueType>,
  component,
  modelValueEventName: props.modelValueEventName,
});

const onKeyDown = (event: Event) => {
  isChangeAllowed.value = true;
  const prevent = () => {
    isChangeAllowed.value = false;
  };
  handleEvent(event, {
    prevent,
    isChangeAllowed,
    value: currentValue,
  });
};
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';
.c {
  color: red;
}
</style>
