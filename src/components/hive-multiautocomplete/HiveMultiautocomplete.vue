<template>
  <div
    class="ui multiple search dropdown hive-multiautocomplete"
    :tabindex="'1'"
    @focusout="hidePopup($event)"
    @keydown.tab="hidePopup($event)"
    @focusin="focusInput"
    @keydown.delete="removeFromCurrentValue(currentValue.length - 1)"
  >
    <a
      v-for="(value, index) in currentValue"
      :key="value"
      class="ui label visible hive-multiautocomplete__input-item"
      tabindex="1"
      @click="inputHandler(index)"
    >
      <template v-if="inputs[index]?.isShown">
        {{
          unfilteredOptions[value]?.title
            ? unfilteredOptions[value].title
            : value
        }}
      </template>
      <HiveInputText
        v-else
        :model-value="value"
        @focusin.stop
        @keydown.delete.stop
        @event="changeValue($event, index)"
        @keydown.enter.stop="closeInput(index)"
        @keydown.esc.stop="closeInput(index, value)"
        class="input"
      />
      <i
        class="delete icon"
        @mousedown.prevent="removeFromCurrentValue(index)"
        @click.stop
      />
    </a>
    <input
      :placeholder="placeholder"
      :type="deleteIconOnInput ? 'search' : ''"
      ref="searchRef"
      :value="searchQuery"
      @input="
        searchQuery = ($event.target as HTMLInputElement).value;
        onInput($event as InputEvent);
      "
      class="search"
      @keydown="onKeyDown"
      @keydown.up.prevent="setPrevActiveValue"
      @keydown.down.prevent="setNextActiveValue"
      @keydown.enter="
        searchQuery = ($event.target as HTMLInputElement).value;
        addToCurrentValue();
      "
      @keydown.tab="hidePopup($event)"
      @change="onInput($event as InputEvent)"
      autocapitalize="off"
      autocomplete="new-password"
      spellcheck="false"
      autocorrect="off"
      inputmode="search"
      aria-autocomplete="list"
      role="combobox"
    />
    <div
      v-if="currentValue.length"
      class="close-icon"
      @click.stop="clearCurrentValue()"
    >
      <img src="@hive/assets/icons/close-icon.svg" alt="" />
    </div>
    <div
      ref="menuRef"
      class="hive-multiautocomplete__popup"
      :class="[
        {
          visible: (showOnInput ? true : searchQuery.length) && isPopupVisible,
        },
      ]"
    >
      <template v-for="value in filteredOptions" :key="value.key">
        <div
          class="hive-multiautocomplete__popup-item"
          :data-value="value.value"
          :class="{ active: value.value === activeValue }"
          @click="addToCurrentValue(value.value)"
        >
          <slot name="before" :component="component" :value="value" />
          {{ value.title }}
          <slot name="after" />
        </div>
      </template>
      <div
        v-if="
          suggestUserInput &&
          searchQuery !== '' &&
          !filteredOptions[String(searchQuery)]
        "
        class="hive-multiautocomplete__popup-item"
        :data-value="searchQuery"
        :class="{ active: searchQuery === activeValue }"
        @click="addToCurrentValue(searchQuery)"
      >
        {{ searchQuery }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, watch } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventData,
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import type {
  OptionsType,
  OptionType,
} from "@hive/components/hive-multiautocomplete/hooks/use-hive-multiautocomplete";
import useHiveMultiautocomplete, {
  type MultiautocompleteConfig,
} from "@hive/components/hive-multiautocomplete/hooks/use-hive-multiautocomplete";
import HiveInputText from "@hive/components/hive-input-text/HiveInputText.vue";
import type { DataContainerNode } from "@hive/common/hooks/base/use-data-container";

