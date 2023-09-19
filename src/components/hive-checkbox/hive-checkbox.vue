<script lang="ts" setup>
import { ref, watch } from 'vue';
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
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import { CurrentOptions } from '@/common/types/select';

export interface Props extends CommonProps {
  option: [string, CurrentOptions] | undefined;
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

type Emit = Mount & Unmount & Update<boolean> & Change<boolean> & Focusout;
const emit = defineEmits<Emit>();
useOnMount(emit);

const currentValue = ref(props.modelValue ?? false);

if (props.checked) {
  currentValue.value = true;
}

watch(currentValue, (newValue) => {
  onUpdateModelValue(emit, newValue);
});
</script>

<template>
  <div class="hive-checkbox__item" v-if="option">
    <input
      v-model="currentValue"
      :checked="checked"
      :value="true"
      :id="`hive-checkbox-${option[1][valueField]}`"
      class="hive-checkbox__input"
      tabindex="0"
      type="checkbox"
      @change="onChange(emit, currentValue)"
      @focusout="onFocusout(emit)"
    />
    <label :for="`hive-checkbox-${option[1][valueField]}`" :class="{ minus: minusIcon }">
      {{ option[1][titleField] }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
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
