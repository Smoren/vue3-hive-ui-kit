<template>
  <div
    :id="id"
    class="picker"
    :class="[{ visible: isPopupVisible }, type]"
    tabindex="0"
    @focusout="hidePopup($event)"
  >
    <div class="ui input right icon" @mousedown="togglePopupVisibility">
      <input v-model="currentValue" readonly tabindex="1" type="text" />
      <i :class="iconClass" class="icon"></i>
    </div>
    <div
      :class="[{ visible: isPopupVisible }, popupType]"
      class="popup"
      tabindex="1"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useHivePicker from "@hive/components/hive-picker/hooks/use-hive-picker";

export default defineComponent({
  name: "HivePicker",
  props: {
    modelValue: {
      type: String,
    },
    modelValueEventName: {
      type: String,
      default: "input",
    },
    iconClass: {
      type: String,
      default: "caret down",
    },
    popupType: {
      type: String,
      default: "small",
    },
    type: {
      type: String,
      default: "",
    },
    ...commonProps,
  },
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

    const { isPopupVisible, togglePopupVisibility, hidePopup } = useHivePicker(
      props.id
    );

    watch(
      () => currentValue.value,
      (newValue) => context.emit("update:modelValue", newValue)
    );

    return {
      component,
      currentValue,
      handleEvent,
      isPopupVisible,
      togglePopupVisibility,
      hidePopup,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";
@import "@hive/assets/scss/abstracts/_variables";

.picker {
  position: relative;
  width: 100%;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: $border-radius;

  &.range {
    transition: 0.1s;
  }

  &:focus-within {
    border: 1px solid #85b7d9;
    border-radius: $border-radius $border-radius 0 0;
  }

  &:focus {
    outline: none;
    border-radius: $border-radius;
  }

  & .input {
    width: 100%;

    & > input {
      border: none;
      cursor: default;
    }
  }
}

.popup {
  position: absolute;
  z-index: 1;
  left: -1px;
  top: calc(100% - 2px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% + 2px);
  height: 0;
  background-color: #ffffff;
  overflow: hidden;
  transition: overflow 0.1s;

  &.big {
    width: auto;
  }

  &.visible {
    padding: 10px;
    height: fit-content;
    border: 1px solid #85b7d9;
    border-radius: 0 0 $border-radius $border-radius;
    overflow: visible;
    width: calc(100% + 2px);
    border-top: 0px;
  }

  &.big.visible {
    border: 1px solid #85b7d9;
  }
}
</style>
