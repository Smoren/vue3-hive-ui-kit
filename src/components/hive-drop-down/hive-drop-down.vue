<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';
import { IMaskValue } from '@/common/types/mask';
import { useOnMount } from '@/common/hooks/use-mount';
import { focusout, keydown, focusin, mount, unmount, update } from '@/common/emits/emits';
import { onMounted, ref, watch } from 'vue';
import useHiveDropDownList, { DropDownListConfig } from '@/components/hive-drop-down/hooks/use-hive-drop-down-list';
import useHiveDropDownListMethods from '@/components/hive-drop-down/hooks/use-hive-drop-down-list-methods';
import useDropDownMethods from '@/common/hooks/use-drop-down-methods';
import hiveInput from '@/components/hive-input/hive-input.vue';
import HiveObservable from '@/components/hive-observable/hive-observable.vue';

type OptionType = string | number | Record<string, unknown>;
type OptionsType = Array<OptionType> | Record<string, OptionType>;

interface Props extends CommonProps {
  modelValue?: string;
  modelValueEventName?: string;
  options?: OptionsType;
  placeholder?: string;
  invalid?: boolean;
  type?: 'number' | 'text';
  integer?: boolean;
  mask?: IMaskValue;
  minValue?: number;
  keyField?: string;
  valueField?: string;
  titleField?: string;
  menuHeight?: string;
  withImg?: boolean;
  imgsArray?: string[] | Record<string, string>;
  empty?: boolean;
  withNull?: boolean;
  nullTitle?: string;
  disabled?: boolean;
  focusOnMount?: boolean;
  minQueryLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  modelValueEventName: 'input',
  options: () => [],
  type: 'text',
  placeholder: 'input',
  invalid: false,
  integer: false,
  nullTitle: 'Не выбрано',
  titleField: 'title',
});

type emitType = mount & unmount & update<string | number> & focusin & focusout & keydown;

const emit = defineEmits<emitType>();

useOnMount(emit);

const menuRef = ref(null);

const { currentValue, activeValue, currentOption, currentOptions, filteredOptions, searchQuery, valueChangedOnInit } =
  useHiveDropDownList(props as DropDownListConfig);

const {
  isExpanded,
  searchRef,
  expand,
  collapse,
  toggle,
  updateActiveValue,
  setActiveValueToFirst,
  setPrevActiveValue,
  setNextActiveValue,
  onAppear,
  onDisappear,
} = useDropDownMethods({
  searchQuery,
  currentValue,
  activeValue,
  filteredOptions,
});

const { updateCurrentValue } = useHiveDropDownListMethods({
  activeValue,
  currentValue,
  filteredOptions,
  collapse,
});

const onInputMount = () => {
  console.log();
};

watch(
  () => props.options as OptionsType,
  (newValue) => {
    if (Array.isArray(newValue)) {
      if (props.withNull) {
        newValue.unshift({
          [props.titleField]: props.nullTitle,
          [props.valueField ?? 'value']: null,
        });
      }
      currentOptions.value = newValue;
    } else {
      currentOptions.value = newValue;
    }
    // handleEvent(new Event('onDataBound'));
  },
);

