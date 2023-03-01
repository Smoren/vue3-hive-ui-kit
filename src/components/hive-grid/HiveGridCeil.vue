<template>
  <td class="ceil" @click.left="toggleFlag" @keydown.enter="toggleFlag">
    <div @click.stop.prevent @click="setTrueFlag">
      <slot
        name="edit"
        v-if="flag && editable"
        :value="currentValue"
        :update="onInput"
        :isChangeAllowed="getIsChangeAllowed()"
        :toggle="toggleFlag"
        :customChange="customChange"
      >
      </slot>
      <slot name="view" :value="currentValue" :view="viewValue" v-else />
    </div>
  </td>
</template>

<script lang="ts">
import { computed, customRef, defineComponent, ref, watch } from 'vue';
import useComponent from '@hive/common/hooks/base/use-component';
import useEventHandler, { type EventConfig } from '@hive/common/hooks/base/use-event-handler';
import useOnMount from '@hive/common/hooks/base/use-on-mount';
import commonProps from '@hive/common/mixins/common-props';

export default defineComponent({
  name: 'HiveGridCeil',
  props: {
    name: String,
    object: Object,
    field: String,
    modelValueEventName: {
      type: String,
      default: 'change',
      required: false,
    },
    editable: {
      type: Boolean,
      default: true,
      required: false,
    },
    valueType: {
      type: String,
      default: 'string',
      required: false,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const flag = ref(false);

    const toggleFlag = () => {
      handleEvent(!flag.value ? new Event('onBeforeEdit') : new Event('onAfterEdit'));
      flag.value = !flag.value;
    };

    const setTrueFlag = () => {
      handleEvent(new Event('onBeforeEdit'));
      flag.value = true;
    };

    function useAllowedRef<T>(value: T) {
      return customRef((track, trigger) => {
        return {
          get() {
            track();
            return value;
          },
          set(newValue: T) {
            if (isChangeAllowed.value) {
              value = newValue;
            } else {
              value = props.object && props.field ? props.object[props.field] : '';
            }
            trigger();
          },
        };
      });
    }

    const currentValue = useAllowedRef(props.object && props.field ? props.object[props.field] : '');

    const viewValue = ref('');

    const onInput = (event?: Event) => {
      if (props.valueType === 'array') {
        currentValue.value = (event?.target as HTMLInputElement)?.value.split(',').filter((n: string) => n);
      } else {
        currentValue.value = (event?.target as HTMLInputElement)?.value;
      }
    };

    const customChange = (value: string, view = '') => {
      currentValue.value = value;
      viewValue.value = view;
    };

    const { component } = useComponent(props);
    const handleEvent = useEventHandler({
      props,
      context,
      component,
      modelValue: currentValue,
    } as EventConfig);

    const currentObject = computed(() => props.object);
    const isChangeAllowed = ref(true);

    const preventChange = () => {
      isChangeAllowed.value = false;
    };

    const getIsChangeAllowed = () => isChangeAllowed.value;

    watch(currentValue, (newValue) => {
      handleEvent(new Event('onBeforeChange'));
      if (props.object && props.field && isChangeAllowed.value) {
        // eslint-disable-next-line vue/no-mutating-props
        props.object[props.field] = newValue;
        handleEvent(new Event('onAfterChange'));
      }
    });

    watch(isChangeAllowed, (newValue) => {
      if (!newValue) {
        currentValue.value = props.object && props.field ? props.object[props.field] : '';
      }
    });

    watch(currentObject, () => {
      currentValue.value = props.object && props.field ? props.object[props.field] : '';
      handleEvent(new Event('onUpdated'));
    });

    const logEvent = (event: Event) => {
      console.log(event);
    };

    return {
      flag,
      toggleFlag,
      currentValue,
      current: currentObject,
      logEvent,
      handleEvent,
      component,
      preventChange,
      getIsChangeAllowed,
      onInput,
      customChange,
      setTrueFlag,
      viewValue,
    };
  },
});
</script>

<style lang="scss" scoped>
.ceil {
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: inherit;
  padding: 4px;

  &:first-child {
    border-left: 0;
  }
}
</style>
