<script setup lang="ts">
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { CommonProps } from '@/common/mixin/props';
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
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { CurrentOptions, Value } from '@/common/types/select';

export interface Props extends CommonProps {
  option: [string, CurrentOptions] | string | undefined;
  checked?: boolean;
  modelValue?: boolean;
  titleField?: string;
  valueField?: string;
  minusIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  titleField: 'title',
  valueField: 'value',
  minusIcon: false,
  checked: false,
});

type Emit = Mount & Unmount & Update<boolean> & Change<boolean> & Focusout & Focusin;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue = ref(props.modelValue ?? false);

if (props.checked) {
  currentValue.value = true;
}

watch(currentValue, (newValue) => {
  onUpdateModelValue(emit, newValue);
});

let id: Value | Value[];
if (Array.isArray(props.option)) {
  id = props.option[1][props.valueField]
} else {
  props.option ? id = props.option : uuidv4();
}
</script>

<template>
  <div class="hive-checkbox__item" v-if="option">
    <input
      v-model="currentValue"
      :checked="checked"
      :value="true"
      :id="`hive-checkbox-${id}`"
      class="hive-checkbox__input"
      tabindex="0"
      type="checkbox"
      @change="onChange(emit, currentValue)"
      @focusout="onFocusout(emit)"
      @focusin="onFocusin(emit)"
    />
    <label :for="`hive-checkbox-${id}`" :class="{ minus: minusIcon }">
      {{ id }}
    </label>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.scss';

$background-img: url('./assets/check-mark.svg');
$background-img-minus: url('./assets/minus-icon.svg');

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
        background-image: $background-img;
      }

      &.minus {
        &::before {
          background-image: $background-img-minus;
        }
      }
    }

    &:disabled + label::before {
      background-color: var(--border-disabled, $border-disabled);
    }
  }
}
</style>
