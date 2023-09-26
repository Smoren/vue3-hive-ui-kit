<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { CommonProps } from '@/common/mixin/props';
import {
  Mount,
  Unmount,
  Update,
  onUpdateModelValue,
  Focusout,
  onFocusout,
  Focusin,
  onFocusin,
} from '@/common/mixin/emits';
import { useOptions } from '@/common/hooks/use-options';
import { useOnMount } from '@/common/hooks/use-mount';
import { Options, Value } from '@/common/types/select';

export interface Props extends CommonProps {
  options: Options | undefined;
  modelValue: Value;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  name: 'radio-group',
});

type Emit = Mount & Unmount & Update<Value> & Focusout & Focusin;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue: Ref<Value> = ref(props.modelValue);

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
  <div
    class="hive-radio__container"
    :class="{ inline: inline }"
    @focusout="onFocusout(emit)"
    @focusin="onFocusin(emit)"
  >
    <div
      v-for="option in currentOptions"
      :key="option[1][valueField]"
      class="hive-radio__item"
      @click.prevent="changeValue(option[1][valueField])"
    >
      <input
        class="hive-radio__input"
        type="radio"
        :id="`hive-radio-${option[1][valueField]}`"
        :checked="option[1][valueField] === currentValue"
        :name="name"
        tabindex="0"
      />
      <label :for="`hive-radio-${option[1][valueField]}`">
        {{ option[1][titleField] }}
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$gap: 15px;

.hive-radio {
  &__container {
    width: fit-content;

    &.inline {
      display: flex;
      gap: $gap;
      flex-wrap: wrap;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    position: relative;
  }

  &__input {
    position: absolute;
    z-index: -1;
    opacity: 0;

    + label {
      display: inline-flex;
      align-items: center;
      user-select: none;
      cursor: pointer;

      &::before {
        content: '';
        display: inline-block;
        width: 1em;
        height: 1em;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid var(--border, $border);
        border-radius: 50%;
        margin-right: 0.5em;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 50% 50%;
      }
    }

    &:not(:disabled) {
      &:not(:checked) + label:hover::before {
        border-color: var(--border, $border);
      }

      &:active + label::before {
        border-color: var(--border, $border);
      }
    }

    &:focus {
      + label::before {
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      &:not(:checked) + label::before {
        border-color: var(--border-focus, $border-focus);
      }
    }

    &:checked + label::before {
      border-color: var(--border, $border);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='fff'/%3e%3c/svg%3e");
    }
  }
}
</style>
