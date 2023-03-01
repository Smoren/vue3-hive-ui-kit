<template>
  <div v-bind="attrs" :class="classes" :style="style" class="ui form">
    <div :class="{ inline: inline, grouped: !inline }" class="fields">
      <label>{{ groupLabel }}</label>
      <div
        v-for="option in formattedOptions"
        :key="option.key"
        class="field"
        @click.prevent
        @mousedown="changeValue(option.value)"
      >
        <div
          :class="{ checked: option.value === currentValue }"
          class="ui radio checkbox"
          tabindex="1"
        >
          <input
            :id="`hive-radio-${option.value}`"
            :checked="option.value === currentValue"
            :name="groupName"
            class="hidden"
            tabindex="0"
            type="radio"
          />
          <label :for="`hive-radio-${option.value}`">
            {{ option.title }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useComponent from "@hive/common/hooks/base/use-component";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useRadioGroup, {
  type RadioGroupConfig,
} from "@hive/components/hive-radio-group/hooks/use-radio-group";
import useEventHandler from "@hive/common/hooks/base/use-event-handler";
import type { ValueType } from "@hive/common/types";
import type { OptionsType } from "@hive/components/hive-multiselect/hooks/use-hive-multiselect";

export default defineComponent({
  name: "HiveRadioGroup",
  props: {
    modelValue: {
      type: String,
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
      required: false,
    },
    inline: {
      type: Boolean,
      required: false,
      default: false,
    },
    groupLabel: {
      type: String,
      required: false,
      default: "Default label for radio group",
    },
    groupName: {
      type: String,
      required: false,
      default: "name",
    },
    options: {
      type: [Object, Array],
      required: true,
    },
    keyField: {
      type: String,
      required: false,
    },
    valueField: {
      type: String,
      required: false,
    },
    titleField: {
      type: String,
      required: false,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent();

    const { currentValue, currentOptions, formattedOptions } = useRadioGroup(
      props as RadioGroupConfig
    );

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    });

    const changeValue = (value: ValueType) => {
      let isAllowed = true;
      const prevent = () => {
        isAllowed = false;
      };
      handleEvent(new Event("onBeforeChange"), {
        value,
        prevent,
        isAllowed,
      });
      if (isAllowed && currentValue.value !== value) {
        currentValue.value = value;
        handleEvent(new Event(props.modelValueEventName));
      }
    };

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
      formattedOptions,
      changeValue,
      handleEvent,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@hive/assets/css/semantic.css";
</style>
