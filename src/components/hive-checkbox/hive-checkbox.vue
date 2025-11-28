<script setup lang="ts">
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { CommonProps } from '@/common/types/props';
import {
  Mount,
  Unmount,
  Update,
  onUpdateModelValue,
  Change,
  onChange,
  Focusout,
  onFocusout,
  Focusin,
  onFocusin,
  Event,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { CurrentOptions, Value } from '@/common/types/select';

export interface Props extends CommonProps {
  option?: [string, CurrentOptions] | string | undefined;
  checked?: boolean;
  modelValue?: boolean;
  valueField?: string;
  minusIcon?: boolean;
  title?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  valueField: 'value',
  minusIcon: false,
  checked: false,
  disabled: false,
});

type Emit = Event & Mount & Unmount & Update<boolean> & Change<boolean> & Focusout & Focusin;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue = ref(props.modelValue ?? false);

if (props.checked) {
  currentValue.value = true;
}

watch(currentValue, (newValue) => {
  onUpdateModelValue(emit, newValue);
});

watch(
  () => props.modelValue,
  () => {
    currentValue.value = props.modelValue;
  },
);

let id: Value | Value[];
if (Array.isArray(props.option)) {
  id = props.option[1][props.valueField];
} else if (props.option) {
  id = props.option;
} else {
  id = uuidv4();
}
</script>

<template>
  <div class="hive-checkbox__item" @click.stop>
    <input
      v-model="currentValue"
      :checked="checked"
      :value="true"
      :id="`hive-checkbox-${id}`"
      class="hive-checkbox__input"
      tabindex="0"
      type="checkbox"
      :disabled="disabled"
      @change="onChange(emit, currentValue)"
      @focusout="onFocusout(emit)"
      @focusin="onFocusin(emit)"
    />
    <label :for="`hive-checkbox-${id}`" :class="{ minus: minusIcon }">
      {{ title ?? id }}
    </label>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables.scss' as *;

$gap: 15px;

.hive-checkbox {
  &__item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
        border-radius: $border-radius;
        margin-right: 0.5em;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 90%;
      }

      &.minus {
        &::before {
          background-image: var(--bg-checkbox-minus, $bg-checkbox-minus);

          background-size: 120%;
        }
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

    &:checked + label {
      &::before {
        border-color: var(--border, $border);
        background-image: var(--bg-checkbox, $bg-checkbox);
      }
    }

    &:disabled + label::before {
      background-color: var(--border-disabled, $border-disabled);
    }
  }
}
</style>