watch(
  () => activeValue.value,
  (newValue) => {
    const activeOption = filteredOptions.value[newValue as string];
    if (!activeOption) {
      return;
    }

    if (!activeOption.visible && isExpanded.value) {
      const el = (menuRef.value as unknown as HTMLElement)?.querySelector(`[data-value='${newValue}']`);
      (el as unknown as HTMLElement)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  },
  { flush: 'post' },
);
// const currentClasses = useClasses({
//       classes: props.classes as ClassesType,
//       extraClasses: { 'active visible': isExpanded },
//     });

// watch(
//       () => searchQuery.value,
//       (newValue: string) => {
//         handleEvent(new Event('search'), { query: newValue });
//       },
//     );

// export default defineComponent({
//   name: 'HiveDropDownList',
//   components: { HiveObservable },
//   emits: ['update:modelValue', 'event', 'focusout'],
//   mounted() {
//     useOnMount(this);
//   },
//   setup(props, context) {
//     if (valueChangedOnInit) {
//       handleEvent(new Event(props.modelValueEventName));
//     }

//     const onInput = () => {
//       activeValue.value = null;
//       handleEvent(new Event('onInput'), searchQuery.value);
//     };

//     const forceFocus = () => {
//       if (searchRef.value) {
//         (searchRef.value as HTMLInputElement).focus();
//       }
//     };

//     const onFocusOut = () => {
//       context.emit('focusout');
//     };

//     onMounted(() => {
//       context.emit('update:modelValue', currentValue.value);
//       if (props.forceFocus) {
//         forceFocus();
//       }
//     });
//   },
// });
</script>

<template>
  <div
    v-bind="attrs"
    class="hive-drop-down-list"
    :class="{ 'active visible': isExpanded }"
    @focusin="expand()"
    @focusout="collapse()"
  >
    <i class="dropdown icon" @mousedown="toggle" />
    <hive-input
      @mount="onInputMount"
      @focusin="expand()"
      @focusout="collapse()"
      ref="searchRef"
      v-model="searchQuery"
      autocomplete="fomantic-search"
      class="search"
      placeholder=""
      tabindex="0"
      style="height: 100%"
      @keydown.enter="updateCurrentValue(activeValue)"
      @keydown.up.prevent="setPrevActiveValue"
      @keydown.down.prevent="setNextActiveValue"
      @keydown.esc="collapse"
      :disabled="disabled"
    />
    <div :class="{ filtered: searchQuery.length > 0 }" class="text">
      <div v-if="withImg && imgsArray" style="display: flex; align-items: center; gap: 5px">
        <!-- <img :src="imgsArray[currentOption?.title]" alt="" /> -->
        <div>
          {{ currentOption?.title }}
        </div>
      </div>
      <span v-else>
        {{ currentOption?.title }}
      </span>
    </div>
    <div
      ref="menuRef"
      :class="{ visible: isExpanded, hidden: !isExpanded }"
      :style="{
        height: menuHeight,
      }"
      class="menu transition"
    >
      <hive-observable
        v-for="(option, index) in filteredOptions"
        :key="option.key"
        :root="(menuRef as unknown as Record<string, any>)"
        :threshold="0.2"
        @appear="onAppear(option)"
        @disappear="onDisappear(option)"
      >
        <div
          :class="{
            selected: option.value === activeValue,
          }"
          :data-value="option.value"
          class="item"
          @click="updateCurrentValue(option.value)"
          @mouseover="updateActiveValue(option.value)"
          @mousedown.prevent
        >
          <div v-if="withImg && imgsArray" style="display: flex; align-items: center; gap: 5px">
            <!-- <img :src="imgsArray[index]" alt="" /> -->
            <div>
              {{ option?.title }}
            </div>
          </div>
          <span v-else>
            {{ option?.title }}
          </span>
        </div>
      </hive-observable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hive-drop-down-list {
  position: relative;
  cursor: pointer;
  word-wrap: break-word;
  line-height: 1em;
  white-space: normal;
  text-align: left;
  outline: 0;
  -webkit-transform: rotateZ(0deg);
  transform: rotateZ(0deg);
  background: #ffffff;
  display: inline-block;
  color: rgba(0, 0, 0, 0.87);
  -webkit-box-shadow: none;
  box-shadow: none;
  border: 1px solid rgba(34, 36, 38, 0.15);
  padding: 10px 15px;
  border-radius: 0.28571429rem;
  -webkit-transition: width 0.1s ease, -webkit-box-shadow 0.1s ease;
  transition: width 0.1s ease, -webkit-box-shadow 0.1s ease;
  transition: box-shadow 0.1s ease, width 0.1s ease;
  transition: box-shadow 0.1s ease, width 0.1s ease, -webkit-box-shadow 0.1s ease;

  input.search {
    background: none transparent;
    border: none;
    box-shadow: none;

    width: 100%;
    outline: none;

    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    padding: inherit;

    cursor: default;

    position: absolute;
    z-index: 2;
    top: 0;
    left: 1px;

    line-height: 22px;
    padding: 10px 15px;

    font: inherit;

    &:focus {
      cursor: text;
    }
  }

  .text {
    cursor: text;
    position: relative;
    left: 1px;
    z-index: auto;

    display: inline-block;
    transition: none;
  }

  .dropdown.icon {
    cursor: default;
    top: 30%;

    cursor: pointer;
    position: absolute;
    width: auto;
    height: auto;
    right: 10px;
    z-index: 3;
    opacity: 0.8;
    -webkit-transition: opacity 0.1s ease;
    transition: opacity 0.1s ease;
  }

  .menu {
    cursor: auto;
    position: absolute;
    display: none;
    outline: none;
    top: 95%;
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
    margin: 0;
    padding: 0 0;
    background: #ffffff;
    text-shadow: none;
    text-align: left;
    -webkit-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.28571429rem;
    -webkit-transition: opacity 0.1s ease;
    transition: opacity 0.1s ease;
    z-index: 11;
    will-change: transform, opacity;
    left: 0;

    overflow-x: hidden;
    overflow-y: auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-overflow-scrolling: touch;
    border-top-width: 0 !important;
    width: auto;
    outline: none;
    margin: 0 -1px;
    min-width: 100%;
    width: 100%;
    border-radius: 0 0 0.28571429rem 0.28571429rem;
    -webkit-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    -webkit-transition: opacity 0.1s ease;
    transition: opacity 0.1s ease;

    max-height: 250px;

    &:after {
      display: none;
    }

    &:before {
      display: none;
    }

    .item {
      border-top: 1px solid #fafafa;
      padding: 10px 15px !important;
      white-space: normal;
      word-wrap: normal;
    }

    .selected {
      background: rgba(0, 0, 0, 0.03);
      color: rgba(0, 0, 0, 0.95);
    }
  }

  &:hover {
    border-color: rgba(34, 36, 38, 0.35);
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  &:focus {
    border-color: #96c8da;
    -webkit-box-shadow: none;
    box-shadow: none;

    .menu {
      border-color: #96c8da;
      -webkit-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
      box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    }
  }

  &.active {
    z-index: 10;
    border-color: #96c8da;
    -webkit-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);

    .text {
      color: rgba(115, 115, 115, 0.87);

      &.filtered {
        color: transparent;
      }
    }

    .menu {
      border-color: #96c8da;
      -webkit-box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
      box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    }
  }
}

.active .visible {
  display: block;
}
</style>
