<template>
  <div class="ui checkbox">
    <input
      v-model="model"
      :value="modelValue"
      :id="`hive-checkbox-${name}`"
      :name="groupName"
      class="hidden"
      tabindex="0"
      type="checkbox"
      @change="handleEvent($event), $emit('change')"
    />
    <label :for="`hive-checkbox-${name}`" :class="{ minus: minusIcon }">
      {{ title }}
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useComponent from "@hive/common/hooks/base/use-component";

export default defineComponent({
  name: "HiveCheckbox",
  props: {
    modelValue: {
      type: Boolean,
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
    },
    groupName: {
      type: String,
      default: "name",
    },
    title: {
      type: String,
      default: "checkbox",
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "input",
    },
    minusIcon: {
      type: Boolean,
      default: true,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  emits: ["update:modelValue", "change", "event"],
  setup(props, context) {
    const { component, currentValue } = useComponent(props);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    const currentInputValue = ref(props.isChecked);

    const model = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        context.emit("update:modelValue", value);
      },
    });

    return {
      component,
      currentValue,
      handleEvent,
      currentInputValue,
      model,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";

.minus {
  color: rgba(0, 0, 0, 0.95) !important;
  &::after {
    content: "\e800";
  }
}
</style>
