<template>
  <div v-bind="attrs" :class="classes" :style="style" class="ui form">
    <div class="field">
      <label :for="id">{{ label }}</label>
      <textarea
        :id="id"
        :value="(currentValue as string)"
        @keydown="onKeyDown"
        @input="(currentValue = ($event.target as HTMLInputElement).value), handleEvent($event)"
        :rows="rowsCount"
        :placeholder="placeholder"
        @change="handleEvent"
        @focus="handleEvent"
        @focusout="handleEvent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import useComponent from '@/components/ui/hive/common/hooks/base/use-component';
import useEventHandler from '@/components/ui/hive/common/hooks/base/use-event-handler';
import useOnMount from '@/components/ui/hive/common/hooks/base/use-on-mount';
import commonProps from '@/components/ui/hive/common/mixins/common-props';
import { defineComponent, ref } from 'vue';
import useAllowedRef from '../common/hooks/base/use-allowed-ref';

export default defineComponent({
  name: 'HiveTextarea',
  props: {
    modelValue: {
      type: String,
    },
    modelValueEventName: {
      type: String,
      default: 'onAfterChange',
    },
    label: {
      type: String,
      default: '',
    },
    rowsCount: {
      type: Number,
    },
    placeholder: {
      type: String,
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
      modelValue: currentValue,
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

<style scoped lang="scss">
@import '../assets/css/semantic.css';
</style>
