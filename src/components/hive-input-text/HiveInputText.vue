<template>
  <div v-bind="attrs" :style="style" class="ui input" :class="{ error: isInvalid }">
    <input
      :value="currentValue"
      @keydown="onKeyDown"
      @input="
        currentValue = ($event.target as HTMLInputElement).value;
        handleEvent($event);
      "
      v-bind="attrs"
      :class="classes"
      :placeholder="placeholder"
      class="hive-input"
      type="text"
      @change="handleEvent"
      @focus="handleEvent"
      @focusout="handleEvent"
      v-maska="maska"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import commonProps from '@/components/ui/hive/common/mixins/common-props';
import useEventHandler from '@/components/ui/hive/common/hooks/base/use-event-handler';
import useComponent from '@/components/ui/hive/common/hooks/base/use-component';
import useOnMount from '@/components/ui/hive/common/hooks/base/use-on-mount';
import type { ValueType } from '@/components/ui/hive/common/types';
import useAllowedRef from '../common/hooks/base/use-allowed-ref';

export default defineComponent({
  name: 'HiveInputText',
  emits: ['update:modelValue', 'event'],
  props: {
    modelValue: {
      type: [String],
    },
    modelValueEventName: {
      type: String,
      default: 'input',
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    maska: {
      type: [Array, String],
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const isChangeAllowed = ref(true);

    const currentValue = useAllowedRef(props.modelValue, isChangeAllowed);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue as Ref<ValueType>,
      component,
      modelValueEventName: props.modelValueEventName,
    });

    interface Props {
      modelValue: string;
      modelValueEventName?: string;
      placeholder?: string;
      isInvalid?: boolean;
      maska: string;
    }

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

    return {
      component,
      currentValue,
      handleEvent,
      onKeyDown,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../assets/css/semantic.css';
</style>
