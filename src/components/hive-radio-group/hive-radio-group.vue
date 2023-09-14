<script setup lang="ts">
import { ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import { Mount, Unmount, Update, onUpdateModelValue } from '@/common/mixin/emits';
import { useOptions } from '@/common/hooks/use-options';
import { useOnMount } from '@/common/hooks/use-mount';
import { Options, Value } from '@/common/types/select';

export interface Props extends CommonProps {
  modelValue: Value;
  options: Options | undefined;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  name?: string;
  innerSize?: string;
  outerSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  name: 'radio-group',
  innerSize: '18px',
  outerSize: '16px',
});

type Emit = Mount & Unmount & Update<Value>;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue = ref(props.modelValue);

const { currentOptions } = useOptions({
  options: props.options,
  modelValue: props.modelValue,
  fieldTitle: props.titleField,
  fieldValue: props.valueField,
});

const changeValue = (value: Value) => {
  onUpdateModelValue<Value>(emit, value);
  currentValue.value = value;
};

watch(
  () => props.modelValue,
  () => {
    currentValue.value = props.modelValue;
  },
);

watch(
  () => props.options,
  () => {
    currentOptions.value = useOptions({
      options: props.options,
      modelValue: props.modelValue,
      fieldTitle: props.titleField,
      fieldValue: props.valueField,
    }).currentOptions.value;
  },
);
</script>

<template>
  <div>
    <div class="fields" :class="{ inline: inline }">
      <div
        v-for="(option, i) in currentOptions"
        :key="option[1][valueField]"
        class="field"
        @click.prevent="changeValue(option[1][valueField])"
      >
        <input
          :id="`hive-radio-${option[1][valueField]}`"
          :checked="option[1][valueField] === currentValue"
          :name="name"
          class="radio-input"
          tabindex="0"
          type="radio"
        />
        <label
          class="input-label"
          :for="`hive-radio-${option[1][valueField]}`"
          :class="{ checked: option[1][valueField] === currentValue }"
          style=""
        >
          {{ option[1][titleField] }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$transition-duration: 0.1s;
$transition-type: ease;
$transition: $transition-duration $transition-type;
$transitions: border $transition, opacity $transition, transform $transition, box-shadow $transition,
  -webkit-transform $transition, -webkit-box-shadow $transition;
$inner-size: v-bind(innerSize);
$outer-size: v-bind(outerSize);
$border-radius: 100%;
$top: calc(50% - ($outer-size/2));
$base-addition: 5px;
$padding-left: max(25px, $outer-size + $base-addition);
$gap: 15px;

.fields {
  width: fit-content;

  &.inline {
    display: flex;
    gap: $gap;
    flex-wrap: wrap;
  }

  .field {
    position: relative;
    padding-left: $padding-left;
    display: flex;
    align-items: center;
    min-height: $outer-size;
  }

  .radio-input {
    z-index: -1;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    outline: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
    display: none;
  }

  .input-label {
    &::after {
      position: absolute;
      width: $inner-size;
      height: $inner-size;
      text-align: center;
      transition: $transitions;
      border: none;
      content: '';
      top: $top;
      left: 0;
      border-radius: $border-radius;
      transform: scale(0.5);
    }

    &::before {
      position: absolute;
      transition: $transitions;
      border: 1px solid #d4d4d5;
      content: '';
      transform: none;
      width: $outer-size;
      height: $outer-size;
      border-radius: $border-radius;
      top: $top;
      left: 0;
    }

    &.checked {
      &::after {
        background-color: #000000f2;
        opacity: 1;
      }

      &::before {
        background: #ffffff;
        border-color: #22242659;
      }
    }
  }
}
</style>
