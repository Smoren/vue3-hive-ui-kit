<script lang="ts" setup>
import { ref } from 'vue';
import { Value } from '@/common/types/value';
import HiveInput from '../hive-input/hive-input.vue';

const props = defineProps<{
  value: Value;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'delete', index: number): void;
  (e: 'edit', value: string, index: number): void;
}>();

const deleteValue = () => {
  emit('delete', props.index);
};

const editRef = ref(false);
const editValue = ref(props.value as string);

const edit = () => {
  if (editValue.value === '') {
    emit('delete', props.index);
  } else {
    emit('edit', editValue.value, props.index);
    editRef.value = false;
  }
};

const cancelEdit = () => {
  editValue.value = props.value as string;
  editRef.value = false;
};
</script>

<template>
  <div class="hive-multiselect__selected-item" @click.stop="editRef = true">
    <template v-if="!editRef">
      {{ value }}
      <font-awesome-icon
        class="hive-multiselect__selected-item__img"
        icon="fa-solid fa-xmark"
        size="md"
        @click="deleteValue"
      />
    </template>
    <hive-input
      v-else
      v-model="editValue"
      focus-on-mount
      @focusout="edit"
      @keydown.enter="edit"
      @keydown.esc="cancelEdit"
      class="hive-multiselect__selected-item__change"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
$height: var(--height, calc($common-widget-height - 10px));

.hive-multiselect__selected-item {
  box-sizing: border-box;
  border-radius: var(--border-radius, $border-radius);
  box-shadow: 0 0 0 1px #22242626 inset;
  padding: 5px 11px;
  vertical-align: baseline;
  background-color: var(--bg-multiautocomplete-item, $bg-multiautocomplete-item);
  color: var(--multiselect-text, $multiselect-text);
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 11px;
  white-space: nowrap;
  text-transform: none;
  font-size: 1em;
  font-weight: 500;
  height: $height;

  &__img {
    width: 1em;
    height: 1em;
    color: var(--text, $text);

    &:hover {
      cursor: pointer;
    }
  }

  &__change {
    height: 100%;
    width: fit-content;
    min-width: none;
    font-size: 14px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