export default defineComponent({
  name: "HiveMultiautocomplete",
  emits: ["update:modelValue", "event"],
  components: { HiveInputText },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
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
      default: () => [],
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
    showOnInput: {
      type: Boolean,
      default: false,
    },
    onlyDistinctValues: {
      type: Boolean,
      default: false,
    },
    suggestUserInput: {
      type: Boolean,
      default: true,
    },
    deleteIconOnInput: {
      type: Boolean,
      default: false,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent();
    const menuRef = ref(null);

    const currentValue = ref(props.modelValue as string[]);

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: currentValue,
      component,
      modelValueEventName: props.modelValueEventName,
    } as EventConfig);

    const {
      activeValue,
      currentOptions,
      filteredOptions,
      unfilteredOptions,
      searchQuery,
      isPopupVisible,
      hidePopup,
      searchRef,
      focusInput,
      addToCurrentValue,
      removeFromCurrentValue,
      setPrevActiveValue,
      setNextActiveValue,
      inputs,
      changeCurrentValue,
      isChangeAllowed,
      clearCurrentValue,
      addToCurrentValueWithoutEvents,
    } = useHiveMultiautocomplete({
      handleEvent,
      currentValue,
      ...props,
    } as MultiautocompleteConfig);

    watch(
      () => props.options as OptionsType,
      (newValue: OptionsType) => {
        currentOptions.value = newValue;
        //setNextActiveValue();
        handleEvent(new Event("onDataBound"));
      }
    );

    watch(
      () => [...currentValue.value],
      () => {
        handleEvent(new Event(props.modelValueEventName));
      }
    );

    watch(
      () => activeValue.value,
      (newValue) => {
        if (newValue === null) {
          return;
        }

        const activeOption = filteredOptions.value[newValue as string] as
          | DataContainerNode<OptionType>
          | undefined;

        if (
          activeOption === undefined ||
          (!activeOption.visible && isPopupVisible.value)
        ) {
          const el = (menuRef.value as unknown as HTMLElement).querySelector(
            `[data-value='${newValue}']`
          );
          if (el !== null) {
            (el as unknown as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          } else {
            //@ts-ignore
            const opts = Object.values(filteredOptions.value)!;
            setTimeout(() => (activeValue.value = opts[0].value as string));
          }
        }
      },
      { flush: "post" }
    );

    const changeValue = (event: EventData, index: number) => {
      if (!inputs[index]) {
        return;
      }
      if (event.type === "mount") {
        event.component.input?.focus();
      }
      if (
        (event.type == "change" || event.type === "focusout") &&
        !inputs[index].changed
      ) {
        changeCurrentValue(index, event.value as string);
        inputs[index].isShown = true;
        inputs[index].changed = true;
      }
    };

    const closeInput = (index: number, value = "") => {
      if (value !== "") {
        inputs[index].changed = true;
        changeCurrentValue(index, value);
      }
      inputs[index].isShown = true;
    };

    const inputHandler = (index: number) => {
      inputs[index].changed = false;
      inputs[index].isShown = false;
    };

    const onInput = (event: InputEvent) => {
      activeValue.value = null;
      handleEvent(event, searchQuery.value);
    };

    watch(
      () => props.modelValue.length,
      () => {
        const value = toRaw(props.modelValue);
        currentValue.value = [];
        value.forEach((val) => addToCurrentValueWithoutEvents(val));
      }
    );

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
      handleEvent,
      currentValue,
      activeValue,
      filteredOptions,
      unfilteredOptions,
      searchQuery,
      isPopupVisible,
      hidePopup,
      searchRef,
      focusInput,
      addToCurrentValue,
      removeFromCurrentValue,
      setPrevActiveValue,
      setNextActiveValue,
      menuRef,
      changeValue,
      inputs,
      inputHandler,
      closeInput,
      onInput,
      onKeyDown,
      clearCurrentValue,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@hive/assets/css/semantic.css";
@import "@hive/assets/scss/abstracts/_variables";

.hive-multiautocomplete {
  position: relative;
  padding-right: 20px !important;
  width: 100%;
  display: inline-flex !important;
  flex-wrap: wrap;
  min-width: 150px;

  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: $border-radius;

  &:focus-within {
    border: 1px solid #85b7d9;
    border-radius: $border-radius $border-radius 0 0;
  }

  &:focus {
    outline: none;
    border-radius: $border-radius;
  }

  & .search {
    width: 100%;
    flex-grow: 1000;
    min-width: 30px;
  }

  &__popup {
    position: absolute;
    top: 100%;
    z-index: 100;
    left: -1px;
    width: calc(100% + 2px);
    height: 0;
    background-color: #ffffff;
    overflow: hidden;

    &.visible {
      height: fit-content;
      border: 1px solid #85b7d9;
      border-top: none;
      border-radius: 0 0 $border-radius $border-radius;
      overflow-x: hidden;
      overflow-y: visible;
      max-height: 200px;
      z-index: 100;
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

.input {
  height: 25px;
  width: fit-content;
}

.close-icon {
  justify-self: right;
  position: absolute;
  right: 5px;
  top: 6px;

  &:hover {
    cursor: pointer;
  }
}
</style>
