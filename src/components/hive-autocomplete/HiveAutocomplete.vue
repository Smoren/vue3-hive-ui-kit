<template>
  <div
    class="hive-autocomplete"
    tabindex="0"
    @focusout="hidePopup($event)"
    @keydown.tab="hidePopup($event)"
    @focusin="focusInput"
  >
    <div class="ui input right icon">
      <input
        ref="searchRef"
        :value="searchQuery"
        @input="
          searchQuery = ($event.target as HTMLInputElement).value;
          onInput($event as InputEvent);
        "
        type="text"
        :placeholder="placeholder"
        @keydown="onKeyDown"
        @keydown.up.prevent="setPrevActiveValue"
        @keydown.down.prevent="setNextActiveValue"
        @keydown.enter="updateSearchQuery(activeValue)"
      />
      <i
        class="delete icon"
        v-show="(currentValue as string[])?.length"
        @click="clearSearchQuery"
      ></i>
    </div>
    <div
      ref="menuRef"
      class="hive-autocomplete__popup menu transition"
      :class="[{ visible: (currentValue as string[])?.length && isPopupVisible }]"
    >
      <template v-for="(value, _, index) in filteredOptions" :key="value.key">
        <div
          v-if="index < maxElements"
          :data-value="value.value"
          class="hive-autocomplete__popup-item"
          :class="{ active: value.value === activeValue }"
          @click="updateSearchQuery(value.value)"
        >
          {{ value.title }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useHiveAutocomplete, {
  type AutocompleteConfig,
} from "@hive/components/hive-autocomplete/hooks/use-hive-autocomplete";
import type { OptionsType } from "@hive/components/hive-drop-down-list/hooks/use-hive-drop-down-list";
import type { ValueType } from "@hive/common/types";

export default defineComponent({
  name: "HiveAutocomplete",
  emits: ["update:modelValue", "event"],
  props: {
    modelValue: {
      type: String,
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
    },
    eventOnFocusout: {
      type: Boolean,
      default: true,
    },
    options: {
      type: [Object, Array],
    },
    keyField: {
      type: [String],
    },
    valueField: {
      type: [String],
    },
    titleField: {
      type: [String],
    },
    placeholder: {
      type: String,
      default: "Select...",
    },
    minQueryLength: {
      type: Number,
      default: 0,
    },
    maxElements: {
      type: Number,
      default: Number.MAX_VALUE,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component, currentValue } = useComponent();
    const menuRef = ref(null);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    const {
      activeValue,
      searchRef,
      currentOptions,
      filteredOptions,
      searchQuery,
      clearSearchQuery,
      isPopupVisible,
      hidePopup,
      updateSearchQuery,
      setPrevActiveValue,
      setNextActiveValue,
      focusInput,
      isChangeAllowed,
    } = useHiveAutocomplete({
      currentValue,
      options: props.options,
      valueField: props.valueField,
      titleField: props.titleField,
      modelValueEventName: props.modelValueEventName,
      minQueryLength: props.minQueryLength,
      handleEvent,
    } as AutocompleteConfig);

    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        handleEvent(new Event("onDataBound"));
      }
    );

    watch(
      () => currentValue.value,
      () => {
        handleEvent(new Event(props.modelValueEventName));
      }
    );

    watch(
      () => activeValue.value,
      (newValue, prevValue) => {
        //@ts-ignore
        const activeOption = filteredOptions.value[newValue as string];
        if (!activeOption) {
          return;
        }

        if (!activeOption.visible && isPopupVisible.value) {
          const el = (menuRef.value as unknown as HTMLElement).querySelector(
            `[data-value='${newValue}']`
          );
          if (el !== null) {
            (el as unknown as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          } else {
            const opts = Object.values(filteredOptions.value);
            setTimeout(() => (activeValue.value = opts[0].value as ValueType));
          }
        }
      },
      { flush: "post" }
    );

    const onInput = (event: InputEvent) => {
      activeValue.value = null;
      handleEvent(event);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      isChangeAllowed.value = true;
      const prevent = () => {
        isChangeAllowed.value = false;
      };
      handleEvent(event, {
        isChangeAllowed,
        prevent,
      });
    };

    return {
      component,
      currentValue,
      handleEvent,
      activeValue,
      searchRef,
      filteredOptions,
      searchQuery,
      clearSearchQuery,
      isPopupVisible,
      hidePopup,
      updateSearchQuery,
      setPrevActiveValue,
      setNextActiveValue,
      focusInput,
      menuRef,
      onInput,
      onKeyDown,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@hive/assets/scss/abstracts/_variables";
@import "@hive/assets/css/semantic.css";

.hive-autocomplete {
  position: relative;
  width: 100%;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: $border-radius;
  max-height: 200px;

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
    }

    & .icon.delete {
      pointer-events: all !important;
      cursor: pointer;
    }
  }

  &__popup {
    position: absolute;
    z-index: 100;
    left: -1px;
    width: calc(100% + 2px);
    height: 0;
    background-color: #ffffff;
    overflow: hidden;
    max-height: 200px;
    transition: 1s;
    will-change: scroll-position;

    &.visible {
      height: fit-content;
      border: 1px solid #85b7d9;
      border-top: none;
      border-radius: 0 0 $border-radius $border-radius;
      overflow-x: hidden;
      overflow-y: visible;
      max-height: 200px;
    }

    &-item {
      padding: 10px;
      border-top: 1px solid #fafafa;
      cursor: pointer;
      background-color: #ffffff;
      transition: background-color $transition;

      &:hover,
      &.active {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
