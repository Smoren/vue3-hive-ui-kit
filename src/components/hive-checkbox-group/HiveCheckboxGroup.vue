<template>
  <div v-bind="attrs" :class="classes" :style="style" class="ui form">
    <div :class="{ inline: inline, grouped: !inline }" class="fields">
      <label>{{ groupLabel }}</label>
      <div
        v-for="option in formattedOptions"
        :key="option.key"
        :class="{ checked: false }"
        class="field"
      >
        <HiveCheckbox
          :name="(option?.value as string)"
          :gropName="groupName"
          :title="option.title"
          @change="changeCurrentValue(option.value)"
          @event="handleEvent($event.event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import commonProps from "@/components/ui/hive/common/mixins/common-props";
import useOnMount from "@/components/ui/hive/common/hooks/base/use-on-mount";
import useEventHandler, {
  type EventConfig,
} from "@/components/ui/hive/common/hooks/base/use-event-handler";
import useComponent from "@/components/ui/hive/common/hooks/base/use-component";
import useCheckboxGroup, {
  type CheckboxGroupConfig,
} from "@/components/ui/hive/hive-checkbox-group/hooks/use-checkbox-group";
import type { OptionsType } from "@/components/ui/hive/hive-multiselect/hooks/use-hive-multiselect";
import HiveCheckbox from "../hive-checkbox/HiveCheckbox.vue";

export default defineComponent({
  name: "HiveCheckboxGroup",
  emits: ["update:modelValue", "event"],
  props: {
    modelValue: {
      type: Array,
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
    },
    inline: {
      type: Boolean,
      default: false,
    },
    groupLabel: {
      type: String,
      default: "Default label for checkbox group",
    },
    groupName: {
      type: String,
      default: "name",
    },
    options: {
      type: [Object, Array],
      required: true,
    },
    keyField: {
      type: String,
    },
    valueField: {
      type: String,
    },
    titleField: {
      type: String,
    },
    ...commonProps,
  },
  components: { HiveCheckbox },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component, currentValue } = useComponent(props);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    const { currentOptions, formattedOptions, changeCurrentValue } =
      useCheckboxGroup({
        props,
        currentValue,
        handleEvent,
      } as CheckboxGroupConfig);

    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        handleEvent(new Event("onDataBound"));
      }
    );

    return {
      component,
      currentValue,
      handleEvent,
      currentOptions,
      formattedOptions,
      changeCurrentValue,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../assets/css/semantic.css";
</style>
